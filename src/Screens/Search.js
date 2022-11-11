// In App.js in a new project

import React, { useState, useEffect, useContext} from 'react';
import { View, Text, Button, StatusBar, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
import Cart from 'react-native-vector-icons/MaterialCommunityIcons'
// import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import DropDownPicker from 'react-native-dropdown-picker';

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
  const { getItemQuantity, increaseCartQuantity, cartItems, decreaseCartQuantity, removeFromCart } = useContext(CartContext)

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
        <View style={{width: '100%', justifyContent:'center', }}>
          {!isChanged ?
          (<DropDownPicker
            schema={{
              label: 'name',
              value: 'name'
            }}
            searchable={true}
            searchContainerStyle={{
              height: 45,
              borderBottomColor: '#FFF'
            }}
            searchTextInputStyle={{
              borderWidth: 0
            }}
            multiple={true}
            placeholderStyle={{
              color: '#9c9c9c',
              fontSize: 16, 
            }}
            placeholder='Seleccione un Síntoma'
            searchPlaceholder="Escriba un sintoma..."
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
            dropDownContainerStyle={{width:'70%', marginHorizontal: 10}}
            style={{
              width:'65%',
              paddingTop: 10,
              marginHorizontal: 10,
              borderRadius:10,
              fontSize: 16, 
              height: 50,
              color: 'black',
              fontSize: 16, 
              borderRightWidth: 1,
              borderBottomRightRadius:0,
              borderTopRightRadius:0
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
                <Icon name='search' size={35} color={'#000'} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onChange} style={[styles.btn, {borderBottomLeftRadius:0, borderTopLeftRadius:0,borderRadius:10, borderColor:"#000", borderWidth:1, borderLeftWidth:0 , height:50, width:70, backgroundColor: '#FFF'}]}>
                <Text style={styles.btnText}>{!isChanged ? 'Por Síntoma' : 'Por Nombre'}</Text>
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
          {const quantity = getItemQuantity(item.id)
            return(
            <View>
            <Pressable 
              onPress={() => navigation.navigate('Info', {id: item.id, name: item.name})}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                }]}>
                  <View style={styles.wrapperCustom}>
                    <View style={styles.row}>
                      <View style={styles.cover}>
                        <Image source={{uri : `https://${item.cover}`}} style={styles.image}/>
                      </View>
                      <View style={styles.rowSpace}>
                        <View style={styles.column}>
                          <View style={[styles.row, {justifyContent: 'space-between'}]}>
                            <Text style={styles.textName}>{item.name}</Text>
                            <Text style={styles.textPrice}>RD${item.price}</Text>
                          </View>
                          <View style={styles.column}>
                            {quantity=== 0 ?(
                              (
                              <TouchableOpacity style={styles.btn} onPress={() => increaseCartQuantity(item.id)}>
                                <Cart name='cart-plus' size={27} />
                              </TouchableOpacity>
                              )
                              
                            ): (
                              <View style={styles.cartView}>
                                <View style={[styles.row, {justifyContent: 'flex-end'}]}>
                                  <TouchableOpacity style={styles.btnInc} onPress={() => decreaseCartQuantity(item.id)}>
                                    <Feather name='minus' color="#000" size={30} />
                                  </TouchableOpacity>
                                  <Text style={[styles.textPrice, {fontSize: 25}, quantity===10 && {marginRight: 44}]}>{quantity}</Text>
                                  {quantity <10 && 
                                  <TouchableOpacity style={styles.btnInc} onPress={() => increaseCartQuantity(item.id)}>
                                    <Feather name='plus' color="#000" size={30} />
                                  </TouchableOpacity>}
                                  <TouchableOpacity style={styles.btnDelete} onPress={() => removeFromCart(item.id)}>
                                    <Feather name='x' color="#FFF" size={26} />
                                  </TouchableOpacity>
                                </View>

                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>

                  </View>
            </Pressable>
            </View>)

          
            // <Pressable 
            //   onPress={() => navigation.navigate('Info', {id: item.id})}
            //   style={({ pressed }) => [
            //     {
            //       backgroundColor: pressed
            //         ? 'rgb(210, 230, 255)'
            //         : 'white'
            //     }, styles.cont2]}>
            //   <View style={styles.cover}>
            //     {/* {console.log(item.id)} */}
            //     <Image source={{uri: `https://${item.cover}`}} style={styles.image} />
            //   </View>
            //   <Text style={styles.text}>{item.name} </Text>
            // </Pressable>
          }}
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
    width: '100%',
    justifyContent:'center',
  },
  // btn:{
  //   backgroundColor: "#4cc3eb",
  //   paddingHorizontal:5,
  //   paddingVertical:5,
  //   borderRadius:30,
  //   width: '65%',
  // },
  searchbtn:{
    borderWidth:1,
    borderRightWidth:0,
    paddingHorizontal:10,
    alignItems:'center',
    justifyContent:'center',
    // height: "100%",
    // paddingVertical:5,
    marginLeft: -11,
    // width: '35%',
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
    borderBottomRightRadius:0,
    borderTopRightRadius:0,
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
    width:'65%',
    paddingTop: 10,
    marginHorizontal: 10,
    fontSize: 16, 
    height: 50,
    // paddingTop: 10,
    // // marginLeft: '5%',
    // fontSize: 16, 
    // minHeight: 40,
    // color: 'black',
    },
  buttons:{
    flexDirection: 'row',
    marginLeft: '-30%',
    flex:1,
    // alignItems: 'center',
    // width: '30%',
    height: '100%'

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
  },
  textPrice: {
    color: 'black',
    fontSize: 22,
    fontWeight: '400',
    textAlignVertical: "center",
    marginHorizontal: 10,
  },
  textName: {
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
  wrapperCustom: {
    flexDirection: "column",
    backgroundColor: '#fff',
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
  rowSpace:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%'
  },
  btnDelete:{
    backgroundColor: "#E2443B",
    width:50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:5,
    borderRadius:30,
    marginHorizontal: 10
  },
  btnText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 15
  },
  btn:{
    backgroundColor: "#4cc3eb",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:5,
    borderRadius:30,
    marginRight: 5,
    alignSelf: 'flex-end',
    width: 80,
    
  },
  btnInc:{
    backgroundColor: "#4cc3eb",
    borderRadius:30,
    width:40,
    alignItems: 'center'
  },
  column: {
    // justifyContent: 'center',
    width:'100%'
  },
  row: {
    flexDirection: "row",
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 5
  },
  cartView:{
    // flex:1,
    // alignItems: 'flex-end',
    // justifyContent: 'center'
  }
});

export default Search;