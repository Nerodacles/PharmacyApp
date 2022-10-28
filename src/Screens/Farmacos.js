import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';

const Farmacos = ({ route }) => {
  const navigation = useNavigation()
  const { metodo, latitude, longitude, direccion , calle, numero, referencia } = route.params
  console.log(metodo)

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{color:'red'}}>{metodo[0].value}{metodo[0].cantidad}</Text>
      <Button title='holas' onPress={() => navigation.navigate('Products')} />
    </View>
  );
}

export default Farmacos;