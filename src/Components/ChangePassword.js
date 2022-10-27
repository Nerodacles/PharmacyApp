import React, {useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Button,
  StatusBar,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import Feather from 'react-native-vector-icons/Feather';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


const ChangePassword = ({navigation}) => {
    const [oldPasswd, setOldPasswd] = useState('');
    const [newPasswd, setNewPasswd] = useState('');
    const [confPasswd, setConfPasswd] = useState('');
    const {userToken}= useContext(AuthContext);
    
    axiosInstance.interceptors.request.use(
        config => {
          config.headers['authorization'] = userToken
          return config
        },
        error => {
          return Promise.reject(error)
        }
      )

  const onChangeOldPasswd = oldPasswd => {
    setOldPasswd(oldPasswd);
  };

  const onChangeNewPasswd = newPasswd => {
    setNewPasswd(newPasswd);
  };

  const onChangeConfPasswd = confPasswd => {
    setConfPasswd(confPasswd);
  };

  const changePasswd = async() => {
    if (newPasswd === confPasswd && oldPasswd != newPasswd){
        try{
            const response = await axiosInstance.patch('/users/changePassword', {
                oldPassword : oldPasswd,
                newPassword : newPasswd
            }) 
            if (response.status === 200) {
                navigation.navigate('Perfil')
            }
        } catch (error){
            console.log(error)
        }
    } if (oldPasswd === newPasswd){
            const error = new Error('No se puede poner la misma contraseña que la antigua');
            error.statusCode = 500;
            console.log(error)
    }
  }


  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Cambiar contraseña</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Contraseña anterior</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeOldPasswd}
            placeholder="Introduzca su contraseña anterior"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNewPasswd}
            placeholder="Introduzca su nueva contraseña"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeConfPasswd}
			
            placeholder="Introduzca su nueva contraseña nuevamente"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
		  disabled={oldPasswd == '' || newPasswd == '' || confPasswd == '' ? true : false}
          onPress={() => changePasswd()}>
          <Text style={styles.buttonText}> Aceptar </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#E2443B'}]}
          onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.buttonText}> Cancelar </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  container: {
    flex: 2,
    backgroundColor: '#FFF',
    // alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  textContainer: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    // textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
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
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginRight: -30,
    marginVertical: 25,
  },
  input: {
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    color: 'black',
  },
  button: {
    width: '30%',
    backgroundColor: '#4cc3eb',
    height: 40,
    marginRight: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
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

export default ChangePassword;
