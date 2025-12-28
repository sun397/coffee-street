package main

import (
	"context"
	"log"
	"net/http"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"google.golang.org/api/option"
)

func main() {
	e := echo.New()

	// 1. Firebase Admin SDK の初期化
	ctx := context.Background()
	opt := option.WithServiceAccountFile("service-account.json")
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
	}))

	// 2. 認証ミドルウェア
	authMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Authorizationヘッダーから "Bearer <TOKEN>" を取得
			authHeader := c.Request().Header.Get("Authorization")
			idToken := strings.Replace(authHeader, "Bearer ", "", 1)

			// トークンの検証
			token, err := authClient.VerifyIDToken(context.Background(), idToken)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": "無効な認証トークンです",
				})
			}

			// ユーザー情報をコンテキストにセット（後で取り出せるようにする）
			c.Set("user_id", token.UID)
			return next(c)
		}
	}

	// 公開エンドポイント
	e.GET("/api/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "pong"})
	})

	// 3. 認証が必要なエンドポイント（秘密のエリア）
	adminGroup := e.Group("/api/admin")
	adminGroup.Use(authMiddleware)
	adminGroup.GET("/me", func(c echo.Context) error {
		userId := c.Get("user_id").(string)
		return c.JSON(http.StatusOK, map[string]string{
			"message": "あなたは認証されています！",
			"user_id": userId,
		})
	})

	e.Logger.Fatal(e.Start(":8080"))
}
