import { View, Pressable, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "expo-sqlite/kv-store";

const CustomDrawer = (props: any) => {
  const router = useRouter();
  const { onLogout } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const handleToggleDrawer = () => {
    props.navigation.closeDrawer();
  };

  const handleLogout = async () => {
    try {
      await onLogout?.();
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const fetchUsers = async () => {
    const storedUser = await AsyncStorage.getItem("@userData");
    if (!storedUser) {
      alert("Usuario no autenticado");
      return;
    }

    const user = JSON.parse(storedUser);
    const rolNormalizado = user?.rol?.trim()?.toLowerCase() || null;
    setUserRole(rolNormalizado);
  };
  useEffect(() => {fetchUsers});

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <StatusBar hidden={false} style="light" />
      <View style={styles.header}>
        <Pressable onPress={handleToggleDrawer} style={styles.closeButton}>
          <AntDesign name="close" size={35} />
        </Pressable>
      </View>

      <View style={styles.drawerMenu}>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.replace("/principal/home")}
        >
          <AntDesign name="home" size={24} />
          <Text style={styles.menuText}>Inicio</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.replace("/principal/bill")}
        >
          <AntDesign name="profile" size={24} />
          <Text style={styles.menuText}>Facturas</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.replace("/principal/client")}
        >
          <AntDesign name="team" size={24} />
          <Text style={styles.menuText}>Clientes</Text>
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.replace("/principal/product")}
        >
          <AntDesign name="appstore1" size={24} />
          <Text style={styles.menuText}>Productos</Text>
        </Pressable>
        {userRole === "admin" && (
          <Pressable
            style={styles.menuItem}
            onPress={() => router.replace("/principal/users")}
          >
            <AntDesign name="team" size={24} />
            <Text style={styles.menuText}>Usuarios</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.logoutContainer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={30} />
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
  },
  closeButton: {
    padding: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  menuText: {
    marginLeft: 20,
    fontSize: 20,
    width: "100%",
  },
  drawerMenu: {
    flex: 1,
    paddingTop: 20,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    alignSelf: "flex-start",
    padding: 5,
  },
});

export default CustomDrawer;
