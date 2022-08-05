// In App.js in a new project

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

function Info ({ route }) {
  const [detalles, setDetalles] = useState([]);
  const { id } = route.params;

  useEffect(() => {
    axiosInstance.get(`api/getOne/${id}`).then((response) => {
      setDetalles(response.data)
    });
  }, []);
  
  return (
    <View style={ style.container }>
      <Text style={style.description}> {detalles.id}</Text>
      <Text style={style.description}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>
      <Text style={style.description}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>

    </View>
  );
}

const style = StyleSheet.create({
  container: {
      flex: 1,
      margin: 0,
      backgroundColor: "#FFF"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#000",
    margin: 10,
 },

 description: {
  fontSize: 16,
  color: "#000",
  textAlign: 'left',
  margin: 15
}
})

export default Info;