import { StyleSheet } from "react-native";
import { PressableButton } from "../atoms/PressableButon";
import { ButtonText } from "../atoms/ButtonText";

export const LoginButton = () => {
  return (
    <PressableButton style={styles.button}>
      <ButtonText color="light">Iniciar Sesión</ButtonText>
    </PressableButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff", // secondary
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
});
