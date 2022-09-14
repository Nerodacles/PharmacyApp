import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, SettingsScreen, ProfileScreen } from '../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AppStack from './AppStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return(
        <Tab.Navigator initialRouteName='Home2' screenOptions={{
            tabBarShowLabel:false,
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
            <Tab.Screen name="Home2" component={AppStack} options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="home-outline" color={color} size={size} />
                }
            }} />
            {/* <Tab.Screen name="Settings" component={SettingsScreen} options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="settings-outline" color={color} size={size} />
                }
            }}/> */}
            <Tab.Screen name="Profile" component={ProfileScreen}  options={{
                tabBarIcon: ({color, size}) => {
                    return <Icon name="person-circle-outline" color={color} size={size} />;
                }
            }}/>
        </Tab.Navigator>
    )
}

export default TabNavigator;