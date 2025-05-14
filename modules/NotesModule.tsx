import React from "react";
import { View, Text, StyleSheet, Image, FlatList, ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Foundation,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import SvgTop from "../components/atoms/SvgTop";
import logo from "../assets/facturax.png";

const notes = [
  {
    id: "1",
    title: "Revisión médica anual de pacientes con condicion impoertante",
    date: "12/05/2025",
  },
  {
    id: "2",
    title: "Compra de suplementos",
    date: "15/05/2025",
  },
  {
    id: "3",
    title: "Actualizar historial clínico",
    date: "20/05/2025",
  },
  {
    id: "4",
    title: "Revisión médica anual de pacientes con condicion impoertante",
    date: "12/05/2025",
  },
  {
    id: "5",
    title: "Compra de suplementos",
    date: "15/05/2025",
  },
  {
    id: "6",
    title: "Actualizar historial clínico",
    date: "20/05/2025",
  },
];

const NoteModule = () => {
  interface Note {
    id: string;
    title: string;
    date: string;
  }
  const renderItem: ListRenderItem<Note>=({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.icons}>
        <AntDesign name="checkcircle" size={30} color="green" />
        <AntDesign name="closecircle" size={30} color="red" />
      </View>
      <View style={styles.row}>
        <Foundation name="clipboard-notes" size={30} color="black" />
        <Text style={styles.noteTitle}>{item.title}</Text>
      </View>
      <View style={styles.rowd}>
        <FontAwesome name="calendar" size={24} color="black" />
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} style="dark" />

      {/* Cabecera visual */}
      <View style={styles.header}>
        <SvgTop />
        <View style={styles.logoWrapper}>
          <Image source={logo} style={styles.logo} />
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>Notas</Text>
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.fab}>
        <Ionicons name="add" size={50} color="white" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.5,
    position: "relative",
    justifyContent: "flex-end",
    backgroundColor: "#003B73",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  logoWrapper: {
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 2,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noteItem: {
    padding: 8,
    backgroundColor: "#B9D4F4",
    borderRadius: 12,
    width: 350,
    position: "relative",
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  noteDate: {
    fontSize: 14,
  },
  icons: {
    position: "absolute",
    top: 8,
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
