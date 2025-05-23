import React from 'react';
import { Stack, Tabs } from 'expo-router';

const BillLayout = () => {
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
          <Stack.Screen name="createPos" options={{ headerShown: false }} />
        </Stack>
  );
};

export default BillLayout;
