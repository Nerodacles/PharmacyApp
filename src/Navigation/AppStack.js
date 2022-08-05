import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  Farmacos, HomeScreen } from '../Screens';
import { Products, Info } from '../Components';

const Stack = createNativeStackNavigator();

const AppStack = () => {

    const capitalizeFirst = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Info" component={Info} options={({route}) => ({
                title: capitalizeFirst(route.params?.name),
                headerShown:true,
            })} />
            <Stack.Screen name="Farmacos" component={Farmacos} />
            <Stack.Screen options={{headerTitle: 'Productos', headerShown: true}} name="Products" component={Products} />
        </Stack.Navigator>
    )
}

export default AppStack;