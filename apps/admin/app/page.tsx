"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [message, setMessage] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // GoのAPIエンドポイントを叩く
    fetch("http://localhost:8080/api/ping")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setMessage(data.message); // Goから返ってきた "pong from Go API" をセット
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("APIとの接続に失敗しました。Goのサーバーが動いているか確認してください。");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Coffee Street - Admin</h1>
      <div style={{ 
        marginTop: "20px", 
        padding: "20px", 
        borderRadius: "8px", 
        background: error ? "#fee2e2" : "#f3f4f6",
        border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`
      }}>
        <p><strong>API Status:</strong></p>
        <p style={{ fontSize: "1.2rem", color: error ? "#b91c1c" : "#059669" }}>
          {error || message}
        </p>
      </div>
    </div>
  );
}
