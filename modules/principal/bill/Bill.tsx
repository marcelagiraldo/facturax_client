import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import SearchBar from "../../../components/molecules/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BillModule = () => {
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [search, setSearch] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const filteredFacturas = facturas.filter((factura: any) =>
    factura.numero_factura.toLowerCase().includes(search.toLowerCase())
  );

  const fetchFacturas = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no encontrado");
        return;
      }

      const user = JSON.parse(storedUser);
      const rolNormalizado = user?.rol?.trim()?.toLowerCase() || null;
      setUserRole(rolNormalizado);
      const adminId =
        rolNormalizado === "admin" ? user.documento : user.administrador_id;
      console.log('Admin ID: ',adminId);
      
      const response = await fetch(
        `https://facturax.lat/api/facturas/${adminId}`
      );
      const data = await response.json();

      setFacturas(data);
    } catch (error) {
      console.log("Error al obtener las facturas: ", error);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  const toggleDetails = (id: any) => {
    setSelectedFactura(selectedFactura === id ? null : id);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: "#f9f9f9",
        marginVertical: 8,
        padding: 16,
        borderRadius: 8,
      }}
    >
      <TouchableOpacity onPress={() => toggleDetails(item.id)}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.numero_factura}
        </Text>
        <Text>Cliente: {item.cliente_nombre}</Text>
        <Text>Total: {item.total_pagar}</Text>
      </TouchableOpacity>
      {selectedFactura === item.id && (
        <View style={{ marginTop: 10 }}>
          {/* <Text>Método de Pago: {item.metodoPago}</Text> */}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity style={{ marginRight: 20 }}>
              <FontAwesome name="file-pdf-o" size={24} color="red" />
            </TouchableOpacity>
            {userRole === "admin" && (
            <TouchableOpacity>
              <FontAwesome name="print" size={24} color="black" />
            </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Buscar cliente"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>FACTURAS</Text>
      </View>
      <FlatList
        data={filteredFacturas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    padding: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default BillModule;
