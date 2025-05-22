    import { View, Text } from 'react-native'
    import React from 'react'
    import { Stack } from 'expo-router'
    
    const NoteLayout = () => {
        return <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#003B73" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="notes" options={{ title: ""}} />
        <Stack.Screen name="createNote" options={{ title: "" }} />
      </Stack>
    }
    export default NoteLayout