import { View, StyleSheet } from "react-native";
import { LoginButton } from "../molecules/LoginButton";
import { RegisterButton } from "../molecules/RegisterButton";

type Props = {
  handleRegister: () => void;
};

export const CustomAuthButton = ({ handleRegister }: Props) => {
  return (
    <View style={styles.container}>
      <LoginButton />
      <RegisterButton onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 150,
  },
});
