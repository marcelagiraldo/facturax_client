import { Pressable, Text, View } from "react-native";
import AuthButtons from "../molecules/AuthButtons";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../atoms/CustomButton";
import { router } from "expo-router";

const FooterSection = () => (
  <SafeAreaView style={{ flex: 1 }} testID="footer-section">
    <View style={{ position: "absolute", top: 10, left: 10 }}>
      <Pressable
        onPress={() => router.push("/notes")}
        style={{
          backgroundColor: "#4A90E2",
          padding: 14,
          borderRadius: 10,
          width: 80,
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          Notas
        </Text>
      </Pressable>
    </View>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <AuthButtons />
    </View>
  </SafeAreaView>
);

export default FooterSection;
