import reactotron from 'reactotron-react-native';
import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import Loading from './loadingscreen';
import ProductsList from './productslist';
import {
  SafeAreaView,
  ScrollView,
  View,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text
  } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

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
              <StatusBar backgroundColor= '#FFF' barStyle='dark-content'/>
              <View style = {{flex: 1, margin:5}}>
                <View style={style.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" color="#000" size={25} />
                  </TouchableOpacity>
                  <Text style={style.title}>Productos</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <Feather name="search" color="#000" size={25} /> 
                  </TouchableOpacity>
                </View>
                  {data ? <ProductsList key={data.id} data={data} /> : <Loading /> }
              </View>
            </ScrollView>
        </SafeAreaView>  
    );

}

const style = StyleSheet.create({
  header:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center'
  },
})
export default Products;