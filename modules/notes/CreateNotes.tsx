import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { schema } from "../../db/schema"; // Asegúrate que esté bien la ruta

const CreateNotes = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const handleSave = async () => {
    if (!title || !date) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      await drizzleDb.insert(schema.notes).values({
        title,
        date,
      });

      Alert.alert("Éxito", "Nota guardada localmente.");
      router.replace("/notes/notes");
    } catch (error: any) {
      console.error("Error al guardar la nota local:", error);
      Alert.alert("Error", error.message || "No se pudo guardar la nota.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear Nota</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          placeholder="Ej. Revisión médica anual"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha</Text>
        <TextInput
          placeholder="DD/MM/YYYY"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Nota</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CreateNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003B73",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#003B73",
  },
  input: {
    borderWidth: 1,
    borderColor: "#003B73",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F2F9FF",
  },
  saveButton: {
    backgroundColor: "#003B73",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    alignSelf: "center",
    gap: 6,
  },
  backText: {
    fontSize: 16,
    color: "#003B73",
  },
});
