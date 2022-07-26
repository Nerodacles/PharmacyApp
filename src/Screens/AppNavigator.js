// In App.js in a new project

import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, Farmacos, Settings } from '../Screens';
import {Products, Info} from '../Components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator 
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerTitleStyle: {fontWeight: 'bold'},
        headerStyle: { backgroundColor: '#B22222' },
      }}>
      <HomeStack.Screen options={{headerTitle: 'Home'}} name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Info" component={Info} />
      <HomeStack.Screen name="Farmacos" component={Farmacos} />
      <HomeStack.Screen options={{headerTitle: 'Productos'}} name="Products" component={Products} />
    </HomeStack.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerTitleStyle: {fontWeight: 'bold'},
        headerStyle: { backgroundColor: 'grey' },
      }}>
        <Tab.Screen options={{headerShown: false}} name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    {/* //   <Stack.Navigator initialRouteName='Farmacos'>
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Farmacos" component={Farmacos} />
    //     <Stack.Screen name="Products" component={Products} />
    //     <Stack.Screen name="Info" component={Info} />
    //   </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default AppNavigator;