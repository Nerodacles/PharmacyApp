import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  Farmacos, Favorites, HomeScreen, Order, Search } from '../Screens';
import { Products, Info } from '../Components';
import ShoppingCart from '../Screens/CartScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {

    const capitalizeFirst = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      
    return(
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Info" component={Info} options={({route}) => ({
                title: capitalizeFirst(route.params?.name)
            })} />
            <Stack.Screen name="Farmacos" component={Farmacos} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="Favorito" component={Favorites} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Cart" component={ShoppingCart} />
        </Stack.Navigator>
    )
}

export default AppStack;