// In App.js in a new project

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// import { TouchableOpacity } from 'react-native-gesture-handler';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

function Info ({ route }) {
  const {userToken}= useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [detalles, setDetalles] = useState([]);
  const [favorite, setFavorite] = useState([])
  const [tags, setTags] = useState([])
  const [data, setData] = useState([]);
  const { id } = route.params;
  
 
  const {getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartQuantity} = useContext(CartContext)
  const quantity = getItemQuantity(id)

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
    console.clear()
    setIsLoading(true)
    setDetalles([])
    setFavorite([])
    setTags([])
    axiosInstance.get(`api/getOne/${id}`).then((response) => {
      setDetalles(response.data.data)
      setFavorite(response.data.favorite)
      setTags(response.data.data.tags)
      setIsLoading(false)
    })
  }, [id]);

  const AddFav =()=>{
    axiosInstance.post(`favs/modify/${id}`).then((res) => {
      setFavorite(!favorite)
    });
  }

  if ( isLoading ){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#FFF'}}>
      <ActivityIndicator size="large" color="#4cc3eb" style={{opacity: 1}} />
    </View>)
  } 
 
  return (
    <View style={ style.container }>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        {cartQuantity > 0 && (<TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Feather name="shopping-cart" color="#000" size={25} />
          <View
            style={{     
              position: 'absolute',
              backgroundColor: 'red',
              width: 16,
              height: 16,
              borderRadius: 15 / 2,
              right: -8,
              top: -5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                color: "#FFFFFF",
                fontSize: 10,
              }}>
              {cartQuantity}
            </Text>
          </View>
        </TouchableOpacity>)}
      </View>
      <View style={style.cover}>
        <Image source={{uri: `https://${detalles.cover}`}} style={style.img}/>
      </View>

      <View style={style.cont1}>
        <View style={style.cont2}>
          <Text style={style.title}>{detalles.name}</Text>
          <Text style={style.subtitle}>Descripción</Text>
          <Text style={style.description}> {detalles.description} </Text>
          <Text style={[style.description, {opacity: 0.4, marginTop: '25%'}]}>Tags: {tags?.toString().split(',').join(', ')} </Text>
        </View>
        <View style={style.cont3}>
          <TouchableOpacity onPress={AddFav}>
            <FontAwesome name={favorite !== true ? "heart-o" : "heart"} color={favorite !== true ? "#000" : "#E2443B"} size={30} />
          </TouchableOpacity>
          <Text style={style.price}>RD${detalles.price}</Text>
          <TouchableOpacity style={style.btn} onPress={() => increaseCartQuantity(id)}>
            <Text style={style.btnText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>

  </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    justifyContent: "center",
    backgroundColor: "#FFF"
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
    color:"#FFF",
    textAlign:"center"
 },
 subtitle:{
  fontSize: 25,
  fontWeight: 'bold',
  marginTop: 10,
  color:"#FFF",
 },
 description: {
  paddingTop:10,
  color:"#FFF",
  fontSize: 18,
  lineHeight:25
},
btn:{
  backgroundColor: "#E2443B",
  paddingHorizontal:40,
  paddingVertical:15,
  borderRadius:30,
},
btnText:{
  fontSize:20,
  color:"#FFF"
},
header:{
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between",
  width:"100%",
  paddingHorizontal:20,
  paddingTop:15,
},
img:{
  height:"100%",
  width:"100%",
  resizeMode:"cover"
},
cover:{
  height:250,
  width:300,
  margin:10
},
cont1:{
  flex:1,
  flexDirection:"column",
  backgroundColor:"#0062da",
  width:"95%",
  borderRadius:60,
  paddingHorizontal:20,
  marginBottom:5,
},
cont2:{
  marginVertical:25,
  height:"50%",
},
cont3:{
  flexDirection:"row",
  marginBottom:20,
  alignItems:"center",
  width:"100%",
  height:"45%",
  justifyContent:"space-between",
  marginTop:20,
},
price: {
  fontSize: 20,
  color:"#FFF",
  marginLeft:60,
  textAlign:"center"
},
})

export default Info;