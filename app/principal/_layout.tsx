import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/organisms/CustomDrawer";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ActivityIndicator } from "react-native";

const PrincipalLayout = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem("@userData");
        const user = userData ? JSON.parse(userData) : null;

        // Normaliza el rol (por si viene en mayúsculas o con espacios)
        const rolNormalizado = user?.rol?.trim()?.toLowerCase() || null;
        console.log("Rol del usuario normalizado:", rolNormalizado);
        setUserRole(rolNormalizado);
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003B73" />
        <Text>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: "#003B73" },
          headerTintColor: "#fff",
          drawerType: "slide",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Drawer.Screen
          name="home"
          options={{ drawerLabel: "Home", title: "" }}
        />
        <Drawer.Screen
          name="bill"
          options={{ drawerLabel: "Facturas", title: "" }}
        />
        <Drawer.Screen
          name="client"
          options={{ drawerLabel: "Clientes", title: "" }}
        />
        <Drawer.Screen
          name="product"
          options={{ drawerLabel: "Productos", title: "" }}
        />
        <Drawer.Screen
          name="users"
          options={{ drawerLabel: "Usuarios", title: "" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default PrincipalLayout;
