import { View, Text, ActivityIndicator, StatusBar } from 'react-native'
import React, {useContext, useState} from 'react'
import AuthStack from './AuthStack'
import TabNavigator from './TabNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { createNavigationContainerRef } from "@react-navigation/native"


const ref = createNavigationContainerRef();

const AppNavigator = () => {
  const {isLoading, userToken} = useContext(AuthContext);
  const [routeName, setRouteName] = useState()

  if ( isLoading ){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#FFF'}}>
      <ActivityIndicator size="large" color="#4cc3eb" style={{opacity: 1}} />
    </View>)
  } 
  return (
    <NavigationContainer
      ref={ref}
      onReady={() => {
        setRouteName(ref.getCurrentRoute().name)
      }}
      onStateChange={async () => {
        const previousRouteName = routeName;
        const currentRouteName = ref.getCurrentRoute().name;
        setRouteName(currentRouteName);
      }}
    >
      <StatusBar backgroundColor= '#FFF' barStyle='dark-content'/>
      {( userToken !== null && userToken !== undefined && userToken !== '') ? <TabNavigator routeName={routeName} /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator
