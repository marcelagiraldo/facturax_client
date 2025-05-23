import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { usePushNotifications } from "~/hooks/usePushNotifications";

const CreateBill = () => {
  const route = useRoute();
  const { cliente, totalIVA, cantidadProductos, total } = route.params;
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>("efectivo");
  const { expoPushToken } = usePushNotifications();

  const productos = JSON.parse(route.params.productos);

  const crearFactura = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no encontrado");
        return;
      }

      const user = JSON.parse(storedUser);
      const rolNormalizado = user?.rol?.trim()?.toLowerCase() || null;
      setUserRole(rolNormalizado);
      const user_id =
        rolNormalizado === "admin" ? user.documento : user.administrador_id;

      const payload = {
        numero_factura: `FAC-${Math.floor(Math.random() * 10000)}`,
        cliente_documento: cliente,
        administrador_id: user_id, // reemplaza con el real
        productos: productos.map((p) => p.codigo),
        cantidades: productos.map((p) => p.cantidad),
        metodoPago: metodoPago,
      };
      console.log("payload: ", payload);

      const response = await fetch("https://facturax.lat/api/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear factura");
      }
      router.replace("principal/pos/createPos");

      if (expoPushToken) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: expoPushToken.data,
            title: "Factura creada",
            body: `La factura "${payload.numero_factura}" ha sido creada.`,
          }),
        });
      }
    } catch (error) {
      console.error("Error al crear factura:", error.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>Resumen de Factura</Text>
        <Pressable style={styles.pos} onPress={crearFactura}>
          <Text style={styles.posText}>Confirmar</Text>
        </Pressable>
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.label}>
          Cliente: <Text style={styles.value}>{cliente}</Text>
        </Text>
        <Text style={styles.label}>
          Total impuesto:{" "}
          <Text style={styles.value}>${totalIVA.toLocaleString()}</Text>
        </Text>
        <Text style={styles.label}>
          Cantidad productos:{" "}
          <Text style={styles.value}>{cantidadProductos}</Text>
        </Text>
        <Text style={styles.label}>
          Total: <Text style={styles.value}>${total.toLocaleString()}</Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>Productos:</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.codigo.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.descripcion}</Text>
            <Text style={styles.productPrice}>
              ${item.precio_venta.toLocaleString()}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.metodoPagoContainer}>
        <Text style={styles.label}>Método de pago:</Text>
        <View style={styles.buttonGroup}>
          {["efectivo", "transferencia", "tarjeta"].map((metodo) => (
            <Pressable
              key={metodo}
              style={[
                styles.metodoButton,
                metodoPago === metodo && styles.metodoButtonSelected,
              ]}
              onPress={() => setMetodoPago(metodo)}
            >
              <Text
                style={[
                  styles.metodoButtonText,
                  metodoPago === metodo && styles.metodoButtonTextSelected,
                ]}
              >
                {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CreateBill;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  summaryBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  value: {
    fontWeight: "normal",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  containerHeader: {
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pos: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
    marginLeft: 50,
  },
  posText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  metodoPagoContainer: {
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  metodoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  metodoButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  metodoButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  metodoButtonTextSelected: {
    color: "#fff",
  },
});
