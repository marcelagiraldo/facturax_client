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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CreateNotes = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (!title || !date) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    // Aquí podrías guardar en una API o base de datos
    console.log("Nota creada:", { title, date });

    Alert.alert("Éxito", "Nota guardada correctamente.");
    router.back(); // Vuelve a la pantalla anterior
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
          placeholder="DD/MM/AAAA"
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
