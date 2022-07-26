// In App.js in a new project

import React from 'react';
import { View, Text, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen ({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFF" }}>
            <Text style={{color:'green'}}>Home Screen</Text>
            <Button
                title="Ir a los farmacos"
                onPress={() => navigation.navigate('Products')}>
            </Button>
        </View>
  );
};

export default HomeScreen;