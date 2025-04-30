import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import SearchBar from "../../../components/molecules/ShareBar";

const Clients = () => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [client, setClient] = useState([]);
  const router = useRouter();

  const filteredClients = client.filter((client: any) =>
    client.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const fetchClient = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@userData");
      if (!storedUser) {
        alert("Usuario no encontrado");
        return;
      }

      const user = JSON.parse(storedUser);
      const user_id = user.documento;

      const response = await fetch(
        `https://facturax.lat/api/clientes/${user_id}`
      );
      const data = await response.json();
      console.log("data: ", data);

      setClient(data);
    } catch (error) {
      console.log("Error al obtener los clientes: ", error);
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  const handleEdit = (client: any) => {
    router.push({
      pathname: "/principal/client/createclient",
      params: {
        nombre: client.nombre,
        numero_documento: client.numero_documento,
        email: client.email,
        telefono: client.telefono,
        direccion: client.direccion,
        departamento: client.departamento,
        ciudad: client.ciudad,
      },
    });
  };

  const handleOpenMenu = (item: any) => {
    setSelectedItem(item);
    setMenuModalVisible(true);
  };

  const handleOpenInfo = (item: any) => {
    setSelectedItem(item);
    setInfoModalVisible(true);
  };

  const handleCloseModal = () => {
    setInfoModalVisible(false);
    setMenuModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Buscar cliente"
      />
      <FlatList
        data={filteredClients}
        keyExtractor={(item: any) => item.numero_documento}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleOpenInfo(item)}
          >
            <View>
              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.code}>{item.numero_documento}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOpenMenu(item)}>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {infoModalVisible && selectedItem && (
        <Modal
          transparent
          animationType="slide"
          visible={infoModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.overlay}>
            <View style={styles.infoModal}>
              <Text style={styles.modalTitle}>Información del Cliente</Text>
              <Text>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}> {selectedItem.nombre}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Docuemnto:</Text>{" "}
                <Text style={styles.value}>
                  {" "}
                  {selectedItem.numero_documento}
                </Text>
              </Text>
              <Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}> {selectedItem.email}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Teléfono: </Text>
                <Text style={styles.value}>{selectedItem.telefono}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Direccion:</Text>{" "}
                <Text style={styles.value}> {selectedItem.direccion}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Departamento:</Text>{" "}
                <Text style={styles.value}> {selectedItem.departamento}</Text>
              </Text>
              <Text>
                <Text style={styles.label}>Ciudad:</Text>
                <Text style={styles.value}> {selectedItem.ciudad}</Text>
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {menuModalVisible && selectedItem && (
        <Modal
          transparent
          animationType="fade"
          visible={menuModalVisible}
          onRequestClose={handleCloseModal}
        >
          <TouchableOpacity style={styles.overlay} onPress={handleCloseModal} />
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => console.log("Eliminar", selectedItem)}
            >
              <Text style={styles.menuText}>Eliminar</Text>
              <Ionicons name="trash-outline" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleEdit(selectedItem)}
            >
              <Text style={styles.menuText}>Editar</Text>
              <Ionicons name="pencil-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  code: {
    fontSize: 14,
    color: "#999",
  },
  menu: {
    backgroundColor: "#fff",
    position: "absolute",
    right: 20,
    top: 150,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoModal: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    fontSize: "16",
  },
  closeButton: {
    backgroundColor: "#007bff",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  value: {
    fontSize: 16,
    color: "#333",
  },
});

export default Clients;
