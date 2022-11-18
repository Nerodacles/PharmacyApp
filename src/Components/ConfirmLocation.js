import React, {useState, useRef} from 'react';
import {
  View, Text, Button, StatusBar, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform, ToastAndroid, Alert,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';

import Feather from 'react-native-vector-icons/Feather';

const ConfirmLocation = ({route}) => {
  const [direccion, setDireccion] = useState('');
  const navigation = useNavigation()
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const { latitude, longitude } = route.params

  const onChangeDireccion = direccion => {
    setDireccion(direccion);
  };

  const onChangeCalle = calle => {
    setCalle(calle);
  };

  const onChangeNumero = numero => {
    setNumero(numero);
  };

  const onChangeReferencia = referencia => {
    setReferencia(referencia);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('UserLocation')}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirme su Ubicación</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Dirección</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeDireccion}
            placeholder="Barrio San Pablo, Edificio 4, Apartamento 3"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Calle</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCalle}
            placeholder="Calle Duarte"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Número de Casa/Apartamento</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumero}
			
            placeholder="No. 10"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>Referencia</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeReferencia}
            placeholder="Al lado de un colmado"
            placeholderTextColor={'#C0C0C0'}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
		  // disabled={calle == '' || direccion == '' || numero == '' || referencia == '' ? true : false}
          onPress={() => calle == '' || direccion == '' || numero == '' || referencia == '' ? ToastAndroid.show('Favor completar los campos faltantes', ToastAndroid.LONG,) : navigation.navigate('PaymentMethod', {latitude : latitude, longitude: longitude, direccion : direccion , calle : calle, numero: numero, referencia : referencia })}>
          <Text style={styles.buttonText}> Aceptar </Text>
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
    alignItems: 'flex-end',
    marginRight: 35,
    marginVertical: 25,
  },
  input: {
    height: 40,
    width: '90%',
    backgroundColor: 'rgba(225,225,225,0.3)',
    margin: 12,
    borderWidth: 0.4,
    borderRadius: 15,
    padding: 10,
    minHeight: 50,
    color: 'black',
  },
  button: {
    width: '50%',
    backgroundColor: '#4cc3eb',
    height: 40,
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

export default ConfirmLocation;
