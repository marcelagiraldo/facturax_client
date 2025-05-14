import { Pressable, Text } from "react-native";

const CustomButton = ({ title, onPress }: {title: string, onPress: () => void}) => (
  <Pressable
    onPress={onPress}
    style={{
      backgroundColor: "#4A90E2",
      padding: 14,
      borderRadius: 10,
      width: 200,
      alignItems: "center",
      margin:20
    }}
  >
    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
      {title}
    </Text>
  </Pressable>
);

export default CustomButton;
