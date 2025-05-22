import { View } from "react-native";
import { router } from "expo-router";
import CustomButton from "../atoms/CustomButton";

const AuthButtons = () => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <CustomButton title="Iniciar Sesión" onPress={() => router.push("/login")} />
    <CustomButton title="Registrarse" onPress={() => router.push("/register")} />
  </View>
);

export default AuthButtons;
