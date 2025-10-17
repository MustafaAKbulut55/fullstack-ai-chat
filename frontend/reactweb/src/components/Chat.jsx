import React, { useState, useEffect } from "react";

const API_BASE = "https://fullstack-ai-chat-dpog.onrender.com";

console.log("API_BASE:", API_BASE);


export default function Chat({ nickname }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages?limit=50`);
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    }
  };

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
          <div key={m.id} className="chat-message">
            <div>
             <span className="nickname">{m.nickname}</span>:
              <span className="text">{m.text}</span>
            </div>
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
