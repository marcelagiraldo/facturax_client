import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgTop from "../../components/atoms/SvgTop";
import logo from "../../assets/facturax.png";
import { containers } from "../../components/Tokens";
import AntDesign from "@expo/vector-icons/AntDesign";
import CardInfo from "../../components/molecules/CardInfo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { usePushNotifications } from "../../hooks/usePushNotifications";

const HomeModule = () => {
  const { expoPushToken } = usePushNotifications();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const notification = async () =>{
    if (expoPushToken) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoPushToken.data,
          title: "Bienvenido",
          body: `El usaurio "${userData.nombre_}" ha ingresado con éxito.`,
        }),
      });
    }
  }

  useEffect(() => {

    

    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem("@userData");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Datos del usuario en AsyncStorage:", parsedUser);
        setUserData(parsedUser);

        try {
          const result = await axios.get(
            `${API_URL}/usuarios/${parsedUser.documento}`
          );
          setUserData(result.data);
          console.log("Datos del usuario desde el backend:", result.data);
        } catch (err) {
          console.error(
            "Error al obtener usuario:",
            err?.response?.data || err.message
          );
        }
      }
    };

    fetchUserData();
  }, []);

  const handleCreate = async () => {
    try {
      router.replace("/principal/bill/createPos");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar hidden={false} style="light" />
      <SvgTop />
      <View style={styles.logoContainer}>
        <Image source={logo} style={{ width: 120, height: 120 }} />
        {userData && (
        <Text style={styles.welcomeText}>¡Hola, {userData.nombre_}!</Text>
      )}
      </View>
      
      <View style={styles.container}>
        <Pressable style={styles.pos} onPress={handleCreate}>
          <Text style={styles.posText}>POS</Text>
        </Pressable>
        <View style={styles.content}>
          <CardInfo
            color="#0074D9"
            iconComponent={<AntDesign name="home" size={24} color="black" />}
            text="Ventas del día"
            amount="$ 0.00"
          />
          <CardInfo
            color="#0074D9"
            iconComponent={
              <Ionicons name="cash-outline" size={24} color="black" />
            }
            text="Ventas efectivos"
            amount="$ 0.00"
          />
          <CardInfo
            color="#0074D9"
            iconComponent={
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color="black"
              />
            }
            text="Ventas otros medios"
            amount="$ 0.00"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: 10, 
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffff",
    marginVertical: 10,
  },
  logoContainer: {
    position: "absolute",
    marginTop: 3,
    left: 20,
    flexDirection:'row',
    alignItems:'center'
  },
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    width: "100%",
    marginTop: 100,
  },
  card: {
    backgroundColor: "#4A90E2",
    width: 200,
    height: 150,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: "#FFB400",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  amount: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  pos: {
    position: "absolute",
    top: 20, 
    right: 20, 
    width: 100,
    height: 50,
    margin:5,
    marginBottom:35,
    backgroundColor: "#388E3C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  posText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    marginTop: 90,
    padding: 20,
    borderRadius: 10,
  },
});
export default HomeModule;
