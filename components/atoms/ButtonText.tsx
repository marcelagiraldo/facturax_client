import { Text, StyleSheet } from "react-native";

type Props = {
  children: string;
  color: "light" | "dark";
};

export const ButtonText = ({ children, color }: Props) => {
  return (
    <Text style={[styles.text, color === "light" ? styles.light : styles.dark]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 20,
  },
  light: {
    color: "#ffffff", // textLight
  },
  dark: {
    color: "#000000", // textDark
  },
});
