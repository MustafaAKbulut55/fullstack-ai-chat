// ============================================================
// 🚀 App.jsx
// Uygulamanın ana bileşenidir. Kullanıcıdan rumuz (nickname) alır,
// eğer kayıtlı bir rumuz varsa doğrudan Chat ekranına yönlendirir.
//
// Yapı:
//  - NicknameGate: kullanıcıdan rumuz alınan ekran
//  - Chat: mesajlaşma ve duygu analizi ekranı
// ============================================================

import React, { useState, useEffect } from "react";
import NicknameGate from "./components/NicknameGate";
import Chat from "./components/Chat";

export default function App() {
  // 🔹 Kullanıcının rumuzu (nickname)
  const [nickname, setNickname] = useState("");

  // ------------------------------------------------------------
  // 🔹 Uygulama açıldığında localStorage'dan kayıtlı rumuzu getir
  // ------------------------------------------------------------
  useEffect(() => {
    const savedName = localStorage.getItem("nickname");
    if (savedName) setNickname(savedName);
  }, []);

  // ------------------------------------------------------------
  // 🔹 Yeni rumuzu kaydet ve state’i güncelle
  // ------------------------------------------------------------
  const handleSaveNickname = (name) => {
    localStorage.setItem("nickname", name);
    setNickname(name);
  };

  // ------------------------------------------------------------
  // 🔹 Eğer rumuz yoksa giriş ekranını göster, varsa chat ekranını aç
  // ------------------------------------------------------------
  if (!nickname) return <NicknameGate onSave={handleSaveNickname} />;
  return <Chat nickname={nickname} />;
}
