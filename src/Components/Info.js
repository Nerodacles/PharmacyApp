// In App.js in a new project

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ToastAndroid, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// import { TouchableOpacity } from 'react-native-gesture-handler';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

function Info ({ route }) {
  const {userToken}= useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const [detalles, setDetalles] = useState([])
  const [effects, setEffects] = useState([])
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
    setIsLoading(true)
    setDetalles([])
    setFavorite([])
    setTags([])
    axiosInstance.get(`api/getOne/${id}`).then((response) => {
      setDetalles(response.data.data)
      setFavorite(response.data.favorite)
      setTags(response.data.data.tags)
      setEffects(response.data.data.secondaryEffects)
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

      <Text style={style.title}>{detalles.name}</Text>
      <View style={style.cont1}>
        <SafeAreaView style={{flex: 2}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={style.cont2}>
              <Text style={style.subtitle}>Descripción</Text>
              <Text style={style.description}> {detalles.description} </Text>
              {effects !== undefined ? <Text style={style.subtitle}>Efectos secundarios</Text>: null }
              {effects !== undefined ? effects.map((effect, id) => {
                return ( <Text key={id} style={style.description}> - {effect} </Text>)
              }) : null }
              <View>
                <Text style={[style.description, {opacity: 0.4}]}>Sintomas: {tags?.toString().split(',').join(', ')} </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <Text style={style.price}>RD${detalles.price}</Text>
        <View style={style.cont3}>
          <TouchableOpacity onPress={AddFav}>
            <FontAwesome name={favorite !== true ? "heart-o" : "heart"} color={favorite !== true ? "#000" : "#E2443B"} size={30} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', width: '80%', justifyContent: 'flex-end'}}>
          {quantity=== 0 ?(
            (
            <TouchableOpacity style={style.btn} onPress={() => increaseCartQuantity(id)}>
              <Icon name='cart-plus' color="#FFF" size={25} />
            </TouchableOpacity>
            )
            
          ): (
            <View style={style.cartView}>
              <View style={[style.row, {justifyContent: 'flex-end'}]}>
                <TouchableOpacity style={style.btnInc} onPress={() => decreaseCartQuantity(id)}>
                  <Feather name='minus' color="#000" size={30} />
                </TouchableOpacity>
                <Text style={[style.textPrice, {fontSize: 25}, quantity===10 && {marginRight: 48}]}>{quantity}</Text>
                {quantity <10 && 
                <TouchableOpacity style={style.btnInc} onPress={() => increaseCartQuantity(id)}>
                  <Feather name='plus' color="#000" size={30} />
                </TouchableOpacity>}
              </View>

            </View>
          )}
          <TouchableOpacity style={[style.btn, {backgroundColor: '#E2443B'} ]} onPress={() => navigation.navigate('UserLocation')}>
            <Text style={style.btnText}>Comprar</Text>
          </TouchableOpacity>
          </View>
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
    color:"#000",
    textAlign:"left"
 },
 subtitle:{
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 10,
  color:"#FFF",
 },
 description: {
  paddingTop:10,
  color:"#FFF",
  fontSize: 18,
  // lineHeight:25
},
btn:{
  backgroundColor: "#4cc3eb",
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical:15,
  borderRadius:30,
  marginRight: 5,
  alignSelf: 'flex-end',
  width: 100,
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
  height:225,
  width:250,
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
  // height:"15%",
  justifyContent:"space-between",
  // marginTop:10,
},
bottomCont:{
  flexDirection:"column",
  justifyContent: 'flex-end',
  height: '40%'
},
price: {
  fontSize: 25,
  color:"#FFF",
  marginRight:15,
  textAlign:"right"
},
row: {
  flexDirection: "row",
  width:'100%',
  alignItems: 'center',
  justifyContent: 'center',
  // marginBottom: 5
},
btnInc:{
  backgroundColor: "#4cc3eb",
  borderRadius:30,
  paddingVertical:5,
  width:50,
  alignItems: 'center'
},
textPrice: {
  color: 'black',
  fontSize: 22,
  fontWeight: '400',
  textAlignVertical: "center",
  marginHorizontal: 10,
},
textName: {
  color: 'black',
  fontSize: 20,
  fontWeight: '400',
  textAlignVertical: "center",
  marginLeft: 5,
},
cartView:{
  flex:1,
  marginHorizontal:10,
  alignItems: 'center',
  justifyContent: 'center'
}
})

export default Info;