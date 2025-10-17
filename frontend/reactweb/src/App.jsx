import React, { useState, useEffect } from "react";
import NicknameGate from "./components/NicknameGate";
import Chat from "./components/Chat";

export default function App() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("nickname");
    if (savedName) setNickname(savedName);
  }, []);

  const handleSaveNickname = (name) => {
    localStorage.setItem("nickname", name);
    setNickname(name);
  };

  if (!nickname) return <NicknameGate onSave={handleSaveNickname} />;
  return <Chat nickname={nickname} />;
}
