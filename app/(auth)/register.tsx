import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import RegisterModule from '../../modules/auth/Register';

const Register = () => {
  return <RegisterModule/>
}

export default Register