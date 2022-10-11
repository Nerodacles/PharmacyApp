// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { ActivityIndicator, View, Text, Button, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const OrdenesPasadas = ({ navigation }) => {
  const { userToken, userInfo }= useContext(AuthContext);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ ordenes, setOrdenes ] = useState([]);

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
    setOrdenes([])
    setIsLoading(true)
    const getFav = async() =>{
      try {
        const response = await axiosInstance.get(`orders/user/${userInfo.id}`)
        setOrdenes(response.data)
        setIsLoading(false)
        console.log(response.data)
      }
      catch (error) {
        console.log(error)
      }
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de Ordenes</Text>
      </View>
        <FlatList 
        data={ordenes}
        numColumns={1}
        style={styles.cont}
        renderItem={({item: item}) => 
          <Pressable onPress={() => navigation.navigate('Info', {id: item.id, name: item.name})} style={({ pressed }) => [ { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white' }, styles.cont2]}>
            <Text style={styles.text}> Tracking ID: {item.id} </Text>
            <Text style={styles.text}> RD$ {item?.totalPrice.toLocaleString('en-us') } </Text>
            <Text style={styles.text}> Se entregó: {item?.delivered ? 'Si' : 'No'} </Text>
            <Text style={styles.text}> Fármacos: </Text>
            { item.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.name} </Text> })}
          </Pressable>} />
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems:"center",
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
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default OrdenesPasadas;