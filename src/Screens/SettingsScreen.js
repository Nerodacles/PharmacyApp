// In App.js in a new project

import React, { useState, useRef } from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import Icon from 'react-native-vector-icons/Ionicons'

// const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const SettingsScreen = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.form}>
        <Text style={{color: 'black'}}>{<Icon name='home-outline'/>} </Text>
      </View>
    </View>
  ) 
}

const styles = StyleSheet.create({
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

export default SettingsScreen;