// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { ActivityIndicator, View, Text, Button, StatusBar, ScrollView, SafeAreaView,Image, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform, Alert, Pressable, Modal } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const Tab = createMaterialTopTabNavigator();

const OrdenesPasadas = ({ navigation }) => {
  const { userToken, userInfo }= useContext(AuthContext);
  const [detailsModal, setDetailsModal] = useState([]);
  const [details, setDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ ordenes, setOrdenes ] = useState([]);

  // console.log(detailsModal)
  
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

  function Completas() {
    const [detailsModal, setDetailsModal] = useState([]);
    return(
      
      <SafeAreaView style={{ flex:1,width:'100%', height: "100%", alignItems: 'center', backgroundColor: '#FFF',}}>
        <ScrollView style={{ width:'100%', height: "100%"}}>
          {ordenes.map((item, index) => {
            if (item?.delivered === 'yes'){
            return (
              <View key={index} style={[{ backgroundColor: 'white' }, styles.cont2]}>
                <View style={{flexDirection:"row", width: "100%", marginBottom:5}}>
                  <Text style={[styles.text, {width:"80%"}]}> Tracking ID: {item.id} </Text>
                  <Text style={[styles.text, {width: "30%"}]}> {item.createdTime.split("T")[0]} </Text>
                </View>
              <Text style={[styles.text, {marginBottom:5, alignSelf: 'flex-end'}]}><Text style={[styles.text, {color:'#808080' }]}>Precio Total</Text> RD$ {item?.totalPrice.toLocaleString('en-us') } </Text>
              <View style={{flexDirection: 'row', flex:1, justifyContent: 'space-between', marginVertical: 5}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => (setDetailsModal(item), setDetails(item.drugs) ,setModalVisible(true))} style={[styles.signIn, {borderColor: '#000', borderWidth: 1, borderRadius: 20}]}>
                    <Text numberOfLines={1} style={[styles.textSign, {color: '#FF6347'}]}> Detalles </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, {color: item?.delivered === 'yes' ? '#4BB543' : '#FFFF00' }]}>{item?.delivered === 'yes' ? 'Entregado' : 'En camino'} </Text>
              </View>
              {/* <Text style={styles.text}> Fármacos: </Text> */}
              {/* { item.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.name} </Text> })} */}
              {/* <Text style={styles.text}> Detalles: {item.moreDetails.direction}, {item.moreDetails.street} </Text> */}
              <View style={styles.modalContainer}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                  <View style={styles.centeredView}>
                    <View style={[styles.modalView, {width: '90%', height: '50%',}]}>
                      <View style={{width: '100%', height: '60%'}}>
                      <Text numberOfLines={1} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                        Farmacos
                      </Text>
                        {details.map((drug, i) => {
                          return(
                            <Text key={i} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                              {drug.name} x{drug.quantity}
                            </Text>
                          )
                        }) }

                      </View>
                        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', height: '40%'}}>
                          <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cerrar</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                </Modal>  
              </View>
            </View>
            
            )}
          })}
        </ScrollView>
      </SafeAreaView>
        
    
    )
  }

  function Pendientes() {
    return(
      
      <SafeAreaView style={{ flex:1,width:'100%', height: "100%", alignItems: 'center', backgroundColor: '#FFF',}}>
        <ScrollView style={{ width:'100%', height: "100%"}}>
          {ordenes.map((item, index) => {
            if (item?.delivered === 'no'){
            return (
              <View key={index} style={[{ backgroundColor: 'white' }, styles.cont2]}>
                <View style={{flexDirection:"row", width: "100%", marginBottom:5}}>
                  <Text style={[styles.text, {width:"80%"}]}> Tracking ID: {item.id} </Text>
                  <Text style={[styles.text, {width: "30%"}]}> {item.createdTime.split("T")[0]} </Text>
                </View>
              <Text style={[styles.text, {marginBottom:5, alignSelf: 'flex-end'}]}><Text style={[styles.text, {color:'#808080' }]}>Precio Total</Text> RD$ {item?.totalPrice.toLocaleString('en-us') } </Text>
              <View style={{flexDirection: 'row', flex:1, justifyContent: 'space-between', marginVertical: 5}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => (setDetailsModal(item), setDetails(item.drugs)  ,setModalVisible(true))} style={[styles.signIn, {borderColor: '#000', borderWidth: 1, borderRadius: 20}]}>
                    <Text numberOfLines={1} style={[styles.textSign, {color: '#FF6347'}]}> Detalles </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, {color: item?.delivered === 'yes' ? '#4BB543' : '#ed4337' }]}>{item?.delivered === 'yes' ? 'Entregado' : 'Pendiente'} </Text>
              </View>
              {/* <Text style={styles.text}> Fármacos: </Text> */}
              {/* { item.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.name} </Text> })} */}
              {/* <Text style={styles.text}> Detalles: {item.moreDetails.direction}, {item.moreDetails.street} </Text> */}
              <View style={styles.modalContainer}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                  <View style={styles.centeredView}>
                    <View style={[styles.modalView, {width: '90%', height: '50%',}]}>
                      <View style={{width: '100%', height: '60%'}}>
                      <Text numberOfLines={1} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                        Farmacos
                      </Text>
                      {console.log(detailsModal.drugs)}
                        {details.map((drug, i) => {
                          return( 
                            <Text key={i} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                              {drug.name} x{drug.quantity}
                            </Text>
                          )
                        }) }

                      </View>
                        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', height: '40%'}}>
                          <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cerrar</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                </Modal>  
              </View>
            </View>
            
            )}
          })}
        </ScrollView>
      </SafeAreaView>
        
    
    )
  }

  function EnCamino() {
    return(
      
      <SafeAreaView style={{ flex:1,width:'100%', height: "100%", alignItems: 'center', backgroundColor: '#FFF',}}>
        <ScrollView style={{ width:'100%', height: "100%"}}>
          {ordenes.map((item, index) => {
            if (item?.delivered === 'on the way'){
            return (
              <View key={index} style={[{ backgroundColor: 'white' }, styles.cont2]}>
                <View style={{flexDirection:"row", width: "100%", marginBottom:5}}>
                  <Text style={[styles.text, {width:"80%"}]}> Tracking ID: {item.id} </Text>
                  <Text style={[styles.text, {width: "30%"}]}> {item.createdTime.split("T")[0]} </Text>
                </View>
              <Text style={[styles.text, {marginBottom:5, alignSelf: 'flex-end'}]}><Text style={[styles.text, {color:'#808080' }]}>Precio Total</Text> RD$ {item?.totalPrice.toLocaleString('en-us') } </Text>
              <View style={{flexDirection: 'row', flex:1, justifyContent: 'space-between', marginVertical: 5}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => (setDetailsModal(item), setDetails(item.drugs)  ,setModalVisible(true))} style={[styles.signIn, {borderColor: '#000', borderWidth: 1, borderRadius: 20}]}>
                    <Text numberOfLines={1} style={[styles.textSign, {color: '#FF6347'}]}> Detalles </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, {color: item?.delivered === 'yes' ? '#4BB543' : '#8B8000' }]}>{item?.delivered === 'yes' ? 'Entregado' : 'En camino'} </Text>
              </View>
              {/* <Text style={styles.text}> Fármacos: </Text> */}
              {/* { item.drugs.map((drug, index) => { return <Text style={styles.text} key={index}> {drug.name} </Text> })} */}
              {/* <Text style={styles.text}> Detalles: {item.moreDetails.direction}, {item.moreDetails.street} </Text> */}
              <View style={styles.modalContainer}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                  <View style={styles.centeredView}>
                    <View style={[styles.modalView, {width: '90%', height: '50%',}]}>
                      <View style={{width: '100%', height: '60%'}}>
                      <Text numberOfLines={1} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                        Farmacos
                      </Text>
                        {details.map((drug, i) => {
                          return(
                            <Text key={i} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                              {drug.name} x{drug.quantity}
                            </Text>
                          )
                        }) }

                      </View>
                        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', height: '40%'}}>
                          <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cerrar</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                </Modal>  
              </View>
            </View>
            
            )}
          })}
        </ScrollView>
      </SafeAreaView>
        
    
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de Ordenes</Text>
      </View>
      { !ordenes.length ? 
      <View style={[styles.header, {flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: -30}]}>
        <Text style={[styles.text, {fontSize: 25, color:"#808080", fontWeight: 'normal'}]}>No ha realizado pedidos</Text>
      </View>
      : 
      <Tab.Navigator>
          <Tab.Screen name="Completas" component={Completas} />
          <Tab.Screen name="En camino" component={EnCamino} />
          <Tab.Screen name="Pendientes" component={Pendientes} />
      </Tab.Navigator>
      }
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // alignItems:"center",
    // width:'100%', 
    // height: "100%"
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
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
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
  // cont: {
  //   flexDirection: "row",
  // },
  cont2: {
    flexDirection: "column",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical:5,
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
  buttonContainer: {
    alignItems: 'center',
    width:"30%",
    marginLeft: 5
  },
  signIn: {
    width: '100%',
    padding:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
      fontSize: 14,
      fontWeight: 'bold'
  },
  modalContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    // alignItems:'center', flex: 1, justifyContent: 'flex-end', width: "100%", height: "98%", margin: 10, position: 'absolute',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    width: '100%',
    height:'100%',
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 60,
    padding: 35,
    position:'absolute',
    // alignItems: "center",
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
modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'black'
  },
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardtitle: {
    fontSize: 22,
    marginTop: 5,
    color: '#000',
    fontWeight: "bold",
  },
});

export default OrdenesPasadas;