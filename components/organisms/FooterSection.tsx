import { View } from "react-native";
import AuthButtons from "../molecules/AuthButtons";

const FooterSection = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <AuthButtons />
  </View>
);

export default FooterSection;
