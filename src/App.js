/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'
import React from 'react';
import './Translations';
import axios from 'axios';
import { StyleSheet } from 'react-native';

import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './Navigation';

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}



const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });


const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  // sectionContainer: {
  //   marginTop: 32,
  //   paddingHorizontal: 24,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  //   margin: 5,
  // },
});

export default App;