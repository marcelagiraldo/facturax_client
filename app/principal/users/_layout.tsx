import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from "expo-router";

const _layout = () => {
  return (
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#003B73", // Color de fondo azul oscuro
          },
          headerTintColor: "#ffffff", // Texto del header en blanco
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
          headerShadowVisible: false, // Elimina la sombra del header
        }}
      >
        <Stack.Screen name="users" options={{ headerShown: false }} />
        <Stack.Screen name="createUser" options={{ headerShown: false }} />
      </Stack>
    );
}

export default _layout