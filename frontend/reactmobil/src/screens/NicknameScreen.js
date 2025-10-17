import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

export default function NicknameScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (nickname.trim().length < 2) {
      alert("Lütfen geçerli bir rumuz girin.");
      return;
    }
    navigation.navigate("ChatScreen", { nickname });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {/* 💬 + Başlık yan yana */}
        <View style={styles.headerRow}>
          <Text style={styles.emoji}>💬</Text>
          <Text style={styles.title}>AI Chat</Text>
        </View>

        {/* 🔹 Beyaz input alanı */}
        <TextInput
          style={styles.input}
          placeholder="Rumuzunuzu girin..."
          placeholderTextColor="#555"
          value={nickname}
          onChangeText={setNickname}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff", // 🔹 beyaz arka plan
    color: "#000", // 🔹 siyah yazı
    marginBottom: 25,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
