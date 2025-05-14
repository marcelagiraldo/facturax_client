import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SvgTop from "../../components/atoms/SvgTop";
import { colors, containers } from "../../components/Tokens";
import axios from "axios";

import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, useAuth } from "../../context/AuthContext";
import { CustomAuthButton } from "../../components/organisms/CustomAuthButton";
const LoginModule = () => {
  interface LoginData {
    email:string,
    password:string
  }
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const onLogin_ = async (data:LoginData) => {
    console.log("Datos enviados al backend:", data);
    try {
      const response = await fetch("https://facturax.lat/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      console.log("Esperando respuesta");

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        await AsyncStorage.setItem("@userToken", responseData.token);
        await AsyncStorage.setItem(
          "@userData",
          JSON.stringify(responseData.user)
        );

        alert("Inicio de sesión exitoso");
        console.log(router);
        router.replace("/principal");
        console.log("Inicio sesión exitoso");
      } else {
        alert("Error en el inicio de sesión");
      }
    } catch (error) {
      alert("Error en el inicio de sesión\nCorreo o contraseña incorrectos");
      console.error("Error en la solicitud de inicio de sesión", error);
    }
  };

  const handleRegister = async () => {
    try {
      router.replace("/register");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error) {
      alert(result.msg);
    } else {
      router.replace("/principal");
    }
  };

  useEffect(() => {
    /* const testCall = async () => {
      const result = await axios.get(`${API_URL}/usuarios`);

      console.log("result in use effect of login: ", result);
    };
    testCall(); */
  });

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.container}>
        <SvgTop />
        <CustomAuthButton handleRegister={handleRegister}/>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          {/* Campo de correo electrónico */}
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
                onChangeText={(text: string) => setEmail(text)}
                value={email}
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

          {/* Campo de contraseña */}
          <View style={styles.passwordContainer}>
            <Controller
              control={control}
              rules={{
                required: "La contraseña es obligatoria",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={(text: string) => setPassword(text)}
                  value={password}
                  maxLength={20}
                />
              )}
              name="password"
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
          {errors.password && (
            <Text style={{ color: "red" }}>{errors.password.message}</Text>
          )}
          <View style={styles.login}>
            <Pressable style={styles.loginButton} onPress={login}>
              <Text style={styles.textWhite}>Iniciar Sesión</Text>
            </Pressable>

            <Pressable className="mt-4">
              <Text className="text-blue-500 text-lg">
                ¿Olvidaste la contraseña?
              </Text>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 150,
    paddingBottom: 0,
  },
  loginButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    fontSize: 30,
  },
  registerButton: {
    backgroundColor: colors.secondaryGray,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    fontSize: 30,
  },
  textWhite: {
    color: colors.textLight,
    fontWeight: "bold",
    fontSize: 20,
  },
  textBlack: {
    color: colors.textDark,
    fontWeight: "bold",
    fontSize: 20,
  },
  contentContainer: {
    marginTop: 80,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    width: 300,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "left",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  login: {
    marginTop: 30,
    fontSize: 15,
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
export default LoginModule;
