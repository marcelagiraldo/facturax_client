import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link, router, useRouter } from "expo-router";
import Svg, { Ellipse } from "react-native-svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SvgTop from "../../components/atoms/SvgTop";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { containers } from "../../components/Tokens";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const RegisterModule = () => {
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      documento: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      confirmPassword: "",
      contraseia: "",
      rol:""
    },
  });
  
  const onRegister = async (data) => {
    const { confirmPassword, ...userData } = data;
    const formattedUserData = {
      ...userData,
    };
    
    console.log("Datos enviados al backend:", formattedUserData);
    
    try {
      const response = await fetch("https://facturax.lat/api/usuarios/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedUserData)
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Error en el registro');
      }
  
      console.log("Respuesta del servidor:", response.status, responseData);
      alert("Registro exitoso");
      router.navigate("/login");
      
    } catch (error) {
      console.error("Error en el registro:", error.message);
      alert(error.message || "Error al registrar");
    }
  };

  const handleLogin = async () => {
    try {
      router.replace("/login"); 
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const password = watch("contraseia");
  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.svgContainer}>
          <SvgTop></SvgTop>
        </View>
        <View style={styles.buttonContainer}>
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.textBlack}>Iniciar Sesión</Text>
            </Pressable>
            <Pressable style={styles.registerButton}>
              <Text style={styles.textWhite}>Registrarse</Text>
            </Pressable>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Registrarse</Text>
          <View>
            <View>
              <Controller
                control={control}
                rules={{
                  required: "El documento es obligatorio",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "El documento solo debe contener números",
                  },
                  maxLength: {
                    value: 10,
                    message: "El documento no debe superar los 10 dígitos",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Documento"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    maxLength={15}
                  />
                )}
                name="documento"
              />
              {errors.documento && (
                <Text style={{ color: "red" }}>{errors.documento.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "El nombre solo debe contener letras",
                  },
                  maxLength: {
                    value: 25,
                    message: "El nombre es demasiado largo",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nombres"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    maxLength={30}
                  />
                )}
                name="nombre"
              />
              {errors.nombre && (
                <Text style={{ color: "red" }}>{errors.nombre.message}</Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: "El apellido es obligatorio",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "El apellido solo debe contener letras",
                  },
                  maxLength: {
                    value: 25,
                    message: "El apellido es demasiado largo",
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Apellidos"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    maxLength={30}
                  />
                )}
                name="apellido"
              />
              {errors.apellido && (
                <Text style={{ color: "red" }}>{errors.apellido.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                rules={{
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Ingresa un correo válido",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={50}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={{ color: "red" }}>{errors.email.message}</Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "El teléfono solo debe contener números",
                  },
                  minLength: {
                    value: 7,
                    message: "El teléfono debe tener al menos 7 dígitos",
                  },
                  maxLength: {
                    value: 10,
                    message: "El teléfono no debe superar los 10 dígitos",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    maxLength={15}
                  />
                )}
                name="telefono"
              />
              {errors.telefono && (
                <Text style={{ color: "red" }}>{errors.telefono.message}</Text>
              )}
            </View>

            <View>
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  rules={{
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.+/]{8,}$/,
                      message:
                        "Debe incluir una mayúscula, un número y un carácter especial",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.inputPassword}
                      placeholder="Contraseña"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={15}
                    />
                  )}
                  name="contraseia"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
                
              </View>
              {errors.contraseia && (
                  <Text style={{ color: "red" }}>
                    {errors.contraseia.message}
                  </Text>
                )}
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  rules={{
                    required: "La contraseña es obligatoria",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.inputPassword}
                      placeholder="Repetir contraseña"
                      secureTextEntry={!showPasswordRepeat}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={15}
                    />
                  )}
                  name="confirmPassword"
                />
                <Pressable
                  onPress={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPasswordRepeat ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
                
              </View>
              {errors.confirmPassword && (
                  <Text style={{ color: "red" }}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
            </View>
          </View>

          <View style={styles.register}>
            <Pressable
              style={styles.registerButton}
              onPress={handleSubmit(onRegister)}
            >
              <Text style={styles.textWhite}>Registrarse</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    bottom: 200,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 150,
    paddingBottom: 0,
  },
  loginButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  textWhite: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  textBlack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  contentContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: 280,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "left",
    marginTop: 30,
    fontSize: 20,
    paddingHorizontal: 30,
  },
  containerForm: {
    flexDirection: "row",
    justifyContent: "center",
  },
  register: {
    marginTop: 30,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 30,
  },
  inputPassword: {
    flex: 1,
    fontSize: 20,
    height: 55,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    padding: 10,
  },
});
export default RegisterModule;
