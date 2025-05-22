import { TextInput, StyleSheet } from "react-native";
import React from "react";

const CustomTextInput = ({ ...props }) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
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
});

export default CustomTextInput;
