import React, {useContext, useEffect, useState} from 'react';
import { View, Text, Pressable, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { CartContext } from '../context/CartContext';
import Feather from 'react-native-vector-icons/Feather'


const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


const ProductsList = ({ data }) =>{
  const navigation = useNavigation();
  const { getItemQuantity, increaseCartQuantity, cartItems, decreaseCartQuantity, removeFromCart } = useContext(CartContext)
  return (
    <View style={styles.container}>
      {data.map((item) => {
        const quantity = getItemQuantity(item.id)
        return(<View key={item.id}>
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
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textPrice}>RD${item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.column}>
                    {quantity=== 0 ?(
                      cartItems.length < 3 ? 
                      (
                      <TouchableOpacity style={styles.btn} onPress={() => increaseCartQuantity(item.id)}>
                        <Text style={styles.btnText}>+ Añadir al Carrito</Text>
                      </TouchableOpacity>
                      )
                    :
                    (
                    <TouchableOpacity disabled={true} style={[styles.btn, {opacity: 0.6}]} onPress={() => increaseCartQuantity(item.id)}>
                      <Text style={styles.btnText}>+ Añadir al Carrito</Text>
                    </TouchableOpacity>
                    )
                      
                    ): (
                      <View style={styles.cartView}>
                        <View style={styles.row}>
                          <TouchableOpacity style={styles.btnInc} onPress={() => decreaseCartQuantity(item.id)}>
                            <Feather name='minus' color="#000" size={25} />
                          </TouchableOpacity>
                          <Text style={styles.textPrice}>{quantity} en el carrito</Text>
                          {quantity <10 && 
                          <TouchableOpacity style={styles.btnInc} onPress={() => increaseCartQuantity(item.id)}>
                            <Feather name='plus' color="#000" size={25} />
                          </TouchableOpacity>}
                        </View>

                        <TouchableOpacity style={styles.btnDelete} onPress={() => removeFromCart(item.id)}>
                          <Text style={styles.btnText}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                </View>
          </Pressable>

        </View>)

      })}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      marginTop: 10,
      marginHorizontal: 2,
      justifyContent: "center",
    },
    textPrice: {
      color: 'black',
      fontSize: 20,
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
      width:200,
      paddingVertical:10,
      borderRadius:30,
      marginBottom: 5
    },
    btnText: {
      textAlign: 'center',
      color: '#000',
      fontSize: 15
    },
    btn:{
      backgroundColor: "#4cc3eb",
      paddingVertical:10,
      borderRadius:30,
      
    },
    btnInc:{
      backgroundColor: "#4cc3eb",
      borderRadius:30,
      width:40,
      alignItems: 'center'
    },
    column: {
      justifyContent: 'center',
      width:'100%'
    },
    row: {
      flexDirection: "row",
      width:'100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5
    },
    cartView:{
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    }
    // logBox: {
    //   padding: 20,
    //   margin: 10,
    //   borderWidth: StyleSheet.hairlineWidth,
    //   borderColor: '#f0f0f0',
    //   backgroundColor: '#FFF'
    // }
  });
  

export default ProductsList;

