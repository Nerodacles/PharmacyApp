// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { ActivityIndicator, View, Text, Button, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'

import Icon from 'react-native-vector-icons/Ionicons'

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const Favorites = ({ navigation }) => {
  const {userToken}= useContext(AuthContext);
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)
    const getFav = async() =>{
      const response = await axiosInstance.get(`favs`)
      console.log(response.data)
        response.data.forEach(element => {
          axiosInstance.get(`api/getOne/${element}`).then((res) => {
            setProductos(oldArray => [...oldArray, res.data.data])
            setIsLoading(false)
          })
        }
        )
      }
    getFav()
    }, [])

  if ( isLoading ){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#FFF'}}>
      <ActivityIndicator size="large" color="#4cc3eb" style={{opacity: 1}} />
    </View>)
  } 
   

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Favoritos</Text>
      </View>
      {/* <FlatList 
        data={producto}
        numColumns={2}
        style={styles.cont}
        renderItem={({item: item}) => 
        <View style={styles.cont2}>
          <View style={styles.cover}>
            <Image source={{uri: `https://${item.cover}`}} style={styles.image} />
          </View>
          <Text style={styles.text}>{item.name}</Text>
        </View>} /> */}
        <FlatList 
        data={producto}
        numColumns={2}
        style={styles.cont}
        renderItem={({item: item}) => 
          <Pressable 
            onPress={() => navigation.navigate('Info', {id: item.id, name: item.name})}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? 'rgb(210, 230, 255)'
                  : 'white'
              }, styles.cont2]}>
            <View style={styles.cover}>
              <Image source={{uri: `https://${item.cover}`}} style={styles.image} />
            </View>
            <Text style={styles.text}>{item.name} </Text>
          </Pressable>} />
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
  header:{
    flexDirection:"row",
    alignItems:"center",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
  },
  backbtn: {
    width:'10%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
  },
  title: {
    width:'90%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    marginLeft: '-5%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center'
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
    paddingHorizontal: 10,
    paddingVertical:5,
    margin: 5,
    alignItems:"center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

});

export default Favorites;