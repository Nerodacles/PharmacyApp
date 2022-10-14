import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable, Modal} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-native-paper';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const OrdersScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
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
    setModalVisible(true)
    setOrder(order)
  }

  function accept() {
    navigation.navigate('MapScreen', {order: order})
    setModalVisible(false)
  }

  return (
    <View style={styles.maincontainer}>
      {orders.map((order) => (
        <View style={styles.container} key={order.id}>
          <TouchableOpacity onPress={() => acceptOrder(order)}>
            <Text style={styles.peroquemielda}>Orden #{order.id}</Text>
            <Text style={styles.peroquemielda}>Estado: {order.status ? 'Activo' : 'Una mielda'}</Text>
            <Text style={styles.peroquemielda}>Fecha: {order.createdTime.split("T")[0]}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Desea aceptar la orden?</Text>
              <View style={styles.contenedor}>
                <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (accept(), setModalVisible(!modalVisible))}>
                  <Text style={styles.textStyle}>Aceptar</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
      </Modal>
      </View>
    </View>
  ) 
}

const styles = StyleSheet.create({
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
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '5%',
    marginBottom: '30%',
    color: 'black',
    textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 60,
    padding: 35,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    borderRadius: 40,
    padding: 20,
    margin: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#4cc3eb",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  buttonClose: {
    backgroundColor: "#E2443B",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'black'
  },
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default OrdersScreen;