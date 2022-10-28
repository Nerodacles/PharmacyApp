// In App.js in a new project

import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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
    {id: 2, name: 'Paypal/Tarjeta de Credito'},
  ]);
  const webviewRef = useRef();
  const [open, setOpen] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const {userToken} = useContext(AuthContext);
  const [cantidad, setCantidad] = useState(0);
  const navigation = useNavigation();
  const [order, setOrder] = useState([]);
  const [metodo, setMetodo] = useState([]);
  const [link, setLink] = useState('');
  const {cartItems, cartQuantity, setCartItems} = useContext(CartContext);
  const [value, setValue] = useState([]);
  const {latitude, longitude, direccion, calle, numero, referencia} = route.params;

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
    console.log(e)
    // if (payment.status === 'COMPLETED') {
    //   alert('PAYMENT MADE SUCCESSFULLY!');
    // } else {
    //   alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
    // }
  }

  async function onPaypalSuccess(e) {
    if (e.url.includes('https://pharmacy.jmcv.codes/paypal/success')) {
      setShowGateway(false);
      const response = await axiosInstance.get(e.url)
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

  const createOrder = async () => {
    const response = await axiosInstance.post(`orders`, {
      drugs: cartItems,

      location: {
        latitude: latitude,
        longitude: longitude,
      },
      
      payment: {
        paymentMethod: value,
        cash: value === 'Efectivo' ? cantidad : null,
        paypal: value === 'Paypal/Tarjeta de Credito' ? cantidad : null,
      },

      moreDetails: {
        direction: direccion,
        street: calle,
        houseNumber: numero,
        reference: referencia,
      },
    });
    setOrder(response.data);

    setCartItems([])
    navigation.navigate('Home', { screen: 'Home2' })
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#000" size={25} />
        </TouchableOpacity>

        <Text style={styles.title}>Método de Pago</Text>
      </View>
      <View style={styles.centeredView}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Metodo de Pago</Text>
          <DropDownPicker
            schema={{label: 'name', value: 'name'}}
            open={open}
            items={paymentMet}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
            theme="LIGHT"
            setItems={setPaymentMet}
            dropDownContainerStyle={{width: '90%', alignSelf: 'center'}}
            style={{
              width: '90%',
              paddingTop: 10,
              fontSize: 10,
              minHeight: 50,
              color: 'black',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
            }}
          />
        </View>
        {value === 'Efectivo' ? (
          <View style={styles.textContainer}>
            <Text style={styles.text}>Cantidad</Text>
            <TextInput
              onChangeText={onChangeCantidad}
              value={cantidad.toString()}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        ) :  null }
        { value === 'Paypal/Tarjeta de Credito' ? (
          <View style={styles.btnCon}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => createPaypalOrder()}>
                <Text style={styles.btnTxt}>Pay Using PayPal</Text>
            </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.button}
          // disabled={value == '' || metodo =='' ? true : false}
          onPress={() => createOrder()}>
          <Text style={styles.buttonText}> Aceptar </Text>
        </TouchableOpacity>
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
    flex: 1,
    marginTop: 30,
  },
  textContainer: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    // textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 20,
    marginLeft: 30,
  },
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
});

export default PaymentMethod;
