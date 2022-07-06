import reactotron from 'reactotron-react-native';
import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import { Button, Alert, FlatList } from 'react-native';
import axios from 'axios';
import Loading from './loadingscreen';
import ProductsList from './productslist';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
  } from 'react-native';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

// const Item = ({ item }) => (
//   <View>
//     <Text>hola mundo: {item}</Text>
//   </View>
// );

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('api/getAll/').then((result) => {
      setData(result.data)
    });
  }, []);
  

    return (
        <SafeAreaView style={{flex: 3}}>
            <View>
              <Text>Hola</Text>
                {data ? <ProductsList key={data.id} data={data} /> : <Loading /> }
            </View>
        </SafeAreaView>  
    );
}

export default Products;