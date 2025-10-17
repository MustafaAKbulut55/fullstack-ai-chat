import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NicknameScreen from "./src/screens/NicknameScreen";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NicknameScreen">
        <Stack.Screen
          name="NicknameScreen"
          component={NicknameScreen}
          options={{ title: "Enter Nickname" }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ title: "Chat Room" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
