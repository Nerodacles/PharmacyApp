// In App.js in a new project

import React, { useState, useRef, useContext } from 'react';
import { View, Text, Button, StatusBar, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const LoginScreen = ({navigation}) => {
  const {login} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);


  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeUsername = (username) => {
    setUsername(username);
  }

  const onChangeEmail = (email) => {
    setEmail(email);
  }

  const onChangePasswd = (password) => {
    setPassword(password);
  }

  const onChangeHandler = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setEmail('');
  }

  const onSubmit = () => {
    setIsLoading(true);
    // if (!username.trim() || !password.trim() || (!isLogin && !email.trim())){
    //     alert("Usuario, correo o contraseña invalido");
    //     return;
    // }
    // try{
        axiosInstance.post(`users/${!isLogin && 'register'}`, {
            username,
            email,
            password,
        }).then(res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo.token);

            // AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            // AsyncStorage.setItem('userToken', userInfo.token);

            // console.log(res.data)
            // console.log('User TOken: '+ userInfo.token)


        })
        .catch(e => {
            console.log(`Login error: ${e}`)
        })
        // if (res.status === 200){
        //   let userInfo = res.data;
        //   console.log(userInfo)
        //   console.log('User token: ' + userInfo.token)
        //   setUserInfo(userInfo);
        //   setUserToken(userInfo.token)

        //   AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
        //   AsyncStorage.setItem('userToken', userInfo.token)
        //   // onLoggedIn(res.data)
        //   setIsLoading(false);
        // }
    
    // } 
    // catch (e){
    //     console.log(`Login error: ${e}`)
    // }
  }

  return (
        <View style={{
            flex:1,
            backgroundColor: '#FFFFFF'
        }}>
            <View style={styles.card}>
                <StatusBar backgroundColor= '#FFFFFF' barStyle='dark-content'/>
                <Text style={styles.heading}>
                    {isLogin ? 'Inicio de Sesión' : 'Crear Cuenta'}
                </Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        {!isLogin && <TextInput 
                            value={email} 
                            style={styles.input} 
                            placeholderTextColor="black"  
                            placeholder="Correo" 
                            autoCapitalize="none" 
                            onChangeText={onChangeEmail}>
                        </TextInput>}
                        
                        <TextInput 
                            value={username} 
                            style={styles.input} 
                            placeholderTextColor="black" 
                            placeholder="Usuario" 
                            onChangeText={onChangeUsername}>
                        </TextInput>

                        <TextInput 
                            value={password} 
                            secureTextEntry={true} 
                            style={styles.input} 
                            placeholderTextColor="black" 
                            placeholder="Contraseña" 
                            onChangeText={onChangePasswd}>
                        </TextInput>
                        
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                        
                        <View style={{justifyContent: 'center', flexDirection: 'row', width: '100%', marginBottom: '20%'}}>
                            <Text style={{
                                width: '30%',
                                backgroundColor: '#3b5998',
                                height: 30,
                                borderRadius: 50,
                                padding: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 5,
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                Facebook
                            </Text>
                            <Text style={{
                                width: '30%',
                                backgroundColor: '#EA4335',
                                height: 30,
                                borderRadius: 50,
                                padding: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 5,
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                Google
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={isLogin ? () => {login(username, password)} : onSubmit}>
                            <Text style={styles.buttonText}>{isLogin ? 'Iniciar Sesión' : 'Registrarte'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                            <Text style={styles.buttonAltText}>{isLogin ? 'Crear nueva cuenta' : '¿Tienes una cuenta? Inicia sesión'}</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
        </View>
  ) 
}

const styles = StyleSheet.create({
  card: {
      flex: 1,
      backgroundColor: '#adadas',
      marginTop: '40%',
      borderRadius: 20,
      maxHeight: 380,
      paddingBottom: '30%',
      marginHorizontal: 20


  },
  heading: {
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: '5%',
      marginBottom: '30%',
      color: 'black',
      textAlign: 'center'
  },
  form: {
    backgroundColor: "#FFFFFF",
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: '5%',
  },
  inputs: {
      width: '100%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '10%',
  },  
  input: {
      width: '90%',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      paddingTop: 10,
      fontSize: 16, 
      minHeight: 40,
      color: 'black',
  },
  button: {
      width: '80%',
      backgroundColor: 'black',
      height: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '400'
  },
  buttonAlt: {
      width: '80%',
      height: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
  },
  buttonAltText: {
      color: 'black',
      fontSize: 16,
      fontWeight: '400',
  },
  message: {
      fontSize: 16,
      marginVertical: '5%',
  },
});

export default LoginScreen;