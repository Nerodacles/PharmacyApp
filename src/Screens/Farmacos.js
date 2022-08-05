// In App.js in a new project

import React from 'react';
import { View, Text, Button } from 'react-native';

const Farmacos = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{color:'red'}}>Products</Text>
      <Button
      title="Ir a la lista de productos"
      onPress={() => navigation.navigate('Products')}>

      </Button>
    </View>
  );
}

export default Farmacos;