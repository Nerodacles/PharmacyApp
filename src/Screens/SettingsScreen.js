// In App.js in a new project

import React, { useState, useRef } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import Icon from 'react-native-vector-icons/Ionicons'

// const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(!modalVisible) }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Desea aceptar la orden?</Text>
            <View style={styles.contenedor}>
              <Pressable style={[styles.button, styles.buttonOpen]}>
                <Text style={styles.textStyle}>Aceptar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)} >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '5%',
    marginBottom: '30%',
    color: 'black',
    textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 60,
    padding: 35,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    borderRadius: 40,
    padding: 20,
    margin: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#4cc3eb",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  buttonClose: {
    backgroundColor: "#E2443B",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'black'
  },
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default SettingsScreen;