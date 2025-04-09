import { Stack, useRouter } from "expo-router";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

const HomeLayoutContent = () => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated === true) {
      router.replace("/principal"); // redirige si está autenticado
    } else if (authState?.authenticated === false) {
      router.replace("/"); // redirige si NO está autenticado
    }
  }, [authState]);

  if (authState?.authenticated === null) {
    return null; // o un loading
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
    </Stack>
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
