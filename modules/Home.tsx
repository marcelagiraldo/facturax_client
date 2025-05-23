import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Task } from "react-native";
import FooterSection from "../components/organisms/FooterSection";
import HeaderSection from "../components/organisms/HeaderSection";
import { useAuth } from "../context/AuthContext";
import * as schema from "../db/schema";

const Home = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Task[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    if (authState.loading) return;
    console.log("🟡 authState actual:", authState);

    if (authState?.authenticated === true) {
      console.log("✅ Usuario autenticado, redirigiendo a /principal");
      router.replace("/principal");
    } else if (authState?.authenticated === false) {
      console.log("🔴 Usuario NO autenticado, redirigiendo a /");
      router.replace("/");
    }
    const load = async () => {
      try {
        const data = await drizzleDb.query.notes.findMany();
        setData(data);
      } catch (error) {
        console.error("❌ Error loading notes:", error);
      }
    };
    load();
  }, [authState]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <StatusBar hidden={false} style="light" backgroundColor="" />
      <HeaderSection />
      <FooterSection />
    </SafeAreaView>
  );
};

export default Home;
