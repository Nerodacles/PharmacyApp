// In App.js in a new project

import React, { useContext } from 'react';
import { View, Text, Button, StatusBar, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'react-native-linear-gradient';

const HomeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);
    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: "#FFF" }}>
            
            <View style={{
                backgroundColor:"#4cc3eb",
                height: "20%",
                margin:10,
                borderRadius:20,
                paddingHorizontal:20
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
           </View>
        </View>
  );
};

export default HomeScreen;