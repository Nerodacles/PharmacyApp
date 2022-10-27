import React, { useContext } from 'react';
import { HomeScreen, SettingsScreen, ProfileScreen, CartScreen, Search, OrdersScreen, MapScreen } from '../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartContext } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import UserStack from './UserStack';
import { AuthContext } from '../context/AuthContext'

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {
    const hide = props.routeName 
    const {cartQuantity } = useContext(CartContext)
    
    function isDelivery() {
        const {userInfo} = useContext(AuthContext);
        if (userInfo.role == 'delivery'){
            return true
        }
        return false
    }
    isDelivery()

    return(
        <Tab.Navigator initialRouteName='Home' screenOptions={{
            tabBarShowLabel:true,
            headerShown: false,
            tabBarActiveTintColor:'#0062da',
            style:{
                backgroundColor: '#eff4f0',
                justifyContent: "center",
                paddingVertical: 15,
                elevation: 2,
                height: 65

            }
                }}>
            <Tab.Screen name="Home" component={UserStack} options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="home-outline" color={color} size={size} />
                },
                tabBarStyle:{ display: hide == 'Info' || hide == 'UserLocation' || hide == 'ConfirmLocation' ? "none" : "flex"}
            }} />
            {isDelivery() ? null : 
            <Tab.Screen name="Busqueda" component={Search} options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="search" color={color} size={size} />
                }
            }} />}
            {isDelivery() ? null :
                <Tab.Screen name="Carrito" component={CartScreen} options={{
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="cart" color={color} size={size} />
                    }, tabBarBadge: (cartQuantity === 0) ?  null : cartQuantity
                }} />
            }
            {isDelivery() ?
                <Tab.Screen name="Ordenes de Clientes" component={OrdersScreen} options={{
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="book" color={color} size={size} />
                    }
                }} />
            : null}
            {isDelivery() ?
                <Tab.Screen name="Mapa" component={MapScreen} options={{
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="map" color={color} size={size} />
                    }
                }} />
            : null}
            <Tab.Screen name="Perfil" component={ProfileScreen}  options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="person-circle-outline" color={color} size={size} />;
                }
            }}/>
        </Tab.Navigator>
    )
}

export default TabNavigator;