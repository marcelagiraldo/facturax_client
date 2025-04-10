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
import { Picker } from "@react-native-picker/picker";

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

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState({});

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
        router.replace("/principal/client/client");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.datos.gov.co/resource/xdk5-pm3f.json"
        );
        const data = await response.json();

        const departamentosUnicos = [
          ...new Set(data.map((item) => item.departamento)),
        ];
        setDepartamentos(departamentosUnicos.sort());

        const agrupadas = {};
        data.forEach((item) => {
          if (!agrupadas[item.departamento]) agrupadas[item.departamento] = [];
          agrupadas[item.departamento].push(item.municipio);
        });

        setCiudades(agrupadas);
      } catch (error) {
        console.error("Error al obtener datos de ciudades:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEditing ? "EDITAR CLIENTE" : "CREAR CLIENTE"}
        </Text>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Tipo documento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                onValueChange={(value) =>
                  handleChange("tipo_numero_documento", value)
                }
                style={styles.picker}
              >
                <Picker.Item label="CC" value="cedula" />
                <Picker.Item label="Pasaporte" value="pasaporte" />
                <Picker.Item label="Nit" value="nit" />
                <Picker.Item label="CE" value="cedulae" />
              </Picker>
            </View>
          </View>
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
        <View style={styles.inputContainer}>
          <Text>Departamento</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={client.departamento}
              onValueChange={(value) => {
                handleChange("departamento", value);
                handleChange("ciudad", ""); // reset ciudad cuando cambia dep
              }}
            >
              <Picker.Item label="Seleccione un departamento" value="" />
              {departamentos.map((dep, index) => (
                <Picker.Item key={index} label={dep} value={dep} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text>Ciudad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={client.ciudad}
              onValueChange={(value) => handleChange("ciudad", value)}
              enabled={!!client.departamento}
            >
              <Picker.Item label="Seleccione una ciudad" value="" />
              {client.departamento &&
                ciudades[client.departamento]?.map((city, index) => (
                  <Picker.Item key={index} label={city} value={city} />
                ))}
            </Picker>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 18,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  picker: {
    fontSize: 18,
  },
});

export default CrearClientesModule;
