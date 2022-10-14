import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-native-paper';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const OrdersScreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const { userToken } = useContext(AuthContext);

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
    axiosInstance.get('orders').then((res) => {
      setOrders(res.data);
    });
  }, []);

  function acceptOrder(order) {
    // Un modal para que el delivery acepte la orden.

    // depue si acepta se va pal mapa.

    // si no, se queda en la misma pantalla.
    navigation.navigate('MapScreen', {order: order})

  }

  return (
    <View style={style.maincontainer}>
      {orders.map((order) => (
        <View style={style.container} key={order.id}>
          <TouchableOpacity onPress={() => acceptOrder(order)}>
            <Text style={style.peroquemielda}>Orden #{order.id}</Text>
            <Text style={style.peroquemielda}>Estado: {order.status ? 'Activo' : 'Una mielda'}</Text>
            <Text style={style.peroquemielda}>Fecha: {order.createdTime.split("T")[0]}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  ) 
}

const style = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peroquemielda: {
    color: 'black',
  }
});

export default OrdersScreen;