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

export default function PaymentMethod({navigation}) {
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
        latitudeDelta:  0.0001,
        longitudeDelta: 0.0001,
      })
      // position.MapView.AnimatedRegion({
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      //   latitudeDelta:  1,
      //   longitudeDelta: 1,
      // })
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
  
  return(
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Productos</Text>
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
              {/* <Image source={{uri : "https://upload.wikimedia.org/wikipedia/commons/2/26/Pacman_HD.png"}} style={{width: 25 , height: 25}}/> */}
            </Marker>
            {location && <Marker
              pinColor={'navy'}
              title={"Cliente 1"}
              coordinate={{ latitude : location?.coords?.latitude , longitude : location?.coords?.longitude }}
            >
              <Image source={{uri : "https://upload.wikimedia.org/wikipedia/commons/2/26/Pacman_HD.png"}} style={{width: 25 , height: 25}}/>
            </Marker>}
          </MapView>
      </View>
      <TouchableOpacity style={styles.buttons} onPress={getLocation}>
        <Text style={styles.Text}>Get Location</Text>
      </TouchableOpacity>
    </View> 
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
    backgroundColor: 'red'
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
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
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
  },
  title: {
    fontSize: 25,
    marginLeft: '30%',
    fontWeight: 'bold',
    marginBottom: '10%',
    color: 'black',
    textAlign: 'center'
  },
});