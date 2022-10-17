import React, { useEffect, useContext, useState } from 'react';
import { Alert, Image, PermissionsAndroid, Platform, ScrollView, Modal, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, } from 'react-native';
import Geolocation, { GeoPosition } from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Iconos from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const MapScreen = ({route}) => {
    const navigation = useNavigation()
    const [ location, setLocation ] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [order, setOrder] = useState([]);
    const { userToken, userInfo } = useContext(AuthContext);
    const [ region, setRegion ] = useState({
        latitude: location ? location.coords?.latitude : 18.947729907033047,
        longitude: location ? location.coords?.longitude : -70.4059648798399,
        latitudeDelta:  0.1,
        longitudeDelta: 0.1,
    })

    axiosInstance.interceptors.request.use(
      config => {
        config.headers['authorization'] = userToken
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    const deliver = (id) =>{
      axiosInstance.post(`orders/deliver/${id}`, {id: id})
    }

    useEffect(() => {
      axiosInstance.get(`orders/delivery/${userInfo.id}`).then((res) => {
        setOrder(res.data);
        // console.log(res.data.location)
      });
    }, []);

    const hasLocationPermission = async () => {
        if (Platform.OS === 'android') { return true }
        const hasPermission = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        if (hasPermission) { return true }
        const status = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        if (status === PermissionsAndroid.RESULTS.GRANTED) { return true }

        if (status === PermissionsAndroid.RESULTS.DENIED) { ToastAndroid.show( 
            'Location permission denied by user.',
            ToastAndroid.LONG,
        )} else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) { ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
        )}
        return false;
    };

    const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)) }

    const getLocation = async () => {
        const hasPermission = await hasLocationPermission();
    
        if (!hasPermission) { return }
        Geolocation.getCurrentPosition((position) => {
          setLocation(position.coords);
          onRegionChange({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })
          axiosInstance.patch(`users/${userInfo.id}`, {location: location})

        }, (error) => {
          Alert.alert(`Code ${error.code}`, error.message);
          setLocation(null);
        }, 
        {
          accuracy: { android: 'high', ios: 'best' },
          enableHighAccuracy: true,
          distanceFilter: 0,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        })
    }
    function onRegionChange(region) {
      setRegion(region)
      // wait(10000).then(() => { getLocation() })
      console.log(location)
    }
    

    useEffect(() => {
      // getLocation();
    }, [])

    return(
        <View style={styles.mainContainer}>
            {/* <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" color="#000" size={25} />
            </TouchableOpacity>
            <Text style={styles.title}>Productos</Text>
            </View> */}
            <View style={styles.MapContainer}>
            <MapView
                mapType='standard'
                provider={PROVIDER_GOOGLE}
                enableZoomControl={true}
                zoomEnabled={true}
                minZoomLevel={15}
                region={region}
                showsScale={true}
                // onRegionChange={onRegionChange}
                style={styles.map}>
                <Marker pinColor={'navy'} title={"Farmacia"} coordinate={{ latitude : 18.9478715 , longitude : -70.4059083 }} >
                    <Icon size={35} name="prescription-bottle" color='#000' />
                </Marker>
                {/* {location && <Marker pinColor={'navy'} title={"Delivery"} coordinate={location}>
                    <Iconos size={35} name="moped" color='#000' />
                </Marker>} */}
                {order.map(markers => {
                  if (markers.delivered === 'on the way'){
                    return (<Marker key={markers.id} onPress={() =>  setModalVisible(true)} coordinate={{ latitude: Number(markers.location.latitude), longitude: Number(markers.location.longitude) }} title={markers.user} >
                    <Iconos size={35} name="person" color='#000' />
                    <View style={styles.container}>
                      {console.log(modalVisible)}
                      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>¿Entrego la orden?</Text>
                              <View style={styles.contenedor}>
                                <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (deliver(markers.id), setModalVisible(!modalVisible))}>
                                  <Text style={styles.textStyle}>Si</Text>
                                </Pressable>
                                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                                  <Text style={styles.textStyle}>No</Text>
                                </Pressable>
                              </View>
                            </View>
                          </View>
                      </Modal>
                    </View>
                    {console.log(markers.location)}
                    </Marker>)
                    } else{
                      return null
                  }
                })}
              </MapView>
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000',
    // width: '100%',
    // height: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  Text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  MapContainer:{
    flex: 2,
    width: '100%',
    height: '80%',
    // justifyContent: 'center',
    // alignItems: 'center',
    
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    justifyContent: 'center',
    backgroundColor: '#423423',
    borderRadius: 15,
    // position: 'relative',
    margin: 12,
    width: '50%',
    height: '5%',
    color: '#000'
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: '2%',
  },
  title: {
    fontSize: 25,
    marginLeft: '5%',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // alignItems:'center', flex: 1, justifyContent: 'flex-end', width: "100%", height: "98%", margin: 10, position: 'absolute',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: '100%',
    height:'50%',
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 60,
    padding: 35,
    position:'absolute',
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

export default MapScreen;