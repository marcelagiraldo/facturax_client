import { Pressable, SafeAreaView, Task, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HeaderSection from "../components/organisms/HeaderSection";
import FooterSection from "../components/organisms/FooterSection";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "../db/schema";
import { addDummyData } from "../db/addDummyData";

const Home = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Task[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.notes.findMany();
        console.log("✅ Load data: ", data);
        setData(data);
      } catch (error) {
        console.error("❌ Error loading notes:", error);
      }
    };
    load();
  }, [authState]);
  console.log("👀 Renderizando Home con data:", data);
  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <StatusBar hidden={false} style="light" backgroundColor="" />
      <HeaderSection />
      <FooterSection />
    </SafeAreaView>
  );
};

export default Home;
