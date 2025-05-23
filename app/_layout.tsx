import { Stack, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import InnerNavigator from "./InnerNavigation";

const DATABASE_NAME = "tasks";

const LayoutContent = () => {
  const { authState } = useAuth();

  if (authState.loading) {
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

const HomeLayout = () =>{
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}

export default HomeLayout;