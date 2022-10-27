import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable, Modal, SafeAreaView, ScrollView, RefreshControl} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });



const Tab = createMaterialTopTabNavigator();

const OrdersScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [drugs, setDrugs] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    
    const getOrdenes = () => {
      axiosInstance.get('orders').then((res) => {
        setOrders(res.data);
      });
    }
    
    useEffect(() => {
      setIsLoading(true)
      getOrdenes()
      setIsLoading(false)
    }, []);

    const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)) }

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(1000).then(() => {
        axiosInstance.get('orders').then((result) => {
          setOrders(result.data)
          setRefreshing(false)
        });
      })
    }, []);
  
    if ( isLoading ){
      return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#FFF'}}>
        <ActivityIndicator size="large" color="#4cc3eb" style={{opacity: 1}} />
      </View>)
    } 
    
    function acceptOrder(orden) {
      setModalVisible(true)
      setOrder(orden)
    }
    
    function accept(id) {
      axiosInstance.post(`orders/accept/${id}`, {id: id}).then(() => {
        axiosInstance.get('orders').then((res) => {
          setOrders(res.data);
        });
      }
      )
      // navigation.navigate('MapScreen', {order: order})
      setModalVisible(false)
    }

    function OrdenesActivas() {
      return (
        <SafeAreaView style={styles.maincontainer}>
          <ScrollView style={{width: '100%', height: '100%'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

          {orders.map((order) => {
            if (order.delivered === 'on the way'){
              return (
                <Pressable key={order.id} onPress={() => acceptOrder(order)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? 'rgb(210, 230, 255)'
                        : 'white'
                    }]}>
                      <View style={styles.wrapperCustom}>
                        <View style={styles.row}>
                          <View style={styles.rowSpace}>
                          <Text style={[styles.textName, {fontWeight: 'bold'}]}>No. de Orden: #{order.id}</Text>
                          </View>
                        </View>
                        <View style={styles.column}>
                          <Text style={styles.textName}>Fármacos: { order.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.quantity + ' de ' + drug.name}, </Text> })}</Text> 
                          <Text style={styles.textName}>Usuario: {order.user}</Text>
                          <Text style={styles.textName}>Estado: {order.delivered === 'on the way' ? 'Activo' : 'Pendiente'}</Text>
                          <Text style={styles.textPrice}>Fecha: {order.createdTime.split("T")[0]}</Text>
                        </View>
                      </View>
                </Pressable>
              )
            }
          })}
    
          <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Desea aceptar la orden?</Text>
                    <View style={styles.contenedor}>
                      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (accept(order.id), setModalVisible(!modalVisible))}>
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
      </ScrollView>
      </SafeAreaView>
      )}
    
    function OrdenesPendientes() {
      return (
        <SafeAreaView style={styles.maincontainer}>
          <ScrollView style={{width: '100%', height: '100%'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
          
          {orders.map((order) => {
            if (order.delivered === 'no'){
              return (
                <Pressable key={order.id} onPress={() => acceptOrder(order)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? 'rgb(210, 230, 255)'
                        : 'white'
                    }]}>
                      <View style={styles.wrapperCustom}>
                        <View style={styles.row}>
                          <View style={styles.rowSpace}>
                          <Text style={[styles.textName, {fontWeight: 'bold'}]}>No. de Orden: #{order.id}</Text>
                          </View>
                        </View>
                        <View style={styles.column}>
                          <Text style={styles.textName}>Fármacos: { order.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.quantity + ' de ' + drug.name}, </Text> })}</Text> 
                          <Text style={styles.textName}>Usuario: {order.user}</Text>
                          <Text style={styles.textName}>Estado: {order.delivered === 'on the way' ? 'Activo' : 'Pendiente'}</Text>
                          <Text style={styles.textPrice}>Fecha: {order.createdTime.split("T")[0]}</Text>
                        </View>
                      </View>
                </Pressable>
              )
            }
          })}
    
          <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Desea aceptar la orden?</Text>
                    <View style={styles.contenedor}>
                      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (accept(order.id), setModalVisible(!modalVisible))}>
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
      </ScrollView>
      </SafeAreaView>
    )}
    
    return (
      <Tab.Navigator>
        <Tab.Screen name="Activas" component={OrdenesActivas} />
        <Tab.Screen name="Pendientes" component={OrdenesPendientes} />
      </Tab.Navigator>
  ) 
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: '#fff',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
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
  },
  textPrice: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textAlignVertical: "center",
  },
  textName: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textAlignVertical: "center",
    marginBottom: 5,
  },
  wrapperCustom: {
    flexDirection: "column",
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '90%',
    // height: '30%',
    padding: 4,
    marginVertical: 10,
    shadowColor: "#000",
    alignSelf: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  rowSpace:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  column: {
    justifyContent: 'center',
    // backgroundColor: 'red',
    width:'90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    width:'90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
});

export default OrdersScreen;