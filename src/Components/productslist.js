import React, {useEffect, useState} from 'react';
import reactotron from 'reactotron-react-native';
import { Provider } from 'react-redux';
import { View, Text, Button, Pressable, Alert, StyleSheet} from 'react-native';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const getOne = (_id) => {
    axiosInstance.get(`api/getOne/${_id}`).then((response) => {
      Alert.alert(`Id: ${response.data._id} \nNombre: ${response.data.name}`);
    });
}

const ProductsList = ({ data }) =>{
    const [timesPressed, setTimesPressed] = useState(0);

    return (
        <View style={styles.container}>
            {data.map((item) => (
                <Pressable 
                    key={item._id}
                    onPress={() => getOne(item._id)}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                                ? 'black'
                                : 'rgb(130, 130, 130)'
                        },
                    styles.wrapperCustom
                    ]}>
                    <Text style={styles.text}>{item.name}</Text>
                </Pressable>

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
      fontSize: 16
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
      backgroundColor: '#f9f9f9'
    }
  });
  

export default ProductsList;

