// In App.js in a new project

import React, {useState, useRef, useEffect, useContext} from 'react';
import {View, Text, Modal, Pressable,Image ,StyleSheet, ActivityIndicator, TouchableOpacity, ToastAndroid, TextInput} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';

import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import WebView from 'react-native-webview';
import {CartContext} from '../context/CartContext';
import {AuthContext} from '../context/AuthContext';
import reactotron from 'reactotron-react-native';

const axiosInstance = axios.create({baseURL: 'https://pharmacy.jmcv.codes/'});

const PaymentMethod = ({route}) => {
  const [paymentMet, setPaymentMet] = useState([
    {id: 1, name: 'Efectivo'},
    {id: 2, name: 'Paypal'},
  ]);
  const webviewRef = useRef();
  const [open, setOpen] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {userToken} = useContext(AuthContext);
  const [cantidad, setCantidad] = useState(0);
  const navigation = useNavigation();
  const [order, setOrder] = useState([]);
  const [paypalArr, setPaypalArr] = useState([]);
  const [metodo, setMetodo] = useState([]);
  const [link, setLink] = useState('');
  const {cartItems, cartQuantity, setCartItems} = useContext(CartContext);
  const [itemInCart, setItemInCart] = useState([])
  const [value, setValue] = useState([]);
  const {latitude, longitude, direccion, calle, numero, referencia} = route.params;
  const total = cartItems.reduce((total, cartItem) => {
    const item = itemInCart.find(item => item.id === cartItem.id)
    return (total + (item?.price || 0) * cartItem.quantity)
  }, 0)

  useEffect(() => {
    axiosInstance.get(`api/getAll`).then((response) => {
        setItemInCart(response.data)
        // setIsLoading(false)
    // const []
    })
  }, [])

  const CartItems = ({id, quantity}) => {
    const {removeFromCart} = useContext(CartContext)
    const item = itemInCart.find(item => item.id ===id)
    if(item == null) return null

    return (
      <View style={styles.wrapperCustom}>
        <View style={styles.cont2}>
          <View style={styles.column}>
            <Text style={styles.text}>{quantity > 1 && <Text> x{quantity} </Text>}{item.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.pxq}>RD${item.price*quantity}</Text>
          </View>
        </View>
      </View>
    )
  }

	axiosInstance.interceptors.request.use(
    config => { 
      config.headers['authorization'] = userToken 
      return config
		},
    error => { return Promise.reject(error) },
  );

  function onMessage(e) {
    let data = JSON.parse(e.nativeEvent.data)
    setShowGateway(false);
    webviewRef.current.postMessage(
      JSON.stringify({reply: 'reply'}), '*'
    )
    // if (payment.status === 'COMPLETED') {
    //   alert('PAYMENT MADE SUCCESSFULLY!');
    // } else {
    //   alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
    // }
  }
  const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)) }


  async function onPaypalSuccess(e) {
    if (e.url.includes('https://pharmacy.jmcv.codes/paypal/success')) {
      setShowGateway(false);
      const response = await axiosInstance.get(e.url)
      setPaypalArr(response.data)
      createOrder(response.data)
      setModalVisible(true);
    }
  }

  const onChangeCantidad = cantidad => {
    setCantidad(cantidad);
  };

  const createPaypalOrder = async () => {
    setShowGateway(true)
    const response = await axiosInstance.post('paypal', {items : cartItems } )
    setLink(response.data.link)
  }

  const createOrder = async (paypalArr) => {
    if (value === 'Efectivo'){
      if(cantidad < total){
        return(
          ToastAndroid.show('La cantidad ingresada es menor al total de los productos', ToastAndroid.LONG,)
        )
      }else{
      const response = await axiosInstance.post(`orders`, {
        drugs: cartItems,
  
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        
        payment: {
          paymentMethod: value,
          cash: cantidad,
        },
  
        moreDetails: {
          direction: direccion,
          street: calle,
          houseNumber: numero,
          reference: referencia,
        },
      });
      setOrder(response.data);
      }
    }if (value === 'Paypal'){
      const response = await axiosInstance.post(`orders`, {
        drugs: cartItems,
  
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        
        payment: {
          paymentMethod: value && 'paypal',
          paypal: paypalArr,
        },
  
        moreDetails: {
          direction: direccion,
          street: calle,
          houseNumber: numero,
          reference: referencia,
        },
      });
      setOrder(response.data);
    }
    setCartItems([])
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>

        <Text style={styles.title}>Resumen del Pedido</Text>
      </View>
      <View style={styles.centeredView}>
        { cartItems ? (
          <View style={styles.cont3}>
          <View style={{height: "auto", width:"100%"}}>
            <View style={{backgroundColor:"#0062da",justifyContent: 'center', height: "auto", paddingVertical: 10, margin:10, borderRadius:20, paddingHorizontal:20, shadowColor: "#000", shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.41, shadowRadius: 9.11, elevation: 14,}}>
            {cartItems.map(item => (
              <CartItems key={item.id} {...item} />
              ))}
            </View>
            <View style={[styles.totalCont]}>
              <Text style={[styles.totalText, {fontSize: 25}]}>
                Total
              </Text>
              <Text style={[styles.totalText]}>
                RD$ {total}
              </Text>
            </View>
              <View style={{backgroundColor:"#0062da", height: "auto" ,margin:10, paddingBottom: 10, borderRadius:20, paddingHorizontal:20, shadowColor: "#000", shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.41, shadowRadius: 9.11, elevation: 14,}}>
                <Text style={[styles.totalText, {fontSize: 20, color: '#FFF', marginHorizontal:0}]}>Direccion</Text>
                <Text numberOfLines={1} style={[styles.text, {fontSize:16, marginLeft: 5}]}>{direccion}</Text>
                <Text numberOfLines={1} style={[styles.text, {fontSize:16, marginLeft: 5}]}>{calle}</Text>
                <Text numberOfLines={1} style={[styles.text, {fontSize:16, marginLeft: 5}]}>{referencia}</Text>
                <Text numberOfLines={1} style={[styles.text, {fontSize:16, marginLeft: 5}]}>{numero}</Text>
              </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Metodo de Pago</Text>
            <DropDownPicker
              schema={{label: 'name', value: 'name'}}
              open={open}
              placeholder="Seleccione el metodo de pago"
              placeholderStyle={{
                color: '#9c9c9c',
                fontSize: 16, 
              }}
              items={paymentMet}
              value={value}
              setOpen={setOpen}
              setValue={setValue}
              theme="LIGHT"
              setItems={setPaymentMet}
              dropDownContainerStyle={{width: '90%', alignSelf: 'center'}}
              style={{ width: '90%', paddingTop: 10, fontSize: 10, minHeight: 50, color: 'black', alignSelf: 'center', borderRadius: 15, borderWidth: 1 }}
            />
            {value === 'Efectivo' ? (
              <View style={styles.textContainer}>
                <Text style={styles.text}>Cantidad</Text>
                <TextInput onChangeText={onChangeCantidad} value={cantidad.toString()} keyboardType="numeric" style={styles.input} />
              </View>
            ) :  null }
            <View style={styles.modalContainer}>
              <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                <View style={styles.centeredView2}>
                <View style={styles.modalView}>
                    <View style={{justifyContent: 'center', alignItems: 'center', width: 60, height: 60, marginBottom: 10}}>
                      <Image source={require('../assets/images/success.png')} style={{height: "100%", width: "100%"}} resizeMode='cover' />
                    </View>
                    <Text style={styles.modalText}>Tu pedido se ha procesado correctamente.</Text>
                    <View style={styles.contenedor}>
                        <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => (navigation.navigate('Home', { screen: 'Home2' }), setModalVisible(false))}>
                          <Text style={styles.textStyle}>Ir al Home</Text>
                        </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
          </View>
        </View>
        ) : null}
        { value === 'Paypal' ? (
          <View>
            {/* <TouchableOpacity
              style={styles.btn}
              onPress={() => createPaypalOrder()}>
                <Text style={styles.btnTxt}>Pay Using PayPal</Text>
            </TouchableOpacity> */}
            {showGateway ? (
            <Modal
              visible={showGateway}
              onDismiss={() => setShowGateway(false)}
              onRequestClose={() => setShowGateway(false)}
              animationType={"fade"}
              transparent>
              <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                  <TouchableOpacity
                    style={{padding: 13}}
                    onPress={() => setShowGateway(false)}>
                    <Feather name={'x'} size={24} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>
                    PayPal GateWay
                  </Text>
                  <View style={{padding: 13}}>
                    <ActivityIndicator size={24} color={'#fff'} />
                  </View>
                </View>
                <WebView
                  ref={webviewRef}
                  canGoForward={true}
                  source={{ uri: `${link}` }}
                  onNavigationStateChange={data => onPaypalSuccess(data) }
                  domStorageEnabled
                  javaScriptEnabled
                  onMessage={data => onMessage(data)}
                  style={{flex: 1}}
                />
              </View>
            </Modal>
          ) : null}
          </View>
        ): null }
      </View>
      <View style={styles.buttonContainer}>
      { value === 'Paypal' ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => createPaypalOrder()}>
              <Text style={styles.btnTxt}>Pagar con Paypal</Text>
          </TouchableOpacity>)
          :
        (<TouchableOpacity
          style={styles.button}
          onPress={() => value == [] || metodo == [] ? ToastAndroid.show('Favor completar los campos faltantes', ToastAndroid.LONG,) : (createOrder(), setModalVisible(true) )}>
          <Text style={styles.buttonText}> Aceptar </Text>
        </TouchableOpacity>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: 25,
    marginLeft: '5%',
    fontWeight: 'bold',
    // marginBottom: '10%',
    color: 'black',
    textAlign: 'center',
  },
  video: {
    // marginTop: 20,
    // maxHeight: 711,
    // width: 511,
    flex: 1,
  },
  input: {
    width: '90%',
    paddingTop: 10,
    // marginHorizontal: 10,
    fontSize: 20,
    minHeight: 50,
    color: 'black',
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
  },
  centeredView: {
    width: '100%',
    height: '80%',
    flex: 2,
    marginTop: 10,
  },
  textContainer: {
    // height: "20%",
    margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  // text: {
  //   color: '#000',
  //   // textAlign: 'left',
  //   alignSelf: 'flex-start',
  //   fontSize: 20,
  //   marginLeft: 30,
  // },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginRight: 35,
    marginVertical: 25,
  },
  btnCon: {
    height: 45,
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 1,
    backgroundColor: '#00457C',
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
  },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0062da',
    zIndex: 25,
    elevation: 2,
  },
  button: {
    width: '50%',
    backgroundColor: '#4cc3eb',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlignVertical: 'center',
    fontWeight: '400',
    marginLeft: 5,
    // width:'60%',
  },
  pxq: {
      fontSize: 16,
      color: 'white',
      textAlignVertical: 'center',
      marginHorizontal: 10,
    },
cont2: {
    flexDirection: "row",
    width: '100%',
    borderRadius: 5,
    padding: 4,
    marginHorizontal: 5,
    // backgroundColor: 'red'
  },
  cont3: {
    // flex: 2,
    borderRadius: 8,
    paddingVertical:3,
    alignItems:"center",
    height: '53%',
    // justifyContent: 'center',
  },
column: {
    // alignItems:"center",
    justifyContent: 'center',
    width: '75%',
  },
row: {
    // flexDirection: "row",
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    width: '30%',
  },
wrapperCustom: {
    // flexDirection: "row",
    // backgroundColor: 'white',
    alignSelf: 'center',
    width: '95%',
    borderRadius: 5,
    padding: 2,
    marginVertical: 3,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,

    // elevation: 3,
  },
  totalText: {
    // width:'60%',
    marginHorizontal: 10,
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'black',
    justifyContent: 'center'
  },
  totalCont: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    width: '50%',
    // alignItems:'center', flex: 1, justifyContent: 'flex-end', width: "100%", height: "98%", margin: 10, position: 'absolute',
    justifyContent: 'center',
  },
  centeredView2: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: '100%',
    height:'80%',
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 60,
    padding: 35,
    position:'absolute',
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  buttonOpen: {
    backgroundColor: "#4cc3eb",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  buttonClose: {
    backgroundColor: "#E2443B",
    fontSize: 50,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 25,
    // fontWeight: 'bold',
    color: 'black'
  },
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default PaymentMethod;
