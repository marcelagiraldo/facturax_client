import { drizzle } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";
import {openDatabaseAsync, openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
/* import {
  SQLiteProvider,
  openDatabaseSync,
  useSQLiteContext,
} from "expo-sqlite"; */
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { addDummyData } from "~/db/addDummyData";
import migrations from "~/drizzle/migrations";
//import { addDummyData } from "../db/addDummyData";
//import { View } from "react-native-reanimated/lib/typescript/Animated";

/* Va en el index */
import * as schema from '../db/schema'
import InnerNavigator from "./InnerNavigation";
export const DATABASE_NAME = "tasks";

const HomeLayoutContent = () => {
  const { authState } = useAuth();

  if (authState?.authenticated === null) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <InnerNavigator />
        </SQLiteProvider>
      </Suspense>
    </View>
  );
};


const HomeLayout = () => {
  return (
    <AuthProvider>
      <HomeLayoutContent />
    </AuthProvider>
  );
};

export default HomeLayout;
