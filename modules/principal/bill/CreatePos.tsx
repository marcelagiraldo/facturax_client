import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const CreatePosModule = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [cliente, setCliente] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [productos, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  const [client, setClient] = useState([]);
  const [searchClient, setSearchClient] = useState("");

  const [invoice, setInvoice] = useState([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const filteredProducts = productos.filter((product) =>
    product.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const clientesFiltrados = client.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.numero_documento.toLowerCase().includes(searchClient.toLowerCase())
  );
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

      const response = await fetch(
        `https://facturax.lat/api/productos/${user_id}`
      );
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchClient = async () => {
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

      const response = await fetch(
        `https://facturax.lat/api/clientes/${user_id}`
      );
      const data = await response.json();
      setClient(data);
    } catch (error) {
      console.log("Error al obtener los clientes: ", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`https://facturax.lat/api/impuestos/`);
      const data = await response.json();

      setInvoice(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchClient();
    fetchInvoice();
  }, []);

  const agregarProducto = (producto) => {
    const existe = productosSeleccionados.find((p) => p.id === producto.id);
    const ivaEncontrado = invoice.find(
      (i) => i.p_identificacion === producto.impuesto_id_fk
    );
    const productoFormateado = {
      ...producto,
      precio_venta: Number(producto.precio_venta),
      iva: ivaEncontrado ? Number(ivaEncontrado.p_porcentaje) : 0,
      cantidad: 1,
    };

    if (existe) {
      const productosActualizados = productosSeleccionados.map((p) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setProductosSeleccionados(productosActualizados);
    } else {
      setProductosSeleccionados([
        ...productosSeleccionados,
        productoFormateado,
      ]);
    }
  };

  const eliminarProducto = (id) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.id !== id)
    );
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce(
      (total, p) => total + Number(p.precio_venta) * p.cantidad,
      0
    );
  };

  const calcularTotalIVA = () => {
    return productosSeleccionados.reduce((total, p) => {
      const precioConCantidad = Number(p.precio_venta) * p.cantidad;
      const ivaEncontrado = invoice.find(
        (i) => i.p_identificacion === p.impuesto_id_fk
      );

      const ivaDecimal = (Number(ivaEncontrado.p_porcentaje) || 0) / 100;

      return total + precioConCantidad * ivaDecimal;
    }, 0);
  };

  const confirmarPago = () => {
    let clienteFinal = cliente;

    if (!cliente.trim()) {
      const consumidorfinal = client.find(
        (c) => c.numero_documento === "2222222222"
      );
      if (!consumidorfinal) {
        Alert.alert("Error", "No se encontró el cliente por defecto (222222).");
        return;
      }
      setCliente(consumidorfinal.numero_documento);
      clienteFinal = consumidorfinal;
    }

    if (productosSeleccionados.length === 0) {
      Alert.alert("Error", "Debe seleccionar al menos un producto.");
      return;
    }

    setModalVisible(true);
  };

  const handleCreate = () => {
    router.push({
      pathname: "principal/bill/createBill",
      params: {
        cliente: cliente || "Consumidor final",
        totalIVA: calcularTotalIVA(),
        cantidadProductos: productosSeleccionados.length,
        total: calcularTotal(),
        productos: JSON.stringify(productosSeleccionados),
      },
    });
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.label}>Buscar cliente:</Text>
          <View style={styles.containerSearch}>
            <AntDesign name="search1" size={24} color="black" />
            <TextInput
              value={searchClient}
              onChangeText={setSearchClient}
              placeholder="Buscar cliente por nombre o cédula"
              style={styles.input}
            />
          </View>
          {searchClient.length > 0 && clientesFiltrados.length > 0 && (
            <FlatList
              data={clientesFiltrados}
              keyExtractor={(item) => item.numero_documento}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCliente(item.numero_documento);
                    setSearchClient("");
                  }}
                  style={styles.clientItem}
                >
                  <Text>
                    {item.nombre} - {item.numero_documento}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
          )}

          {cliente.length > 0 && (
            <Text style={styles.selectedClient}>
              Cliente seleccionado: {cliente}
            </Text>
          )}

          <Text style={styles.label}>Producto:</Text>
          <View style={styles.containerSearch}>
          <AntDesign name="search1" size={24} color="black" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Ingrese el nombre o código"
              style={styles.input}
            />
          </View>

          <TouchableOpacity onPress={confirmarPago} style={styles.button}>
            <Text style={styles.buttonText}>PAGAR</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Resumen de Compra</Text>

          {productosSeleccionados.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productDescription}>
                  {item.descripcion}
                </Text>
                <Text style={styles.productTotal}>
                  ${(item.precio_venta * item.cantidad).toLocaleString()}
                </Text>
              </View>

              <View style={styles.productControls}>
                <Text style={styles.label}>Cantidad:</Text>
                <TextInput
                  value={item.cantidad.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const cantidad = parseInt(text);
                    if (!isNaN(cantidad) && cantidad > 0) {
                      actualizarCantidad(item.id, cantidad);
                    } else {
                      Alert.alert(
                        "Cantidad inválida",
                        "Debe ingresar un número mayor que 0"
                      );
                    }
                  }}
                  style={styles.inputCantidad}
                />
                <TouchableOpacity onPress={() => eliminarProducto(item.id)}>
                  <Text style={styles.eliminar}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.totalText}>
            Total a Pagar: ${calcularTotal().toLocaleString()}
          </Text>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => agregarProducto(item)}
                style={styles.productCard}
              >
                <Text>{item.descripcion}</Text>
                <Text>
                  Precio: ${Number(item.precio_venta).toLocaleString()}
                </Text>
                <Text>IVA: ${Number(item.iva || 0).toLocaleString()}</Text>
                <Text>Stock: {item.stock}</Text>
              </TouchableOpacity>
            )}
          />

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>Factura</Text>
                <Text>Cliente: {cliente || "Consumidor final"}</Text>
                <Text>
                  Total impuesto: ${calcularTotalIVA().toLocaleString()}
                </Text>
                <Text>Cantidad productos: {productosSeleccionados.length}</Text>
                <Text>Total: ${calcularTotal().toLocaleString()}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCreate()}>
                  <Text style={styles.closeText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  container: {
    padding: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 20,
    borderColor: "black",
  },
  clientItem: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  flatList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedClient: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 50,
    textAlign: "center",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  totalText: {
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 16,
  },
  productCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
    fontSize:20
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    fontSize:20
  },
  closeText: {
    color: "#007bff",
    marginTop: 20,
    textAlign: "right",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize:20
  },
  productDescription: {
    flex: 1,
    fontSize:18
  },
  productTotal: {
    fontWeight: "bold",
  },
  productControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  inputCantidad: {
    borderWidth: 1,
    width: 60,
    textAlign: "center",
    paddingVertical: 4,
    borderRadius: 6,
  },
  eliminar: {
    color: "red",
  },
});

export default CreatePosModule;
