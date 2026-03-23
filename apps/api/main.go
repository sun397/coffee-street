package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	// Supabase JWT Secret (環境変数から取得)
	jwtSecret := os.Getenv("SUPABASE_JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("SUPABASE_JWT_SECRET is not set")
	}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
	}))

	// 認証ミドルウェア (Supabase JWT 検証)
	authMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenStr == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": "認証トークンがありません",
				})
			}

			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": "無効な認証トークンです",
				})
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": "無効な認証トークンです",
				})
			}

			// Supabase JWT の sub クレームにユーザー UUID が入っている
			userID, _ := claims["sub"].(string)
			c.Set("user_id", userID)
			return next(c)
		}
	}

	// 公開エンドポイント
	e.GET("/api/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "pong"})
	})

	// 認証が必要なエンドポイント
	adminGroup := e.Group("/api/admin")
	adminGroup.Use(authMiddleware)
	adminGroup.GET("/me", func(c echo.Context) error {
		userID := c.Get("user_id").(string)
		return c.JSON(http.StatusOK, map[string]string{
			"message": "あなたは認証されています！",
			"user_id": userID,
		})
	})

	e.Logger.Fatal(e.Start(":8080"))
}
