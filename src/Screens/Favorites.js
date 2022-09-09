// In App.js in a new project

import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { View, Text, Button, StatusBar, Image, StyleSheet, TouchableOpacity, TextInput, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import Icon from 'react-native-vector-icons/Ionicons'

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const Favorites = () => {
  const {userToken}= useContext(AuthContext);
  const [detalles, setDetalles] = useState([]);
  const [producto, setProductos] = useState([]);

  axiosInstance.interceptors.request.use(
    config => {
      config.headers['authorization'] = userToken
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  
  
  useEffect(() => {
    setProductos([])
    const getFav = async() =>{
      const response = await axiosInstance.get(`favs`)
        response.data.forEach(element => {
          axiosInstance.get(`api/getOne/${element}`).then((res) => {
            setProductos(oldArray => [...oldArray, res.data.data])
          })
        }
        )
      }
    getFav()
    }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      {producto.map((item) => (
        <View style={styles.cont}>
          <View style={styles.cont2}>
            <View style={styles.cover}>
              <Image source={{uri: `https://${item.cover}`}} style={styles.image} />
            </View>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </View>

      ))}
      {/* <Text style={style.title}>{producto.name}</Text> */}
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems:"center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '10%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
  },
  cover:{
    height:100,
    width:100,
  },
  image:{
    width: "100%",
    height:"100%",
    resizeMode: "cover"
  },
  cont: {
    flexDirection: "row",
  },
  cont2: {
    flexDirection: "column",
    borderRadius: 8,
    padding: 6,
    margin: 4,
  },

});

export default Favorites;