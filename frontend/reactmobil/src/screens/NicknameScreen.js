// ============================================================
// 🧑‍💬 NicknameScreen.js
// Bu ekran, kullanıcıdan rumuz (nickname) bilgisini alır ve
// ChatScreen'e yönlendirir. Uygulamanın giriş (başlangıç) ekranıdır.
//
// Animasyonlu bir geçiş efekti (fade-in) içerir.
// Kullanıcı en az 2 karakterlik geçerli bir rumuz girmelidir.
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

// ============================================================
// 🧩 NicknameScreen Bileşeni
// navigation prop’u, React Navigation üzerinden gelir.
// "ChatScreen" ekranına nickname parametresi ile yönlendirme yapılır.
// ============================================================
export default function NicknameScreen({ navigation }) {
  // Kullanıcının girdiği rumuz
  const [nickname, setNickname] = useState("");

  // 🔹 Sayfa yüklendiğinde kartın opaklığını (fade animasyonu) kontrol eder
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ------------------------------------------------------------
  // 🎞 useEffect → Fade-in animasyonu
  // Ekran yüklendiğinde 0 → 1 opaklık geçişi yapılır (0.8 saniyede)
  // ------------------------------------------------------------
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // ------------------------------------------------------------
  // 🔹 handleContinue()
  // Kullanıcı rumuz girdiğinde çağrılır.
  // Boş veya 2 karakterden kısa girişlerde uyarı verir.
  // ------------------------------------------------------------
  const handleContinue = () => {
    if (nickname.trim().length < 2) {
      alert("Lütfen geçerli bir rumuz girin.");
      return;
    }
    // ChatScreen ekranına yönlendirme, parametre olarak nickname gönderilir
    navigation.navigate("ChatScreen", { nickname });
  };

  // ============================================================
  // 🔹 UI Yapısı
  // Ortalanmış kart, başlık ve input alanı içerir.
  // Animasyonlu View sayesinde yumuşak açılış efekti verilir.
  // ============================================================
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {/* 💬 Başlık (emoji + metin) */}
        <View style={styles.headerRow}>
          <Text style={styles.emoji}>💬</Text>
          <Text style={styles.title}>AI Chat</Text>
        </View>

        {/* 🔹 Kullanıcıdan rumuz alınır */}
        <TextInput
          style={styles.input}
          placeholder="Rumuzunuzu girin..."
          placeholderTextColor="#555"
          value={nickname}
          onChangeText={setNickname}
        />

        {/* 🔹 Devam Et butonu */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ============================================================
// 🎨 Stil Tanımları
// Koyu arka plan + beyaz input + mavi buton teması
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d", // koyu arka plan
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
    backgroundColor: "#fff", // 🔹 beyaz input alanı
    color: "#000", // siyah yazı
    marginBottom: 25,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007bff", // mavi buton
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
