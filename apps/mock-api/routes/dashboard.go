package routes

import (
	"encoding/json"
	"net/http"
)

func RegisterDashboardRoutes() {
	http.HandleFunc("/api/dashboard/products", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		
		data := map[string]string{"message": "在庫リストを返します"}
		json.NewEncoder(w).Encode(data)
	})
}