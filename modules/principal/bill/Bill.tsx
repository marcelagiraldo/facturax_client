import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

const BillModule = () => {
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [search, setSearch] = useState("");

  const facturas = [
    { id: '1', numero: 'FAV001', cliente: '222222222', total: '$1,258,000', metodoPago: 'Efectivo' },
    { id: '2', numero: 'FAV002', cliente: '1009876543', total: '$125,000', metodoPago: 'Efectivo' },
    { id: '3', numero: 'FAV003', cliente: '222222222', total: '$52,000', metodoPago: 'Efectivo' },
    { id: '4', numero: 'FAV004', cliente: '222222222', total: '$3,526,800', metodoPago: 'Mastercard' },
  ];

  const filteredFacturas = facturas.filter((factura) =>
    factura.numero.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDetails = (id) => {
    setSelectedFactura(selectedFactura === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: '#f9f9f9', marginVertical: 8, padding: 16, borderRadius: 8 }}>
      <TouchableOpacity onPress={() => toggleDetails(item.id)}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.numero}</Text>
        <Text>Cliente: {item.cliente}</Text>
        <Text>Total: {item.total}</Text>
      </TouchableOpacity>
      {selectedFactura === item.id && (
        <View style={{ marginTop: 10 }}>
          <Text>Método de Pago: {item.metodoPago}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity style={{ marginRight: 20 }}>
              <FontAwesome name="file-pdf-o" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="print" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
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
    backgroundColor: '#F4F5F7',
    padding: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
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
    
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#333',
    },
})

export default BillModule;
