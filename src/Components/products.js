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

const Item = ({ item }) => (
  <View>
    <Text>{item}</Text>
  </View>
);

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance.get('api/getAll').then((result) => {
      setData(result.data)
      // Alert.alert(response.data[1].name);
    });
  });
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );
  

    return (
        <SafeAreaView style={{flex: 3}}>
            <View>
                {data ? <ProductsList data={data} /> : <Loading /> }
            </View>
        </SafeAreaView>  
    );
}

export default Products;