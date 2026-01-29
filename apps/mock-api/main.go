package main

import (
	"fmt"
	"mock-api/routes"
	"net/http"
)

func main() {
	// 各ファイルの登録関数を実行
	routes.RegisterInventoryRoutes()
	routes.RegisterDashboardRoutes()

	fmt.Println("Mock Server started on http://localhost:8081")
	// サーバーを起動（nilは標準のマルチプレクサを使うという意味）
	http.ListenAndServe(":8081", nil)
}