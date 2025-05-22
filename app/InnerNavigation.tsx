// components/InnerNavigator.tsx
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import * as schema from "../db/schema";
import { addDummyData } from "../db/addDummyData";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

const InnerNavigator = () => {
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite, { schema });
  console.log("🔍 schema:", schema);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      console.log("✅ Migraciones aplicadas con éxito");
      addDummyData(db); // Aquí ya sí estamos usando el db correcto
    }
    if (error) {
      console.error("❌ Error aplicando migraciones:", error);
    }
  }, [success, error]);

  if (!success && !error) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#003B73",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Principal" }} />
    </Stack>
  );
};

export default InnerNavigator;
