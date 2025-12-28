package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	// 1. CORSミドルウェアの設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		// 開発中は localhost:3000 (Admin) と 3001 (User) 両方を許可
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// 2. ロガーとリカバリー（エラーで落ちないため）の追加
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// 3. テスト用エンドポイント
	e.GET("/api/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"message": "pong from Go API",
		})
	})

	// 8080ポートで起動
	e.Logger.Fatal(e.Start(":8080"))
}
