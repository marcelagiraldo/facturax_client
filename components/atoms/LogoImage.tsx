import { Image } from "react-native";
import logo from "../../assets/facturax.png";

const LogoImage = () => (
  <Image
    source={logo}
    testID="logo-image"
    style={{ width: 200, height: 240, resizeMode: "contain" }}
  />
);

export default LogoImage;
