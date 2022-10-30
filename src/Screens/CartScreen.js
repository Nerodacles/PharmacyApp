// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { View, Text, Button, StatusBar, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'

import Icon from 'react-native-vector-icons/Ionicons'
import { CartContext } from '../context/CartContext';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const ShoppingCart = ({ route }) => {
  const {userToken}= useContext(AuthContext);
  const navigation = useNavigation()
  const { cartItems, cartQuantity, setCartItems } = useContext(CartContext)
  const [itemInCart, setItemInCart] = useState([])
  const [order, setOrder] = useState([])

  useEffect(() => {
    axiosInstance.get(`api/getAll`).then((response) => {
        setItemInCart(response.data)
        // setIsLoading(false)
    // const []
    })
  }, [])

  axiosInstance.interceptors.request.use(
    config => {
      config.headers['authorization'] = userToken
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

    const CartItems = ({id, quantity}) => {
      const {removeFromCart} = useContext(CartContext)
      const item = itemInCart.find(item => item.id ===id)
      if(item == null) return null

      return (
        <View style={styles.wrapperCustom}>
          <View style={styles.cover}>
            <Image source={{uri : `https://${item.cover}`}} style={styles.image}/>
          </View>
          <View style={styles.cont2}>
            <View style={styles.column}>
              <Text style={styles.text}>{item.name}{quantity > 1 && <Text> x{quantity}</Text>}</Text>
                <Text style={styles.text}>
                  RD${item.price}
                </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.pxq}>
                RD${item.price*quantity}
              </Text>
              <TouchableOpacity style={styles.btn} onPress={() => removeFromCart(item.id)}>
                <Feather name='x' color="#000" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    const createOrder = async() =>{
      const response = await axiosInstance.post(`orders`,  {drugs: cartItems})
      setOrder(response.data.drugs)
      setCartItems([])
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Carrito</Text>
      </View>

      {cartQuantity === 0 ? (
        <View style={styles.cartEmpty}>
          <Text style={styles.textcartEmpty}>No hay productos en el carrito</Text>

        </View>
      ):
      (<View style={styles.cont3}>
         <View style={{height:'60%',}}>
          {cartItems.map(item => (
            <CartItems key={item.id} {...item} />
         ))
         }
         </View>
         <View style={styles.totalCont}>
            <Text style={styles.totalText}>
              Total: RD${cartItems.reduce((total, cartItem) => {
                const item = itemInCart.find(item => item.id === cartItem.id)
                return (total + (item?.price || 0) * cartItem.quantity)
              }, 0)}
            </Text>
            <TouchableOpacity style={styles.Comprarbtn} onPress={() => navigation.navigate('UserLocation')}>
            <Text style={styles.ComprarbtnText}>Comprar</Text>
            </TouchableOpacity>
         </View>
      </View>)}
      
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    // marginBottom: '10%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 25,
    marginLeft: '5%',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  totalText: {
    width:'95%',
    fontSize: 35,
    fontWeight: 'bold',
    marginVertical: '10%',
    color: 'black',
    textAlign: 'right',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    // width:'60%',
    color: 'black',
    textAlignVertical: 'center',
  },
  cover:{
    height:70,
    width:60,
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    width: "100%",
    height:"100%",
    resizeMode: "contain",
  },
  cont: {
    flex: 1,
    borderRadius: 5,
    margin: 5,
  },
  cont2: {
    flexDirection: "row",
    width: '85%',
    borderRadius: 5,
    padding: 4,
    marginHorizontal: 5,
    // backgroundColor: 'red'
  },
  cont3: {
    flex: 2,
    borderRadius: 8,
    paddingVertical:3,
    alignItems:"center",
    justifyContent: 'center',
  },
  column: {
    flexDirection: "column",
    // alignItems:"center",
    justifyContent: 'center',
    width: '55%',
  },
  row: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '45%',
  },
  pxq: {
    fontSize: 22,
    color: 'black',
    textAlignVertical: 'center',
    width: '60%'

  },
  totalCont: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    paddingVertical:5,
    width: '100%',
    
  },
  btn:{
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:30,
    width: '40%',
  },
  Comprarbtn:{
    backgroundColor: "#E2443B",
    marginHorizontal:10, 
    alignItems: 'center',
    paddingHorizontal:40,
    paddingVertical:15,
    borderRadius:30,
  },
  ComprarbtnText:{
    fontSize:20,
    color:"#FFF"
  },
  searchbtn:{
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:30,
    width: '10%'
  },
  btnText:{
    fontSize:15,
    color:"#000"
  },
  wrapperCustom: {
    flexDirection: "row",
    backgroundColor: 'white',
    width: '95%',
    borderRadius: 5,
    padding: 2,
    marginVertical: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  cartEmpty:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30
  },
  textcartEmpty:{
    fontSize: 25,
    color:"#808080"
  }
});

export default ShoppingCart;