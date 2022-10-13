// In App.js in a new project

import React, { useContext } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);
    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: "#FFF" }}>
            
            <View style={{
                backgroundColor:"#0062da",
                height: "20%",
                margin:10,
                borderRadius:20,
                paddingHorizontal:20,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,

                elevation: 14,
            }}>
                <View style={{
                    flexDirection:"row",
                    alignItems: "center",
                    marginTop: 25,
                    marginVertical: 30,
                    width:"100%"
                }}>
                    <View style={{width: "50%", alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 30,
                            color: '#FFF',
                            fontWeight: 'bold' }}>Bienvenido {userInfo.username ? userInfo.username : "RandomUser"}</Text>
                    </View>
                    <View style={{width:"50%", alignItems: "flex-end"}}>
                        <Image 
                            source={require('../assets/images/icon.png')}
                            style={{height:60, width:60}}
                        />
                    </View>
                </View>
            </View>
            
           <View style={{margin: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('Products')} 
                style={{
                padding:10,
                borderRadius: 20,
                margin:20,
                backgroundColor: "#4cc3eb",
                alignItems: "center"
                }} 
                >
                <Text style={{fontSize:20}}>Ir a los Productos</Text>
            </TouchableOpacity>

            {/* <View style={styles.container}>
                <MapView 
                // showsCompass={true}
                // provider={PROVIDER_GOOGLE}
                // mapType={Platform.OS == "android" ? "none" : "standard"}
                  initialRegion={{
                    latitude: 37.378825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                style={styles.map} >
                    <Marker
                        coordinate={{ latitude : 19.3244234 , longitude : 29.324324 }}
                    />
                </MapView> */}

            {/* </View> */}
           </View>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
   });

export default HomeScreen;