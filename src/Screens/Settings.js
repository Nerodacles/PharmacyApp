// In App.js in a new project

import React, { useState, useRef } from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

function Settings() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isLogin, setIsLogin] = useState(true);


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
  const onLoggedIn = (datos) => {
    Alert.alert(
        "Inicio de sesión exitoso",
        `Has iniciado sesion como: ${datos.username} con el rol de ${datos.role}`,
        [
            {
                text: "Cancelar",
                onPress: () => console.log(`Boton "Cancelar" pulsado`),
                style: "cancel"
            },
            {
                text: "Aceptar",
                onPress: () => console.log(`Boton "Aceptar" pulsado`)
            }
        ]
    )
    // axiosInstance.get(`users/${id}`).then(async res => { 
    //     try {
    //       if (res.status === 200) {
    //         console.log(res.data);
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     };
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  const onSubmit = async (event) => {
    if (!username.trim() || !password.trim() || (!isLogin && !email.trim())){
        alert("Usuario, correo o contraseña invalido");
        return;
    }
    setIsLoading(true);
    try{
        const res = await axiosInstance.post(`users/${isLogin ? 'login' : 'register'}`, {
            username,
            email,
            password,
        });
        if (res.status === 200){
            onLoggedIn(res.data)
            setIsLoading(false);
            setUsername('');
            setPassword('');
            setEmail('');
        }
    
    } catch (error){
        console.log(error)
        alert("Un error ha ocurrido");
        setIsLoading(false);
    }
  }
  
  const getMessage = () => {
  }

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text style={{color:'black'}}>Settings!</Text>
    // </View>
    // <ImageBackground source={} style={styles.image}>
            <View style={styles.card}>
                <Text style={styles.heading}>{isLogin ? 'Login' : 'Sign up'}</Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        {!isLogin && <TextInput value={email} style={styles.input} placeholderTextColor="black"  placeholder="Correo" autoCapitalize="none" onChangeText={onChangeEmail}></TextInput>}
                        <TextInput value={username} style={styles.input} placeholderTextColor="black" placeholder="Usuario" onChangeText={onChangeUsername}></TextInput>
                        <TextInput value={password} secureTextEntry={true} style={styles.input} placeholderTextColor="black" placeholder="Contraseña" onChangeText={onChangePasswd}></TextInput>
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                        <TouchableOpacity style={styles.button} onPress={onSubmit}>
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                            <Text style={styles.buttonAltText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
        // </ImageBackground>
  ) 
}

const styles = StyleSheet.create({
//   image: {
//       flex: 1,
//       width: '100%',
//       alignItems: 'center',
//   },  
  card: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
      borderWidth: 1,
      height: 40,
      borderRadius: 50,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
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

export default Settings;