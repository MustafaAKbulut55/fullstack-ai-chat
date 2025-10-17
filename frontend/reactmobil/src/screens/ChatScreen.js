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

const API_BASE = "https://fullstack-ai-chat-dpog.onrender.com";

export default function ChatScreen({ route }) {
  const { nickname } = route.params;
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

  const sendMessage = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, text }),
      });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
    setLoading(false);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageBox}>
      <View style={styles.messageRow}>
        <Text style={styles.messageLeft}>
          <Text style={styles.nickname}>{item.nickname}: </Text>
          <Text style={styles.text}>{item.text}</Text>
        </Text>
        <Text style={styles.sentimentRight}>{item.sentiment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👋 Hoş geldin, {nickname}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

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
    flexDirection: "row", // 🔹 yan yana hizalama
    justifyContent: "space-between", // 🔹 biri sola, biri sağa
    alignItems: "center",
  },
  messageLeft: {
    flexShrink: 1,
    color: "#fff",
    fontSize: 16,
  },
  nickname: {
    fontWeight: "bold",
    color: "#61dafb",
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
    backgroundColor: "#fff", // 🔹 beyaz input
    color: "#000",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
