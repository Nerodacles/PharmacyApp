import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState('');

  const login = (username, password) => {
    setIsLoading(true);
    try{
        axiosInstance.post(`users/login`, {
            username,
            password,
        })
        .then(res => {
          let userInfo = res.data;
          if (userInfo.token !== null || userInfo.token !== undefined){
            setUserInfo(userInfo);
            setUserToken(userInfo.token)
  
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('userToken', userInfo.token)
          }else{
            AsyncStorage.removeItem('userInfo')
            AsyncStorage.removeItem('userToken')
          }
          
        })
        // if (res.status === 200){
        //   

        //   AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
        //   AsyncStorage.setItem('userToken', userInfo.token)
        //   // onLoggedIn(res.data)
        //   setIsLoading(false);
        //   setUsername('');
        //   setPassword('');
        //   setEmail('');
        
    
    } catch (error){
        console.log(error)
        alert("Un error ha ocurrido");
        setIsLoading(false);
    }
  }

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userInfo')
    AsyncStorage.removeItem('userToken')
    setIsLoading(false);
  }

  const isLoggedIn = async({ navigation }) => {
    try{
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');

      console.log('adaddadsa', userToken)
      userInfo = JSON.parse(userInfo);

      if ( userInfo ) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }
      setIsLoading(false);
      navigation.navigate('Home2')
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