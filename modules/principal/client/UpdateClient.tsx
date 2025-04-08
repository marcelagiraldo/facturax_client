import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

const UpdateclientModule = () => {
  return (
    <SafeAreaView className='flex bg-secondary h-full'>
      <StatusBar hidden={false} style='light'/>
      <Text className='text-6xl text-white'>Actualizar Clientes</Text>
    </SafeAreaView>
  )
}

export default UpdateclientModule