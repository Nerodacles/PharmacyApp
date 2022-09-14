import { View, Text, ActivityIndicator, StatusBar } from 'react-native'
import React, {useContext} from 'react'
import AuthStack from './AuthStack'
import TabNavigator from './TabNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'

const AppNavigator = () => {
  const {isLoading, userToken} = useContext(AuthContext);

  if ( isLoading ){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#FFF'}}>
      <ActivityIndicator size="large" color="#4cc3eb" style={{opacity: 1}} />
    </View>)
  } 
  return (
    <NavigationContainer>
      <StatusBar backgroundColor= '#FFF' barStyle='dark-content'/>
      {( userToken !== null && userToken !== undefined && userToken !== '') ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator
