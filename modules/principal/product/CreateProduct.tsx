import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePushNotifications } from "../../../hooks/usePushNotifications";

const CreateProduct = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEditing = Boolean(params.id); // Verifica si se está editando o creando
  const [product, setProduct] = useState({
    codigo: params.codigo || "",
    descripcion: params.descripcion || "",
    precio_venta: params.precio_venta || "",
    impuesto_id_fk: params.impuesto_id_fk || "",
  });
  const { expoPushToken, notification } = usePushNotifications();
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await fetch("https://facturax.lat/api/impuestos");
        const data = await response.json();
        setTaxes(data);
      } catch (error) {
        console.error("Error al obtener impuestos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const handleChange = (key, value) => {
    setProduct({ ...product, [key]: value });
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

      const url = isEditing
        ? `https://facturax.lat/api/productos/${params.id}`
        : "https://facturax.lat/api/productos";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, user_id }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Producto ${isEditing ? "actualizado" : "creado"} con éxito`);

        if (expoPushToken) {
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: expoPushToken.data,
              title: "Producto Agregado",
              body: `El producto "${product.descripcion}" ha sido ${isEditing ? "actualizado" : "creado"} con éxito.`,
            }),
          });
        }
        router.replace("/principal/product/product");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "EDITAR PRODUCTO" : "CREAR PRODUCTO"}
      </Text>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text>Código</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange("codigo", text)}
            value={product.codigo}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange("descripcion", text)}
            value={product.descripcion}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text>Precio</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange("precio_venta", text)}
            value={product.precio_venta}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Iva</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={product.impuesto_id_fk}
              onValueChange={(itemValue) =>
                handleChange("impuesto_id_fk", itemValue)
              }
            >
              <Picker.Item label="Seleccione un impuesto..." value="" />
              {taxes.map((tax) => (
                <Picker.Item
                  key={tax.p_identificacion}
                  label={`${tax.p_nombre} (${tax.p_porcentaje}%)`}
                  value={tax.p_identificacion}
                />
              ))}
            </Picker>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEditing ? "Guardar Cambios" : "Aceptar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "48%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 8,
  },
  picker: {
    height: 40,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default CreateProduct;
