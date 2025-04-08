import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer = (props: any) => {
  const handleToggleDrawer = () => {
    props.navigation.closeDrawer();
  };
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@userToken"); // Elimina el token almacenado
      await AsyncStorage.removeItem("@userData"); // Elimina los datos del usuario
      router.replace("/login"); // Reemplaza la pantalla actual con la de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Botón de cerrar */}
      <StatusBar hidden={false} style="light" />
      <View style={styles.header}>
        <Pressable onPress={handleToggleDrawer} style={styles.closeButton}>
          <AntDesign name="close" size={35} />
        </Pressable>
      </View>

      {/* Menú de navegación */}
      <View style={styles.drawerMenu}>
        <DrawerItemList {...props} />
      </View>

      {/* Botón de logout */}
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
