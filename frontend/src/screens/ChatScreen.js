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

  // 🔹 Mesajları düzenli olarak çek
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
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.sentimentBadge(item.sentiment)}>
        <Text style={styles.sentimentText}>{item.sentiment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  messageBox: {
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  nickname: { fontWeight: "bold", color: "#333" },
  text: { fontSize: 16, marginVertical: 5 },
  sentimentBadge: (sentiment) => ({
    alignSelf: "flex-start",
    backgroundColor:
      sentiment === "Positive"
        ? "#4caf50"
        : sentiment === "Negative"
        ? "#f44336"
        : "#9e9e9e",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  }),
  sentimentText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
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
