import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Foundation,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import LogoImage from "../../components/atoms/LogoImage";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { schema } from "../../db/schema";
import { eq } from "drizzle-orm";

interface Note {
  id: string;
  title: string;
  date: string;
}
const NoteModule = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const result = await drizzleDb.query.notes.findMany();
        setNotes(result);
      } catch (error) {
        console.error("Error al obtener las notas desde SQLite:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteNote = async (id: string) => {
  try {
    await drizzleDb.delete(schema.notes).where(eq(schema.notes.id, Number(id)));
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  } catch (error) {
    console.error("Error al eliminar nota local:", error);
  }
};

  const renderItem: ListRenderItem<Note> = ({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.row}>
        <Foundation name="clipboard-notes" size={30} color="black" />
        <Text style={styles.noteTitle}>{item.title}</Text>
      </View>
      <View style={styles.rowd}>
        <FontAwesome name="calendar" size={24} color="black" />
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
      <View style={styles.icons}>
        <Pressable onPress={() => handleDeleteNote(item.id)}>
          <AntDesign name="checkcircle" size={30} color="green" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#003B73" style="light" />

      {/* Cabecera */}
      <View
        style={{
          flex: 0.5,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#003B73",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <LogoImage />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>Notas</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#003B73" />
        ) : (
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Botón flotante */}
      <View style={styles.fab}>
        <Pressable onPress={() => router.replace("/notes/createNote")}>
          <Ionicons name="add" size={50} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003B73",
  },
  content: {
    flex: 2,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noteItem: {
    backgroundColor: "#B9D4F4",
    borderRadius: 12,
    width: 300,
    marginBottom: 10,
    padding: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  noteDate: {
    fontSize: 14,
    width: 200,
  },
  icons: {
    position: "absolute",
    bottom: 10,
    right: 8,
    flexDirection: "row",
    gap: 15,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginTop: 20,
    marginRight: 10,
    padding: 10,
  },
  rowd: {
    flexDirection: "row",
    gap: 15,
    marginTop: 5,
    padding: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#003B73",
    borderRadius: 50,
  },
});

export default NoteModule;
