import React, { useState, useEffect } from "react";

// ✅ Backend adresini doğrudan Render URL ile sabitliyoruz
const API_BASE = "https://fullstack-ai-chat-dpog.onrender.com";

export default function Chat({ nickname }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Mesajları her 3 saniyede bir yenile
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🟢 Mesajları backend'den al
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages?limit=50`);
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    }
  };

  // 🟢 Yeni mesaj gönder
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, text }),
      });

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setText("");
    } catch (err) {
      alert("Mesaj gönderilemedi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>👋 Hoş geldin, {nickname}</h2>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className="chat-line">
            <span className="nickname">{m.nickname || "Anonim"}:</span>
            <span className="text">{m.text}</span>
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

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Mesajınızı yazın..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}
