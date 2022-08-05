import React, {useEffect, useState} from 'react';
import reactotron from 'reactotron-react-native';
import { Provider } from 'react-redux';
import { View, Text, Button, Pressable, Alert, StyleSheet,} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


const ProductsList = ({ data }) =>{
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id}>
          <Pressable 
            onPress={() => navigation.navigate('Info', {id: item.id, name: item.name})}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? 'rgb(210, 230, 255)'
                  : 'white'
              }, styles.wrapperCustom]}>
            <Text style={styles.text}>{item.name}</Text>
          </Pressable>
          <Divider />

        </View>

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
      justifyContent: "center",
    },
    text: {
      color: 'black',
      fontSize: 20,
      fontWeight: '400',
    },
    buttonAltText: {
      
    },
    wrapperCustom: {
      
      borderRadius: 8,
      padding: 6,
      margin: 4
    },
    logBox: {
      padding: 20,
      margin: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#f0f0f0',
      backgroundColor: '#FFF'
    }
  });
  

export default ProductsList;

