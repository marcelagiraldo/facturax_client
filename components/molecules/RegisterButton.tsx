import { StyleSheet } from "react-native";
import { PressableButton } from "../atoms/PressableButon";
import { ButtonText } from "../atoms/ButtonText";

type Props = {
  onPress: () => void;
};

export const RegisterButton = ({ onPress }: Props) => {
  return (
    <PressableButton style={styles.button} onPress={onPress}>
      <ButtonText color="dark">Registrarse</ButtonText>
    </PressableButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#cccccc", // secondaryGray
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
});
