import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductProvider } from './services/productContext.js'
import HomeScreen from './screens/home.js';
import StockScreen from './screens/stockScreen.js';
import OrderScreen from './screens/orderScreen.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ESTOQUE"
            component={StockScreen}
            options={{
              headerStyle: {
                backgroundColor: "#131310",
              },
              headerTitleStyle: {
                color: '#fff',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen
            name="PEDIDOS"
            component={OrderScreen}
            options={{
              headerStyle: {
                backgroundColor: "#131310",
              },
              headerTitleStyle: {
                color: '#fff',
              },
              headerTintColor: '#fff',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}
