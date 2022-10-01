// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { View, Text, Button, StatusBar, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'

import Icon from 'react-native-vector-icons/Ionicons'

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const Order = ({ route }) => {
  const {userToken}= useContext(AuthContext);
  // const navigation = useNavigation();
  const [isChanged, setIsChanged] = useState(true);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const { id } = route.params;


const [producto, setProductos] = useState([]);

  const onChangeSearchbyName = (name) => {
    setName(name);
  }

  const onChangeSearchbyTags = (tags) => {
    setTags('')
    setTags(oldArray => [...oldArray, tags])
  }


  const onChange = () => {
    setIsChanged(!isChanged);
    setProductos([])
    setName('')
  }

  axiosInstance.interceptors.request.use(
    config => {
      config.headers['authorization'] = userToken
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  
  
    const onSearchbyName = async() =>{
        setProductos([])
        const response = await axiosInstance.post(`search`, {
            name: name
        })
        setProductos(response.data)
      }

      const onSearchbyTags = async() =>{
        setProductos([])
        var tagArr = tags.toString().split(',')
        var tagTrim = tagArr.map(trim => trim.trim())
        const response = await axiosInstance.post(`search/tags`, {
            tags: tagTrim
        })
        console.log(tagTrim)
        setProductos(response.data)
        
      }
    

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Pedido: {id}</Text>
      </View>

      <View style={styles.cont3}>
          <TextInput 
              value={isChanged ? name : tags } 
              style={styles.input} 
              placeholderTextColor="#9c9c9c" 
              placeholder={isChanged ? 'Escribe el nombre del Producto' : 'Escribe un Síntoma'} 
              onChangeText={isChanged ?  onChangeSearchbyName : onChangeSearchbyTags }>
          </TextInput>

          <TouchableOpacity onPress={isChanged ? onSearchbyName : onSearchbyTags} style={styles.searchbtn}>
              <Icon name='search' size={25} color={'#4cc3eb'} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onChange} style={styles.btn}>
              <Text style={styles.btnText}>{isChanged ? 'Por Síntoma' : 'Por Nombre'}</Text>
          </TouchableOpacity>
      </View>

      <FlatList 
        data={producto}
        numColumns={1}
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
    justifyContent: "center",
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
  },
  backbtn: {
    width:'5%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  title: {
    width:'90%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    marginLeft: -5,
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    // width:'60%',
    color: 'black',
    textAlignVertical: 'center',
    marginLeft: 15,
  },
  cover:{
    height:70,
    width:70,
    margin: 5,
  },
  image:{
    width: "100%",
    height:"100%",
    resizeMode: "cover"
  },
  cont: {
    flex: 1,
    borderRadius: 5,
    margin: 5,
  },
  cont2: {
    flexDirection: "row",
    borderRadius: 5,
    padding: 4,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  cont3: {
    flexDirection: "row",
    borderRadius: 8,
    paddingVertical:5,
    margin: 10,
    alignItems:"center",
    width: '100%',
    justifyContent: 'center'
  },
  btn:{
    backgroundColor: "#4cc3eb",
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:30,
    width: '20%'
  },
  searchbtn:{
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:30,
    width: '10%'
  },
  btnText:{
    fontSize:15,
    color:"#FFF"
  },
  input: {
    width: '60%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingTop: 10,
    marginLeft: '-5%',
    fontSize: 16, 
    minHeight: 40,
    color: 'black',
    },
});

export default Order;