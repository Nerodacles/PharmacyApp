import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  Farmacos, Favorites, HomeScreen, Order, Search} from '../Screens';
import { Products, Info, PaymentMethod } from '../Components';
import ShoppingCart from '../Screens/CartScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {

      
    return(
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Info" component={Info} />
            <Stack.Screen name="Farmacos" component={Farmacos} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="Favorito" component={Favorites} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Cart" component={ShoppingCart} />
            <Stack.Screen name="PaymentMet" component={PaymentMethod} />
        </Stack.Navigator>
    )
}

export default AppStack;