import React, { useContext, useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const HomeScreen = ({navigation}) => {
    const [items, setItems] = useState([]);
    const { userInfo, userToken } = useContext(AuthContext);

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
        if (userInfo.role === 'delivery') {
            axiosInstance.get('orders').then((res) => {
                setItems([]);
                return setItems(res.data);
            });
        }
        else {
            axiosInstance.get('api/getAll').then((res) => {
                setItems([]);
                return setItems(res.data);
            });
        }
    }, []);

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

            <View style={{height: 500, alignItems: "center"}}>
                <View style={{ 
                    backgroundColor:"#0062da", 
                    height: "50%",
                    margin:10, 
                    borderRadius:20,
                    paddingHorizontal:30,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 7, },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,
                    elevation: 14,
                }}>
                    <View style={{ flexDirection:"column", alignItems: "center", marginTop: 25, marginVertical: 30, width:"100%" }}>
                        <View style={{width: "100%", alignItems: 'center'}}>
                            {
                                userInfo.role === 'delivery' ? <Text style={{ fontSize: 30, color: '#FFF', fontWeight: 'bold' }}>Historico de Ordenes</Text> :
                                <Text style={{ fontSize: 30, color: '#FFF', fontWeight: 'bold' }}>Productos mas vendidos</Text>
                            }
                            
                        </View>
                        <View style={{width:"50%", alignItems: "flex-end", marginTop: 10, flexDirection: "row"}}>
                            {
                                userInfo.role === 'delivery' ? 
                                items.map((item) => (
                                    <View key={item.id} style={{color: 'black', margin: 5}}>
                                        <Text style={{color: 'black'}}>{item.id}</Text>
                                    </View>
                                )) :
                                items.map((item) => (
                                    <View key={item.id} style={{color: 'black', margin: 5}}>
                                        <View style={styles.cover}>
                                            <Image source={{uri: `https://${item.cover}`}} style={styles.img}/>
                                        </View>
                                        <Text style={{color: 'black'}}>{item.name}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </View>
            
            {userInfo.role === 'delivery' ? null :
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
                </View>
            }
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
    img:{
        height:"100%",
        width:"100%",
        resizeMode:"cover"
    },
    cover:{
        height:100,
        width:100,
    },
});

export default HomeScreen;