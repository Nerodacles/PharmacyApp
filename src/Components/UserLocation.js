import React, { useEffect, useRef, useState, Component} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation, { GeoPosition } from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import Icon  from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather'

export default function UserLocation({navigation}) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: location ? location?.coords?.latitude : 18.947729907033047, 
    longitude: location ? location?.coords?.longitude :-70.4059648798399,
    latitudeDelta:  0.1,
    longitudeDelta: 0.1,
  })

  const hasLocationPermission = async () => {

    if (Platform.OS === 'android') {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition((position) => {
      setLocation(position)
      onRegionChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta:  0.00001,
        longitudeDelta: 0.00001,
      })
      console.log(position.coords);
    },
    error => {
      Alert.alert(`Code ${error.code}`, error.message);
      setLocation(null);
      console.log(error);
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 0,
      forceRequestLocation: true,
      forceLocationManager: true,
      showLocationDialog: true,
    },
  );
  };

  function onRegionChange(region) {
    setRegion(region)
  }

  useEffect(() =>{
    getLocation()
  }, [])
  
  return(
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Seleccione su ubicación</Text>
      </View>
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
            <Marker
              pinColor={'navy'}
              title={"Farmacia"}
              coordinate={{ latitude : 18.9478715 , longitude : -70.4059083 }}
            >
              <Icon 
                size={35}
                name="prescription-bottle"
                color='#000'
                
              />
            </Marker>
            {location && <Marker
              pinColor={'navy'}
              title={"Cliente 1"}
              onPress={() => console.log('hola mundo')}
              coordinate={{ latitude : location?.coords?.latitude , longitude : location?.coords?.longitude }}
            >
              {/* <Image source={{uri : "https://upload.wikimedia.org/wikipedia/commons/2/26/Pacman_HD.png"}} style={{width: 25 , height: 25}}/> */}
            </Marker>}
          </MapView>
        <View style={{ alignItems:'center', flex: 1, justifyContent: 'flex-end', width: "100%", height: "98%", margin: 10, position: 'absolute'}}>
          <TouchableOpacity style={[styles.buttons, {backgroundColor: '#4cc3eb'}]} onPress={getLocation}>
            <Text style={styles.Text}>Ir a tu Ubicación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttons, {backgroundColor: '#198754'}]} onPress={() => navigation.navigate('ConfirmLocation', {latitude : location?.coords?.latitude , longitude : location?.coords?.longitude})}>
            <Text style={styles.Text}>Confirmar Ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View> 
  );
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
});