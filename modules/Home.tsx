import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import HeaderSection from "../components/organisms/HeaderSection";
import FooterSection from "../components/organisms/FooterSection";

const Home = () => {
  const insets = useSafeAreaInsets();
  const [clients, setClients] = useState([]);
  const { authState } = useAuth();

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
      <StatusBar hidden={false} style="light" />
      <HeaderSection />
      <FooterSection />
    </SafeAreaView>
  );
};

export default Home;
