import React, { useState } from "react";

export default function NicknameGate({ onSave }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return alert("Lütfen geçerli bir rumuz girin.");
    onSave(name.trim());
  };

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
