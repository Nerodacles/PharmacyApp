import React, {useEffect, useState} from 'react';
import { View, Text, Pressable, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
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
                <View style={styles.cover}>
                  <Image source={{uri : `https://${item.cover}`}} style={styles.image}/>
                </View>
              <Text style={styles.text}>{item.name}</Text>
          </Pressable>

        </View>

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      marginTop: 10,
      marginHorizontal: 2,
      justifyContent: "center",
    },
    text: {
      color: 'black',
      fontSize: 20,
      fontWeight: '400',
      textAlignVertical: "center",
      marginLeft: 5,
    },
    cover:{
      height:70,
      width:70,
      margin: 5,
    },
    image:{
      width: "100%",
      height:"100%",
      resizeMode: "cover"
    },
    buttonAltText: {
      
    },
    wrapperCustom: {
      flexDirection: "row",
      borderRadius: 5,
      padding: 4,
      marginVertical: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    // logBox: {
    //   padding: 20,
    //   margin: 10,
    //   borderWidth: StyleSheet.hairlineWidth,
    //   borderColor: '#f0f0f0',
    //   backgroundColor: '#FFF'
    // }
  });
  

export default ProductsList;

