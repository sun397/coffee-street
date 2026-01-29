package routes

import (
	"encoding/json"
	"net/http"
)

type ProductsBean struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Origin      string   `json:"origin"`
	RoastLevel  int      `json:"roastLevel"`
	FlavorTags  []string `json:"flavorTags"` 
	Price       int      `json:"price"`
	StockWeight float64  `json:"stockWeight"`
	Status      string   `json:"status"`
}

func RegisterInventoryRoutes() {
		mockData := []ProductsBean{
		{
			ID:          "1",
			Name:        "エチオピア ウォルカ",
			Origin:      "エチオピア",
			RoastLevel:  2,
			FlavorTags:  []string{"シトラス", "紅茶"},
			Price:       950,
			StockWeight: 12.5,
			Status:      "active",
		},
		{
			ID:          "2",
			Name:        "ブラジル サントス",
			Origin:      "ブラジル",
			RoastLevel:  4,
			FlavorTags:  []string{"ナッツ", "チョコ"},
			Price:       780,
			StockWeight: 4.2,
			Status:      "active",
		},
		{
			ID:          "3",
			Name:        "コロンビア スプレモ",
			Origin:      "コロンビア",
			RoastLevel:  3,
			FlavorTags:  []string{"キャラメル"},
			Price:       820,
			StockWeight: 0,
			Status:      "archived",
		},
	}

	http.HandleFunc("/api/inventory/get", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		
		json.NewEncoder(w).Encode(mockData)
	})
}