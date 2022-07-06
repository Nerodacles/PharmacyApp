// In App.js in a new project

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import reactotron from 'reactotron-react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

function Info ({ route }) {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    axiosInstance.get(`api/getOne/${id}`).then((response) => {
      // Alert.alert(`Id: ${response.data._id} \nNombre: ${response.data.name}`);
      setDetalles(response.data)
    });
  }, []);
  
  const { id, name } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {detalles && 
      <Text style={{color:'red'}}>Name: { detalles.name } </Text>
      }
      {detalles && 
      <Text style={{color:'red'}}> Id: {detalles.id}</Text>
      }
    </View>
  );
}

export default Info;