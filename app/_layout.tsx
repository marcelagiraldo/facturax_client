import { Stack, useRouter } from "expo-router";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { Suspense, useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator } from "react-native";
/* import {
  SQLiteProvider,
  openDatabaseSync,
  useSQLiteContext,
} from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { addDummyData } from "../db/addDummyData";
import { View } from "react-native-reanimated/lib/typescript/Animated"; */

/* Va en el index */
/* import * as schema from '../db/schema' */
export const DATABASE_NAME = "tasks";

const HomeLayoutContent = () => {
  /* const expoDB = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDB);
  const { success, error } = useMigrations(db, migrations); */

  /* const dbCall = useSQLiteContext()
  const drizzleDB = drizzle(dbCall,{schema}) */

  const { authState } = useAuth();
  const router = useRouter();

  useEffect(
    () => {
      if (authState?.authenticated === true) {
        router.replace("/principal");
      } else if (authState?.authenticated === false) {
        router.replace("/");
      }
      /*  if (success) {
      addDummyData(db);
    } */

      /* const load = async () =>{
      const data = await drizzleDB.query.tasks.findMany()
      console.log('Data',data);
    }

    load() */
    },[authState]
  );

  if (authState?.authenticated === null) {
    return (
    <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />
  );
  }

  return (
    /* <View>
      <Suspense>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
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
          ></Stack>
        </SQLiteProvider>
      </Suspense>
    </View> */

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
    ></Stack>
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
