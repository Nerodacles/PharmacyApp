import { View, Text, ActivityIndicator } from 'react-native'
import React, {useContext} from 'react'
import AuthStack from './AuthStack'
import TabNavigator from './TabNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'

const AppNavigator = () => {
  const {isLoading, userToken} = useContext(AuthContext);

  if ( isLoading ){
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator animating={true} size="large" color="#0000ff" style={{opacity: 1}} />
    </View>
  } 
  return (
    <NavigationContainer>
      {userToken !== '' ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator
