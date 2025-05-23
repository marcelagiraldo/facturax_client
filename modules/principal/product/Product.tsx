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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBar from "../../../components/molecules/SearchBar";

const ProductItem = ({ item, onEdit, userRole, onDelete }) => (
  <View style={styles.card}>
    <Text style={styles.productName}>{item.descripcion}</Text>
    <Text style={styles.textContent}>Código: {item.codigo}</Text>
    <Text style={styles.textContent}>Precio: ${item.precio_venta}</Text>
    <Text style={styles.textContent}>Iva: ${item.impuesto_id_fk}</Text>
    {userRole === "admin" && (
      <TouchableOpacity
        style={[
          styles.statusContainer,
          { backgroundColor: item.estado === "activo" ? "#00c853" : "#d32f2f" }, // verde o rojo
        ]}
        onPress={() => onDelete(item.codigo)}
      >
        <Text style={styles.status}>{item.estado}</Text>
      </TouchableOpacity>
    )}
    {userRole === "admin" && (
      <Pressable style={styles.editButton} onPress={() => onEdit(item)}>
        <MaterialIcons name="edit" size={20} color="black" />
      </Pressable>
    )}
  </View>
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://facturax.lat/api/productos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Producto marcado como inactivo");
        fetchProducts(); // Refresca la lista
      } else {
        alert("No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Ocurrió un error");
    }
  };

  const fetchProducts = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no autenticado");
        return;
      }

      const user = JSON.parse(storedUser);

      const rolNormalizado = user?.rol?.trim()?.toLowerCase() || null;
      setUserRole(rolNormalizado);
      const user_id =
        rolNormalizado === "admin" ? user.documento : user.administrador_id;

      console.log("Usuario ID:", user_id, "| Rol:", rolNormalizado);
      let response;

      if (rolNormalizado === "admin") {
        response = await fetch(`https://facturax.lat/api/productos/${user_id}`);
      } else {
        response = await fetch(
          `https://facturax.lat/api/productos/inactivo/${user_id}`
        );
      }

      const data = await response.json();
      console.log("************Data de productos\n", data);

      setProducts(data);
      console.log("Es array:", Array.isArray(data));
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    if (userRole === "admin") {
      router.push("/principal/product/createProduct");
    }
  };

  const handleEdit = (product) => {
    router.push({
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

  const filteredProducts = products.filter(
    (product) =>
      product.descripcion &&
      product.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Buscar producto"
      />

      <View style={styles.titleContainer}>
        {userRole === "admin" && (
          <Pressable onPress={handleCreate}>
            <AntDesign name="pluscircle" size={40} color="green" />
          </Pressable>
        )}
        <Text style={styles.title}>PRODUCTOS</Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.codigo.toString()}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            onEdit={handleEdit}
            userRole={userRole}
            onDelete={handleDelete}
          />
        )}
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
    height: 50,
    fontSize: 20,
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
    backgroundColor: "#E3F2FD",
    margin: 5,
    padding: 15,
    borderRadius: 10,
    position: "relative",
    fontSize: 15,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "auto",
    width: "48%",
    display: "flex",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  editButton: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  statusContainer: {
    marginTop: "auto",
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
  productCard: {
    backgroundColor: "blue",
  },
  textContent: {
    fontSize: 16,
    padding: 5,
  },
});

export default App;
