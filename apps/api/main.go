package main

import (
	"context"
	"log"
	"net/http"
	"strings"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/api/option"
)

// エンティティ定義
type Shop struct {
	ID          string `json:"id" firestore:"-"`
	Name        string `json:"name" firestore:"name"`
	Description string `json:"description" firestore:"description"`
	Location    string `json:"location" firestore:"location"`
}

func main() {
	e := echo.New()
	ctx := context.Background()

	// 1. Firebase Admin SDK / Firestore の初期化
	opt := option.WithServiceAccountFile("service-account.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	// Firestore クライアントを初期化
	fsClient, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}
	defer fsClient.Close()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions, http.MethodPatch},
	}))

	// 2. 認証ミドルウェア (既存のものをそのまま利用)
	authMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			idToken := strings.Replace(authHeader, "Bearer ", "", 1)
			if idToken == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"message": "トークンがありません"})
			}

			token, err := authClient.VerifyIDToken(context.Background(), idToken)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"message": "無効な認証トークンです"})
			}

			c.Set("user_id", token.UID)
			return next(c)
		}
	}

	// --- ルーティング ---

	// 公開エンドポイント
	e.GET("/api/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "pong"})
	})

	// 管理者用グループ (認証が必要)
	adminGroup := e.Group("/api/admin")
	adminGroup.Use(authMiddleware)

	// ユーザー情報確認
	adminGroup.GET("/me", func(c echo.Context) error {
		userId := c.Get("user_id").(string)
		return c.JSON(http.StatusOK, map[string]string{
			"message": "あなたは認証されています！",
			"user_id": userId,
		})
	})

	// Shop 情報取得 (認証されたユーザー自身の店舗情報を取得)
	adminGroup.GET("/shop", func(c echo.Context) error {
		// ミドルウェアでセットされたUIDを取得
		uid := c.Get("user_id").(string)
		ctx := context.Background()

		// 自分のUIDをドキュメントIDとして検索
		doc, err := fsClient.Collection("shops").Doc(uid).Get(ctx)
		if err != nil {
			// まだ店舗情報が登録されていない場合
			return c.JSON(http.StatusNotFound, map[string]string{
				"message": "店舗情報が見つかりません。セットアップが必要です。",
			})
		}

		var shop Shop
		if err := doc.DataTo(&shop); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to parse data"})
		}
		shop.ID = doc.Ref.ID

		return c.JSON(http.StatusOK, shop)
	})

	// Shop 情報の登録・更新 (Upsert)
	adminGroup.PATCH("/shop", func(c echo.Context) error {
		uid := c.Get("user_id").(string)
		ctx := context.Background()

		// フロントエンドから送られてくるリクエストボディをバインド
		// IDはUIDを使うため、NameとDescriptionだけを受け取る
		type UpdateRequest struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		}
		req := new(UpdateRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": "リクエスト形式が正しくありません"})
		}

		// Firestore のドキュメント参照 (コレクション: shops, ドキュメントID: UID)
		docRef := fsClient.Collection("shops").Doc(uid)

		// データの保存 (Set は既存があれば上書き、なければ作成)
		// MergeAll を指定することで、指定したフィールド以外（もしあれば）を破壊せずに更新できます
		_, err := docRef.Set(ctx, map[string]interface{}{
			"name":        req.Name,
			"description": req.Description,
		}, firestore.MergeAll)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "保存に失敗しました"})
		}

		return c.JSON(http.StatusOK, map[string]string{"message": "店舗情報を更新しました"})
	})

	e.Logger.Fatal(e.Start(":8080"))
}
