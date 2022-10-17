// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { View, Text, Button, StatusBar, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
// import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import DropDownPicker from 'react-native-dropdown-picker';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const Search = ({navigation}) => {
  const {userToken}= useContext(AuthContext);
  const [isChanged, setIsChanged] = useState(true);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [value, setValue] = useState([])
  const [defaultTags, setDefaultTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const [open, setOpen] = useState(false);

  const [producto, setProductos] = useState([]);

  const onChangeSearchbyName = (name) => {
    setName(name);
  }

  const onChangeSearchbyTags = (tags) => {
    setTags('')
    setTags(oldArray => [...oldArray, tags])
  }

  const onSelectedTagsChange = (selectedTags) =>{
    setSelectedTags(selectedTags)
  }


  const onChange = () => {
    setIsChanged(!isChanged);
    setProductos([])
    setErrorMessage('')
    setValue([])
    setName('')
  }

  axiosInstance.interceptors.request.use(
    config => {
      config.headers['authorization'] = userToken
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  useEffect(() =>{
    axiosInstance.get('tags').then((result) => {
      setDefaultTags(result.data)
    });
  }, [])
  
  const emptyData = () =>{
    return (<View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40%'
      }}>
        <Text style={{
          textAlign: 'center',
          marginHorizontal: 10,
          fontSize: 40,
          color:"#808080"
        }}>
          {errorMessage.toString()}
        </Text>
      </View>)
  }

    const onSearchbyName = async() =>{
        setProductos([])
        setErrorMessage('')
        if (!name){
          const error = new Error('No hay datos en el campo de búsqueda');
          error.statusCode = 500;
          setErrorMessage(error)
          // return <Text style={{fontSize: 100, color: '#000'}}>HAOFOFKOASKFAO</Text>

        }else{
          axiosInstance.post(`search`, {name: name}).then(response =>{
            setProductos(response.data)
          }).catch(function (error) {
            console.log(error)
            if (error == 'AxiosError: Request failed with status code 500'){
              setErrorMessage('No se encontraron productos')
            }
          })
        }
        }
      

      const onSearchbyTags = async() =>{
        setProductos([])
        setOpen(false)
        setErrorMessage('')
        if(value.length === 0){
          const error = new Error('No hay datos seleccionado');
          error.statusCode = 500;
          setErrorMessage(error)
        }else{
          axiosInstance.post(`search/tags`, {tags : value}).then(response => {
            setProductos(response.data)
          }).catch(function (error) {
            console.log(error.status)
            if (error == 'AxiosError: Request failed with status code 500'){
              setErrorMessage('No se encontraron productos')
            }
          })
        }
      }
    

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Producto</Text>
      </View>

      <View style={styles.cont3}>
        <View style={{width: '100%'}}>
          {!isChanged ?
          (<DropDownPicker
            schema={{
              label: 'name',
              value: 'name'
            }}
            multiple={true}
            placeholderStyle={{
              color: '#9c9c9c',
              fontSize: 16, 
            }}
            placeholder='Escribe un Síntoma'
            mode='BADGE'
            min={0}
            max={5}
            open={open}
            value={value}
            items={defaultTags}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setDefaultTags}
            theme="LIGHT"
            badgeTextStyle={{color: '#fff'}}
            badgeColors={['grey']}
            badgeDotColors={['#4cc3eb']}
            dropDownContainerStyle={{width:'65%', marginHorizontal: 10}}
            style={{
              width:'65%',
              paddingTop: 10,
              marginHorizontal: 10,
              fontSize: 16, 
              minHeight: 40,
              color: 'black',
              fontSize: 16, 
            }}
          />) : 
          (<TextInput 
              value={name} 
              style={styles.input} 
              placeholderTextColor="#9c9c9c" 
              placeholder='Escribe el nombre del Producto'
              onChangeText={isChanged ?  onChangeSearchbyName : onChangeSearchbyTags }>
          </TextInput> )
        }  
        </View>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={isChanged ? onSearchbyName : onSearchbyTags} style={styles.searchbtn}>
                <Icon name='search' size={25} color={'#4cc3eb'} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onChange} style={styles.btn}>
                <Text style={styles.btnText}>{isChanged ? 'Por Síntoma' : 'Por Nombre'}</Text>
            </TouchableOpacity>
          </View>  
      </View>
      {/* {console.log(producto)} */}

        <FlatList 
          data={producto}
          numColumns={1}
          style={styles.cont}
          ListEmptyComponent={emptyData}
          renderItem={({item: item}) => 
            <Pressable 
              onPress={() => navigation.navigate('Info', {id: item.id})}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                }, styles.cont2]}>
              <View style={styles.cover}>
                {/* {console.log(item.id)} */}
                <Image source={{uri: `https://${item.cover}`}} style={styles.image} />
              </View>
              <Text style={styles.text}>{item.name} </Text>
            </Pressable>} 
        />
        

    
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    width:"100%",
    paddingHorizontal:20,
    paddingTop:15,
  },
  backbtn: {
    width:'5%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  title: {
    width:'90%',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '10%',
    marginLeft: -5,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    // width:'60%',
    color: 'black',
    textAlignVertical: 'center',
    marginLeft: 15,
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
  cont: {
    flex: 1,
    borderRadius: 5,
    margin: 5,
  },
  cont2: {
    flexDirection: "row",
    width:'100%',
    borderRadius: 5,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  cont3: {
    flexDirection: "row",
    // flexWrap: 'wrap',
    // paddingVertical:5,
    // margin: 5,
    alignItems:"center",
    width: '95%',
    justifyContent:'center',
  },
  btn:{
    backgroundColor: "#4cc3eb",
    paddingHorizontal:5,
    paddingVertical:5,
    borderRadius:30,
    width: '65%',
  },
  searchbtn:{
    paddingHorizontal:10,
    // paddingVertical:5,
    borderRadius:30,
    width: '35%',
  },
  btnText:{
    fontSize:15,
    color:"#FFF"
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
    width:'65%',
    paddingTop: 10,
    marginHorizontal: 10,
    fontSize: 16, 
    minHeight: 40,
    // paddingTop: 10,
    // // marginLeft: '5%',
    // fontSize: 16, 
    // minHeight: 40,
    // color: 'black',
    },
  buttons:{
    flexDirection: 'row',
    marginLeft: '-30%',
    alignItems: 'center',
    width: '30%',

  },
  resultsEmpty:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-40%'
  },
  textresultsEmpty:{
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: 25,
    color:"#808080"
  }
});

export default Search;