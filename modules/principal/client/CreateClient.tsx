import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CrearClientesModule = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const isEditing = Boolean(params.id);

  const [client, setClient] = useState({
    numero_documento: params.numero_documento || "",
    nombre: params.nombre || "",
    direccion: params.direccion || "",
    telefono: params.telefono || "",
    email: params.email || "",
    ciudad: params.ciudad || "",
    departamento: params.departamento || "",
  });

  const handleChange = (key, value) => {
    setClient((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no autenticado");
        return;
      }

      const user = JSON.parse(storedUser);
      const user_id = user.documento;
      console.log(user_id);

      const url = isEditing
        ? `https://facturax.lat/api/clientes/${params.id}`
        : "https://facturax.lat/api/clientes";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, user_id }),
      });

      const result = await response.json();
      console.log(client);

      if (response.ok) {
        alert(`Cliente ${isEditing ? "actualizado" : "creado"} con éxito`);
        router.replace("/principal/client/homeClient");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEditing ? "EDITAR CLIENTE" : "CREAR CLIENTE"}
        </Text>
        <View style={styles.row}>
          {/* <View style={styles.inputContainer}>
          <Text>Tipo numero_documento</Text>
          <Picker
            selectedValue={client.tipo_numero_documento}
            onValueChange={(value) => handleChange("tipo_numero_documento", value)}
          >
            <Picker.Item label="CC" value="cedula" />
            <Picker.Item label="Pasaporte" value="pasaporte" />
            <Picker.Item label="Nit" value="nit" />
            <Picker.Item label="CE" value="cedulae" />
          </Picker>
        </View> */}
          <View style={styles.inputContainer}>
            <Text>Identificación</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("numero_documento", value)}
              value={client.numero_documento}
            />
          </View>
        </View>
        <View style={styles.row}>
          {/* <View style={styles.inputContainer}>
          <Text>DV</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleChange("dv", value)}
            value={client.dv}
          />
        </View> */}
          <View style={styles.inputContainer}>
            <Text>Nombre</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("nombre", value)}
              value={client.nombre}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Correo</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("email", value)}
              value={client.email}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Telefono</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("telefono", value)}
              value={client.telefono}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Departamento</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("departamento", value)}
              value={client.departamento}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Ciudad</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("ciudad", value)}
              value={client.ciudad}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Direccion</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange("direccion", value)}
              value={client.direccion}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputContainer: { flex: 1, marginRight: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: "#ccc", height: 40 },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16 },
});

export default CrearClientesModule;
