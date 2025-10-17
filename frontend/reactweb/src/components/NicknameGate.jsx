// ============================================================
// 💬 NicknameGate.jsx
// Kullanıcıdan rumuz bilgisini alan basit form bileşenidir.
// Form gönderildiğinde rumuz "App.jsx"e iletilir.
// ============================================================

import React, { useState } from "react";

export default function NicknameGate({ onSave }) {
  const [name, setName] = useState("");

  // ------------------------------------------------------------
  // 🔹 Form gönderimi (Enter veya buton)
  // Rumuz 2 karakterden azsa kullanıcı uyarılır.
  // ------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return alert("Lütfen geçerli bir rumuz girin.");
    onSave(name.trim());
  };

  // ------------------------------------------------------------
  // 🔹 UI: Giriş ekranı kart tasarımı
  // ------------------------------------------------------------
  return (
    <div className="gate-container">
      <h1>💬 AI Chat</h1>
      <form onSubmit={handleSubmit} className="gate-form">
        <input
          type="text"
          placeholder="Rumuzunuzu girin..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Devam Et</button>
      </form>
    </div>
  );
}
