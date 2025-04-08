import React from "react";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const ClientLayout = () => {
  return (
    <Tabs initialRouteName="homeClient">
      <Tabs.Screen
        name="homeClient"
        options={{
          headerShown: false,
          title: "Inicio",
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="createclient"
        options={{
          headerShown: false,
          title: "Crear",
          tabBarIcon: () => (
            <AntDesign name="pluscircleo" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};

export default ClientLayout;
