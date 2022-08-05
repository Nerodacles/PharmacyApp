// In App.js in a new project

import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFF" }}>
            <Text style={{color:'green' }}>Home Screen, Hello {userInfo.username}</Text>
            <Button
                title="Ir a los farmacos"
                onPress={() => navigation.navigate('Products')}>
            </Button>
        </View>
  );
};

export default HomeScreen;