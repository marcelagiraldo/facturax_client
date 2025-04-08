import { Stack } from "expo-router";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useEffect } from "react";
import { Text } from "react-native";

const HomeLayout = () => {

  const {expoPushToken, notification} = usePushNotifications()
  useEffect(()=>{
    console.log("expoPushToken",expoPushToken);
    console.log("notifications",notification);   
    
    setTimeout(()=>{
      console.log('Token',expoPushToken?.data || ''); 
    },1000)
  })

  

  return (
    //<Text>{expoPushToken? expoPushToken.data : "No token available"}</Text>

    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#003B73", // Color de fondo azul oscuro
        },
        headerTintColor: "#ffffff", // Texto del header en blanco
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
        headerShadowVisible: false, // Elimina la sombra del header
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      <Stack.Screen name="principal" options={{headerShown: false}}/>
    </Stack>
  );
};

export default HomeLayout;
