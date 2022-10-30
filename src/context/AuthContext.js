import React, {createContext, useState, useEffect} from 'react';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState('');

  const login = (username, password) => {
    if (!username.trim() || !password.trim()){
      alert("Usuario, correo o contraseña invalido");
      return;
    } else {
      setIsLoading(true)
      try{
        axiosInstance.post(`users/login`, {
          username,
          password,
        })
        .then(res => {
          let userInfo = res.data;
          console.log(userInfo)
          if (userInfo.token !== null || userInfo.token !== undefined){
            if (!userInfo.status){
              setIsLoading(false);
              alert('Usuario no activo.\nContacte al administrador');
              return
            }
            setIsLoading(true);
            setUserInfo(userInfo);
            setUserToken(userInfo.token)

            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('userToken', userInfo.token)
            setIsLoading(false)
          } else{
            AsyncStorage.removeItem('userInfo')
            AsyncStorage.removeItem('userToken')
          }
          }).catch(
            function (error) {
              if (error.toJSON.status = 400){
                alert('Usuario y/o Contraseña incorrecta')
              }
              setIsLoading(false)
            }
          )
      } catch (error){
          console.log(error.toJSON())
          alert("Un error ha ocurrido");
          setIsLoading(false);
      }
    }
  }
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userInfo')
    AsyncStorage.removeItem('userToken')
    setIsLoading(false);
  }
  const isLoggedIn = async() => {
    try{
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');

      userInfo = JSON.parse(userInfo);

      if ( userInfo ) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }
      setIsLoading(false);
    } catch(e) {
      console.log(`isLoggedIn in error ${e}`);
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, []);
    
  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
      {children}
    </AuthContext.Provider>
  )
}