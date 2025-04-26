import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import OrderScreen from './src/screens/OrderScreen';
import SeparationScren from "./src/screens/SeparationScreen"
import 'react-native-gesture-handler';
import ConferenceOrderScreen from './src/screens/ConferenceOrderScreen';
import ConferenceScreen from './src/screens/ConferenceScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Itens do Pedido' }} />
        <Stack.Screen name="Separation" component={SeparationScren} options={{ title: 'Separção de Pedidos' }} />
        <Stack.Screen name="Conference" component={ConferenceOrderScreen} options={{ title: 'Conferencia de Pedidos' }} />
        <Stack.Screen name="ConferenceScreen" component={ConferenceScreen} options={{ title: 'Itens do pedido' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
