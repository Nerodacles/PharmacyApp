import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

export const CartContext = createContext();

export const useCart = () =>{
    return useContext(CartContext)
}


export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([])

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const getItemQuantity = (id) => {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    const increaseCartQuantity = (id) => {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null) {
                return [...currItems, {id, quantity: 1}]
            }else {
                return currItems.map(item => {
                    if (item.id === id && item.quantity < 10) {
                        return { ...item, quantity: item.quantity + 1 }
                    }else {
                        return item
                    }
                })
            }
    })
    
    }

    const decreaseCartQuantity = (id) => {
        setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity == 1) {
                return currItems.filter(item => item.id !== id)
            }else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1}
                    }else {
                        return item
                    }
                })
            }
    })
    }

    const removeFromCart = (id) => {
        setCartItems(currItems =>{
            return currItems.filter(item => item.id !==id)
        })
    }


  return (
    <CartContext.Provider value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, setCartItems, cartQuantity}}>
      {children}
    </CartContext.Provider>
  )
}