// ============================================================
// 💭 Chat.jsx
// Bu bileşen, kullanıcıların mesajlarını API’ye gönderip
// AI tarafından analiz edilen duygularla birlikte göstermesini sağlar.
//
// Backend: .NET 8 (Render üzerinde çalışıyor)
// Endpoint: /api/messages
// ============================================================

import React, { useState, useEffect } from "react";

// 🔹 API Base URL (Render backend)
const API_BASE = "https://fullstack-ai-chat-dpog.onrender.com";
console.log("API_BASE:", API_BASE);

export default function Chat({ nickname }) {
  const [messages, setMessages] = useState([]); // Sohbet geçmişi
  const [text, setText] = useState(""); // Kullanıcının yazdığı metin
  const [loading, setLoading] = useState(false); // Gönderim durumu

  // ------------------------------------------------------------
  // 🔹 İlk yüklemede mesajları çek ve her 3 saniyede yenile
  // ------------------------------------------------------------
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // 🔹 Mesajları GET /api/messages ile getir
  // ------------------------------------------------------------
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages?limit=50`);
      const data = await res.json();
      setMessages(data.reverse()); // Yeni mesaj en altta gözüksün
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    }
  };

  // ------------------------------------------------------------
  // 🔹 Mesaj gönderme (POST /api/messages)
  // Kullanıcı mesajı API’ye gönderir → AI sentiment döner → ekrana yansır.
  // ------------------------------------------------------------
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, text }),
      });

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      alert("Mesaj gönderilemedi!");
    } finally {
      // ✅ Her durumda input sıfırlanır ve yükleme durur
      setText("");
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🔹 Enter tuşuyla mesaj gönder (UX kolaylığı)
  // ------------------------------------------------------------
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage(e);
    }
  };

  // ------------------------------------------------------------
  // 🔹 UI: Chat ekranı düzeni
  // ------------------------------------------------------------
  return (
    <div className="chat-container">
      <h2>👋 Hoş geldin, {nickname}</h2>

      {/* Mesaj listesi */}
      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className="chat-message">
            <div>
              <span className="nickname">{m.nickname ?? "Anonim"}</span>:{" "}
              <span className="text">{m.text}</span>
            </div>

            {/* Duygu etiketi (renklendirme sınıfı ile) */}
            <span
              className={`sentiment ${
                m.sentiment === "Positive"
                  ? "positive"
                  : m.sentiment === "Negative"
                  ? "negative"
                  : "neutral"
              }`}
            >
              {m.sentiment}
            </span>
          </div>
        ))}
      </div>

      {/* Mesaj gönderme alanı */}
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Mesajınızı yazın..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}
