import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from "react-native";

const productos = [
  { id: "1001", nombre: "Laptop HP", precio: 3200000, iva: 672000, stock: 15 },
  { id: "1002", nombre: "Samsung S21", precio: 2400000, iva: 504000, stock: 25 },
  { id: "1003", nombre: 'Monitor LG 24"', precio: 800000, iva: 168000, stock: 30 },
];

const CreatePosModule = () => {
  const [cliente, setCliente] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const filteredProducts = productos.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const agregarProducto = (producto) => {
    const existe = productosSeleccionados.find((p) => p.id === producto.id);
    if (existe) {
      const productosActualizados = productosSeleccionados.map((p) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setProductosSeleccionados(productosActualizados);
    } else {
      setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
    }
  };
  

  const eliminarProducto = (id) => {
    setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, p) => total + p.precio * p.cantidad, 0);
  };

  const calcularTotalIVA = () => {
    return productosSeleccionados.reduce((total, p) => total + p.iva * p.cantidad, 0);
  };

  const confirmarPago = () => {
    setModalVisible(true);
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Cliente */}
      <Text>Cliente:</Text>
      <TextInput
        value={cliente}
        onChangeText={setCliente}
        placeholder="Ingrese el nombre o cédula"
        style={{ borderWidth: 1, padding: 8, marginBottom: 20, borderRadius: 8 }}
      />

      <Text>Producto:</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Ingrese el nombre o código"
        style={{ borderWidth: 1, padding: 8, marginBottom: 20, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={confirmarPago}
        style={{ backgroundColor: "#007bff", padding: 15, marginTop: 20, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>PAGAR</Text>
      </TouchableOpacity>

      {/* Resumen de Compra */}
      <Text style={{ fontSize: 18, marginVertical: 20 }}>Resumen de Compra</Text>
      {productosSeleccionados.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text>{item.nombre} x {item.cantidad}</Text>
          <Text>${(item.precio * item.cantidad).toLocaleString()}</Text>
          <TextInput
            value={item.cantidad.toString()}
            onChangeText={(text) => actualizarCantidad(item.id, parseInt(text) || 1)}
            style={{ borderWidth: 1, width: 50, textAlign: "center" }}
          />
          <TouchableOpacity onPress={() => eliminarProducto(item.id)}>
            <Text style={{ color: "red" }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text>Total a Pagar: ${calcularTotal().toLocaleString()}</Text>

      {/* Lista de Productos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => agregarProducto(item)}
            style={{
              padding: 10,
              borderWidth: 1,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text>{item.nombre}</Text>
            <Text>Precio: ${item.precio.toLocaleString()}</Text>
            <Text>IVA: ${item.iva.toLocaleString()}</Text>
            <Text>Stock: {item.stock}</Text>
          </TouchableOpacity>
        )}
      />
      {/* Modal de Factura */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 8 }}>
            <Text>Factura</Text>
            <Text>Cliente: {cliente || "Consumidor final"}</Text>
            <Text>Total impuesto: ${calcularTotalIVA().toLocaleString()}</Text>
            <Text>Cantidad productos: {productosSeleccionados.length}</Text>
            <Text>Total: ${calcularTotal().toLocaleString()}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "blue", marginTop: 20 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreatePosModule;
