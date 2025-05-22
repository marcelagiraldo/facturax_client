import { Pressable, SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HeaderSection from "../components/organisms/HeaderSection";
import FooterSection from "../components/organisms/FooterSection";
import { useRouter } from "expo-router";

const Home = () => {
  const [clients, setClients] = useState([]);
  const { authState } = useAuth();

  const router = useRouter();

  const goToNotes = () => {
    router.push("/notes");
  };

  useEffect(() => {
    console.log("authState:", authState);
    fetchData();
  }, [authState]);

  async function fetchData() {
    const response = await fetch("https://facturax.lat/api/clientes");
    const data = await response.json();
    setClients(data);
    console.log(data);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <StatusBar hidden={false} style="light" backgroundColor=""/>
      <HeaderSection />
      
      <FooterSection />
      <Text>Hola prueba</Text>
    </SafeAreaView>
  );
};

export default Home;
