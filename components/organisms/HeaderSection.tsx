import { View } from "react-native";
import LogoImage from "../atoms/LogoImage";

const HeaderSection = () => (
  <View
    style={{
      flex: 1.2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#003B73",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    }}
    testID="header-section"
  >
    <LogoImage />
  </View>
);

export default HeaderSection;
