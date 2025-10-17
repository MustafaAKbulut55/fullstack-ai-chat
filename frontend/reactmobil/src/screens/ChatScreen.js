// ============================================================
// 💬 ChatScreen.js
// Bu ekran, kullanıcıların gerçek zamanlı olarak mesaj gönderip
// AI destekli duygu analiz sonuçlarını görebileceği ana sohbet ekranıdır.
//
// Backend:  .NET 8 (Render’da host edilir)
// Frontend: React Native (Expo)
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// ------------------------------------------------------------
// 🔹 API bağlantı noktası
// Render üzerinde çalışan .NET backend servisine istek atılır.
// ------------------------------------------------------------
const API_BASE = "https://fullstack-ai-chat-dpog.onrender.com";

// ============================================================
// 🧩 ChatScreen Bileşeni
// route parametresinden gelen "nickname" değeri kullanılarak
// kullanıcının kimliği belirlenir.
// ============================================================
export default function ChatScreen({ route }) {
  const { nickname } = route.params; // Giriş ekranından gelen kullanıcı adı
  const [messages, setMessages] = useState([]); // Mesaj listesi
  const [text, setText] = useState(""); // Girilen mesaj
  const [loading, setLoading] = useState(false); // Gönderim sırasında loader kontrolü

  // ------------------------------------------------------------
  // 🔹 useEffect → Mesajların otomatik olarak çekilmesi
  // Uygulama açıldığında mesajları yükler ve her 3 saniyede bir yeniler.
  // ------------------------------------------------------------
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // 3 saniyede bir yenileme
    return () => clearInterval(interval); // Bellek sızıntısını önleme
  }, []);

  // ------------------------------------------------------------
  // 🔹 Mesajları API'den çekme
  // GET /api/messages → Son 50 mesaj alınır.
  // ------------------------------------------------------------
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages?limit=50`);
      const data = await res.json();
      setMessages(data.reverse()); // En yeni mesaj en altta olacak şekilde ters çevir
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    }
  };

  // ------------------------------------------------------------
  // 🔹 Mesaj Gönderme
  // POST /api/messages → Kullanıcı mesajı gönderir.
  // Backend, AI servisine gönderip duygu analizini yapar.
  // ------------------------------------------------------------
  const sendMessage = async () => {
    if (!text.trim()) return; // Boş mesaj engeli
    setLoading(true);

    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, text }), // Kullanıcı adı + mesaj
      });

      setText(""); // Input temizle
      fetchMessages(); // Listeyi yenile
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }

    setLoading(false);
  };

  // ------------------------------------------------------------
  // 🔹 Tek bir mesaj kutusunu render eder
  // Kullanıcı adı (sol), mesaj içeriği (ortada),
  // ve sentiment sonucu (sağda) gösterilir.
  // ------------------------------------------------------------
  const renderMessage = ({ item }) => (
    <View style={styles.messageBox}>
      <View style={styles.messageRow}>
        {/* Sol tarafta kullanıcı ve mesaj */}
        <Text style={styles.messageLeft}>
          <Text style={styles.nickname}>{item.nickname}: </Text>
          <Text style={styles.text}>{item.text}</Text>
        </Text>

        {/* Sağda AI duygu analizi sonucu */}
        <Text style={styles.sentimentRight}>{item.sentiment}</Text>
      </View>
    </View>
  );

  // ============================================================
  // 🔹 UI Yapısı
  // Üstte hoşgeldin metni, ortada mesaj listesi,
  // altta giriş kutusu ve "Gönder" butonu yer alır.
  // ============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.header}>👋 Hoş geldin, {nickname}</Text>

      {/* Mesaj listesi */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/* Mesaj gönderme alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor="#555"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Gönder</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================
// 🎨 Stil Tanımları
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 10,
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  messageBox: {
    backgroundColor: "#1e1e1e",
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },
  messageRow: {
    flexDirection: "row", // Mesaj ve sentiment yan yana
    justifyContent: "space-between", // Biri sola, biri sağa
    alignItems: "center",
  },
  messageLeft: {
    flexShrink: 1,
    color: "#fff",
    fontSize: 16,
  },
  nickname: {
    fontWeight: "bold",
    color: "#61dafb", // React mavisi
  },
  text: {
    color: "#fff",
  },
  sentimentRight: {
    color: "#9e9e9e",
    fontStyle: "italic",
    marginLeft: 10,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#333",
    paddingVertical: 5,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff", // 🔹 beyaz input alanı
    color: "#000",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
