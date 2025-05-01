import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from "./src/screens/HomeScreen";

import 'react-native-gesture-handler';

import ItemsConferenceScreen from './src/screens/Conference/ItemsConferenceScreen';
import OrderConferenceScreen from './src/screens/Conference/OrderConferenceScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import ScanItemsScreen from './src/screens/Separation/ScanItemsScreen';
import ScanOrderScreen from './src/screens/Separation/ScanOrderScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="ScanOrderScreen" component={ScanOrderScreen} options={{ title: 'Separação de Pedidos' }} />
        <Stack.Screen name="ScanItemsScreen" component={ScanItemsScreen} options={{ title: 'Itens do pedido' }} />
        <Stack.Screen name="OrderConferenceScreen" component={OrderConferenceScreen} options={{ title: 'Conferencia de Pedidos' }} />
        <Stack.Screen name="ItemsConferenceScreen" component={ItemsConferenceScreen} options={{ title: 'Itens do pedido' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
