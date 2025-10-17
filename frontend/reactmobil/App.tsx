// ============================================================
// 🚀 App.js
// Uygulamanın ana giriş noktasıdır.
// React Navigation yapısını kullanarak sayfa geçişlerini yönetir.
//
// Ekranlar:
//  - NicknameScreen: Kullanıcı rumuzu girer
//  - ChatScreen: Mesajlaşma ve duygu analizi ekranı
// ============================================================

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 🔹 Ekran bileşenleri
import NicknameScreen from "./src/screens/NicknameScreen";
import ChatScreen from "./src/screens/ChatScreen";

// ------------------------------------------------------------
// 🔹 Stack Navigator
// Uygulamadaki sayfa geçişlerini yönetir (Stack mantığıyla).
// ------------------------------------------------------------
const Stack = createNativeStackNavigator();

// ============================================================
// 🧩 App Bileşeni
// Tüm uygulamayı NavigationContainer içinde sarmalar.
// Bu yapı, ekranlar arasında yönlendirme yapılmasını sağlar.
// ============================================================
export default function App() {
  return (
    // Navigation yapısının kökü
    <NavigationContainer>
      {/* Stack yapısında iki ekran tanımlanır */}
      <Stack.Navigator
        initialRouteName="NicknameScreen" // İlk açılacak ekran
        screenOptions={{
          headerShown: false, // 🔹 Üst başlık (navbar) gizlendi
        }}
      >
        {/* 🔹 Kullanıcıdan rumuz alınan giriş ekranı */}
        <Stack.Screen name="NicknameScreen" component={NicknameScreen} />

        {/* 🔹 Chat ekranı (AI ile mesajlaşma ve duygu analizi) */}
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============================================================
// 📘 ÖZET:
//  - NavigationContainer: Navigasyon sisteminin kökü
//  - Stack.Navigator: Sayfa yığınını (stack) yönetir
//  - headerShown: false → üst başlık gizlenir
//  - NicknameScreen → ChatScreen yönlendirmesi yapılır
// ============================================================
