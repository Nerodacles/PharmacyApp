import React, {useEffect, useState} from 'react';
import reactotron from 'reactotron-react-native';
import { Provider } from 'react-redux';
import { View, Text, Button, Pressable, Alert, StyleSheet} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


const ProductsList = ({ data }) =>{
    const [timesPressed, setTimesPressed] = useState(0);
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {data.map((item) => (
                <Pressable 
                    key={item.id}
                    onPress={() => navigation.navigate('Info', {id: item.id, name: item.name})}
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

