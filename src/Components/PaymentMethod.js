// In App.js in a new project

import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
import DropDownPicker from 'react-native-dropdown-picker';
import WebView from 'react-native-webview';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const PaymentMethod = ({route}) => {
  const [paymentMet, setPaymentMet] = useState([{id: 1, name: 'Efectivo'}, {id: 2, name: 'Paypal/Tarjeta de Credito'}])
//   console.log(paymentMet)
  const [open, setOpen] = useState(false);
const {userToken}= useContext(AuthContext);
  const [cantidad, setCantidad] = useState(0)
  const navigation = useNavigation()
  const [order, setOrder] = useState([])
  const [metodo, setMetodo] = useState([])
  const { cartItems, cartQuantity, setCartItems } = useContext(CartContext)
  const [value, setValue] = useState([])
  const { latitude, longitude, direccion , calle, numero, referencia } = route.params
  console.log(latitude, longitude, direccion , calle, numero, referencia)

  axiosInstance.interceptors.request.use(
    config => {
      config.headers['authorization'] = userToken
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  const onChangeCantidad = (cantidad) =>{
    setCantidad(cantidad)
  }

  const createOrder = async() =>{
    console.log(cartItems)
    const response = await axiosInstance.post(`orders`,  
      {drugs: cartItems, 

      location : {
        latitude: latitude, 
        longitude: longitude}, 

      payment: {
        paymentMethod: value, 
        cash: cantidad}, 

      moreDetails: {
        direction: direccion, 
        street: calle, 
        houseNumber: numero, 
        reference: referencia}
      })
    setOrder(response.data)

    console.log(response.data)
    // setCartItems([])
  }


  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" color="#000" size={25} />
          </TouchableOpacity>

          <Text style={styles.title}>Método de Pago</Text>
        </View>
      <View style={styles.centeredView}>
        <View style={styles.textContainer}>
            <Text style={styles.text}>Metodo de Pago</Text>
            <DropDownPicker
                schema={{ label: 'name', value: 'name' }}
                open={open}
                items={paymentMet}
                value={value}
                setOpen={setOpen}
                setValue={setValue}
                theme="LIGHT"
                setItems={setPaymentMet}
                dropDownContainerStyle={{width:'90%', alignSelf: 'center',}}
                style={{width:'90%', paddingTop: 10, fontSize: 10, minHeight: 50, color: 'black', alignSelf: 'center',borderRadius: 15, borderWidth: 1,}}
            />
        </View>
        {value === 'Efectivo' ? 
        <View style={styles.textContainer}>
            <Text style={styles.text}>Cantidad</Text>
            <TextInput onChangeText={onChangeCantidad} value={cantidad}  keyboardType='numeric' style={styles.input}
            />
        </View>
        : 
        <View style={[styles.textContainer, {flex: 1, height: '50%'}]}>
            {/* <WebView
              originWhitelist={['*']}
              useWebView2
              source={{uri: 'https://youtu.be/9qm9MghFQdI'}}
              style={styles.video}
            /> */}
        </View>

        }
      </View>
      {console.log(metodo)}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          // disabled={value == '' || metodo =='' ? true : false}
          onPress={() => createOrder()}>
          <Text style={styles.buttonText}> Aceptar </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
  },
  title: {
    fontSize: 25,
    marginLeft: '5%',
    fontWeight: 'bold',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center'
  },
  video: {
    marginTop: 20,
    maxHeight: 700,
    width: 411,
    flex: 1
  },
  input: {
    width:'90%',
    paddingTop: 10,
    // marginHorizontal: 10,
    fontSize: 20,
    minHeight: 50,
    color: 'black',
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
  },
  centeredView: {
    width: '100%',
    flex: 1,
    marginTop: 30
  },
  textContainer: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    // textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 20,
    marginLeft: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginRight: 35,
    marginVertical: 25,
  },
  button: {
    width: '50%',
    backgroundColor: '#4cc3eb',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default PaymentMethod;