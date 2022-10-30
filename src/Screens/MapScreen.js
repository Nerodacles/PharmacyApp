import React, { useEffect, useContext, useState } from 'react';
import { Alert,Animated ,Image, PermissionsAndroid, Platform, ScrollView, Modal, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, Dimensions} from 'react-native';
import Geolocation, { GeoPosition } from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Iconos from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const {width, height} = Dimensions.get('window')

    
const CARD_HEIGHT = height/4
const CARD_WIDTH = CARD_HEIGHT + 100


const MapScreen = ({route}) => {
    const navigation = useNavigation()
    const [ location, setLocation ] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [order, setOrder] = useState([]);
    const [idOrder, setIdOrder] = useState('');
    const [detailsModal, setDetailsModal] = useState([]);
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
    
    const getOrdenes = () => {
      axiosInstance.get(`orders/delivery/${userInfo.id}`).then((res) => {
        setOrder(res.data);
      });
    }

    const deliver = (id) =>{
      axiosInstance.post(`orders/deliver/${id}`, {id: id}).then(() => {
        getOrdenes()
      })
    }

    useEffect(() => {
      getOrdenes()
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
          axiosInstance.patch(`users/${userInfo.id}`, {location: position.coords})

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
    }

    
    useEffect(() => {
      getLocation();
      wait(10000).then(() => { getLocation() })
    }, [])
    
    let mapIndex = 0
    let mapAnimation = new Animated.Value(0)

    useEffect(() => {
      mapAnimation.addListener(({ value }) => {
        let index = Math.floor(value/CARD_WIDTH + 0.3)
        if (index >= order.length){
          index = order.length - 1
        }
        if (index <= 0 ){
          index=0
        }

        clearTimeout(regionTimeout)

        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index){
            mapIndex = index
            const { location } = order[index]
            _map.current.animateToRegion(
              {
                ...location,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
              },
                350
            )
          }
        }, 10)
      })
    })

    const interpolations = order.map((markers, index) => {
      if (markers.delivered === 'on the way'){
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH
          ]
          const scale = mapAnimation.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp'
          })
          const opacity = mapAnimation.interpolate({
            inputRange,
            outputRange:[.35, 1, .35],
            extrapolate: 'clamp',
          })
          return { scale, opacity }
        } else{
          return null
      }
    })

    const _map = React.useRef(null)

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
                ref={_map}
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
                {location && <Marker pinColor={'navy'} title={"Delivery"} coordinate={location}>
                    <Iconos size={35} name="moped" color='#000' />
                </Marker>}
                {order.map((markers, index) => {
                  const scaleStyle = {
                    transform: [
                      {
                        scale: interpolations[index].scale
                      }
                    ]
                  }
                  const opacityStyle = {
                    opacity: interpolations[index].opacity
                  }
                  if (markers.delivered === 'on the way'){
                    return (<Marker key={index} coordinate={{ latitude: Number(markers.location.latitude), longitude: Number(markers.location.longitude) }}>
                    <Animated.View style={[styles.markerWrap, opacityStyle]}>
                      <Animated.Image source={require('../assets/images/map_marker.png')} style={[styles.marker, scaleStyle]} resizeMode='cover' />
                    </Animated.View>
                    <View style={styles.container}>
                      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>¿Entrego la orden?</Text>
                              <View style={styles.contenedor}>
                                <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (deliver(idOrder), setModalVisible(!modalVisible))}>
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
                    </Marker>
                    )
                    } else{
                      return null
                  }
                })}
              </MapView>
              <Animated.ScrollView horizontal scrollEventThrottle={1} showsHorizontalScrollIndicator={false} snapToInterval={CARD_WIDTH + 20} style={styles.scrollView} contentContainerStyle={styles.endPadding} 
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: {
                      x: mapAnimation
                    }
                  }
                }
              ], { useNativeDriver: true })}>
                {order.map((markers, index) => {
                    if (markers.delivered === 'on the way'){
                      return (
                        <View key={index} style={styles.card}>
                          <View style={styles.cardImage} >
                            <Text numberOfLines={1} style={styles.cardtitle}>
                              {markers.user}
                            </Text>
                            {/* <Text numberOfLines={1} style={[styles.cardDescription]}>
                              {markers.user}
                            </Text> */}
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.direction}
                            </Text>
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.street}
                            </Text>
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.houseNumber}
                            </Text>
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.reference}
                            </Text>
                            {/* {markers.drugs.map((drug, id) => {
                                return(
                                  <Text key={id} numberOfLines={1} style={{fontSize: 16, color:"#000"}}>
                                    {drug.name}
                                  </Text>
                                )
                              })} */}
                          </View>
                          <View style={styles.textContent}>
                            <TouchableOpacity onPress={() => (setDetailsModal(markers) ,setDetailsModalVisible(true))} style={[styles.signIn, {borderColor: '#000', borderWidth: 0.5}]}>
                              <Text numberOfLines={1} style={[styles.textSign, {color: '#FF6347'}]}> Detalles </Text>
                            </TouchableOpacity>
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity onPress={() => (setIdOrder(markers.id), setModalVisible(true))} style={[styles.signIn, { backgroundColor: '#E2443B' }]}>
                                <Text numberOfLines={1} style={[styles.textSign, {color: '#FFF'}]}> Entregar </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.container}>
                              <Modal animationType="slide" transparent={true} visible={detailsModalVisible} onRequestClose={() => { setDetailsModalVisible(!detailsModalVisible) }} >
                                <View style={styles.centeredView}>
                                  <View style={[styles.modalView, {width: '90%', height: '50%',}]}>
                                    <View style={{width: '100%', height: '60%'}}>
                                    <Text numberOfLines={1} style={[styles.cardtitle, {alignSelf: 'center', marginBottom: 10}]}>
                                      Farmacos
                                    </Text>
                                      {detailsModal.drugs.map((drug, id) => {
                                        return(
                                          <Text key={id} numberOfLines={1} style={{fontSize: 16, color:"#000"}}>
                                            {drug.name}
                                          </Text>
                                        )
                                      })}
                                    </View>
                                      <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', height: '40%'}}>
                                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setDetailsModalVisible(!detailsModalVisible)}>
                                          <Text style={styles.textStyle}>Cerrar</Text>
                                        </Pressable>
                                      </View>
                                    </View>
                                  </View>
                              </Modal>  
                            </View>
                            {/* <Text numberOfLines={1} style={styles.cardtitle}>
                              {markers.user}
                            </Text>
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.direction}, {markers.moreDetails.reference}
                            </Text>
                            <Text numberOfLines={1} style={styles.cardDescription}>
                              {markers.moreDetails.direction}, {markers.moreDetails.reference}
                            </Text> */}
                          </View>
                        </View>
                      )
                      } else{
                        return null
                    }
                  })}
              </Animated.ScrollView>
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
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width:50,
    height:50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  ring: {
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
   cardImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    marginBottom: 16
  },
  textContent: {
    flex: 1,
    marginTop: 16
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 5
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
  cardtitle: {
    fontSize: 22,
    marginTop: 5,
    color: '#000',
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  });

export default MapScreen;
