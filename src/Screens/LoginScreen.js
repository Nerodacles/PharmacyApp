// In App.js in a new project

import React, { useState, useRef, useContext } from 'react';
import { View, Text, Button, StatusBar, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform, Alert, ToastAndroid } from 'react-native';
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
    const [phone, setPhone] = useState('');
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

    const onChangePhone = (phone) => {
        setPhone(phone);
    }

    const onChangePasswd = (password) => {
        setPassword(password);
    }

    const onChangeHandler = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setPassword('');
        setPhone('');
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
            phone
        }).then(res => {
            let userInfo = res.data;

            setUserInfo(userInfo);
            setUserToken(userInfo.token);
            onChangeHandler()
        })
        .catch((e) => {
            if (e.toJSON.status = 500){
                ToastAndroid.show('Usuario, correo y/o Contraseña invalido', ToastAndroid.LONG,)
            }
        })
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
                            autoCapitalize='none'
                            onChangeText={onChangeUsername}>
                        </TextInput>

                        {!isLogin && <TextInput 
                            value={phone} 
                            style={styles.input} 
                            placeholderTextColor="black"  
                            placeholder="Numero Telefonico"
                            keyboardType='phone-pad' 
                            autoCapitalize="none" 
                            onChangeText={onChangePhone}>
                        </TextInput>}

                        <TextInput 
                            value={password} 
                            secureTextEntry={true} 
                            style={styles.input} 
                            placeholderTextColor="black" 
                            autoCapitalize='none'
                            placeholder="Contraseña" 
                            onChangeText={onChangePasswd}>
                        </TextInput>
                        
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                        
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
        maxHeight: 500,
        paddingBottom: '30%',
        marginHorizontal: 20
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        // marginTop: '5%',
        justifyContent: 'center',
        height: '50%',
        marginBottom: '30%',
        color: 'black',
        textAlign: 'center'
    },
    form: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        paddingBottom: '5%',
    },
    inputs: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
    },  
    input: {
        width: '90%',
        borderWidth: 0.1,
        borderRadius: 15,
        padding: 10,
        textAlign: 'left',
        // borderBottomColor: 'black',
        margin: 5,
        fontSize: 16, 
        minHeight: 50,
        color: 'black',
    },
    button: {
        width: '80%',
        backgroundColor: '#4cc3eb',
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
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