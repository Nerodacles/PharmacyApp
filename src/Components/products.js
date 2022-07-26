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
    RefreshControl
  } from 'react-native';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

// const Item = ({ item }) => (
//   <View>
//     <Text>hola mundo: {item}</Text>
//   </View>
// );

const Products = ({navigation}) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    axiosInstance.get('api/getAll/').then((result) => {
      setData(result.data)
    });
  }, []);

  const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      axiosInstance.get('api/getAll/').then((result) => {
        setData(result.data)
        setRefreshing(false)
      });
    })
  }, []);

    return (
        <SafeAreaView style={{flex: 3, backgroundColor: "#FFF"}}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
              <View style = {{flex: 1, margin:5}}>
                  {data ? <ProductsList key={data.id} data={data} /> : <Loading /> }
              </View>
            </ScrollView>
        </SafeAreaView>  
    );
}

export default Products;