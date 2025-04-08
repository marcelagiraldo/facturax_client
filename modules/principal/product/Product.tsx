import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductItem = ({ item, onEdit }) => (
  <View style={styles.card}>
    <Pressable style={styles.editButton} onPress={() => onEdit(item)}>
      <AntDesign name="edit" size={18} color="blue" />
    </Pressable>
    <Text style={styles.productName}>{item.descripcion}</Text>
    <Text>Código: {item.codigo}</Text>
    <Text>Precio: ${item.precio_venta}</Text>
    <Text>Iva: ${item.impuesto_id_fk}</Text>
    <View style={styles.statusContainer}>
      <Text style={styles.status}>ACTIVO</Text>
    </View>
  </View>
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para mostrar la carga


  const fetchProducts = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no autenticado");
        return;
      }

      const user = JSON.parse(storedUser);
      const user_id = user.documento;
      console.log("Usuario ID:", user_id);

      const response = await fetch(`https://facturax.lat/api/productos/${user_id}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    router.navigate("/principal/product/createProduct");
  };

  const handleEdit = (product) => {
    router.navigate({
      pathname: "/principal/product/createProduct",
      params: {
        id: product.id,
        codigo: product.codigo,
        descripcion: product.descripcion,
        precio_venta: product.precio_venta,
        impuesto_id_fk: product.impuesto_id_fk,
      },
    });
  };

  const filteredProducts = products.filter((product) =>
    product.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto"
          value={search}
          onChangeText={setSearch}
        />
        <AntDesign name="search1" size={24} color="black" />
      </View>

      <View style={styles.titleContainer}>
        <Pressable onPress={handleCreate}>
          <AntDesign name="pluscircle" size={40} color="green" />
        </Pressable>
        <Text style={styles.title}>PRODUCTOS</Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()} // Asegurar que sea una cadena
        renderItem={({ item }) => <ProductItem item={item} onEdit={handleEdit} />}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#e0e0e0",
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    position: "relative",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  statusContainer: {
    marginTop: 10,
    backgroundColor: "#00c853",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  status: {
    color: "white",
    fontWeight: "bold",
  },
});

export default App;
