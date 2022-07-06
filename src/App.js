/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'
import React from 'react';
import { Provider } from 'react-redux';
import './Translations';
import axios from 'axios';

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import { TopHeader, Products  } from './Components';
import { AppNavigator } from './Screens';
import reactotron from 'reactotron-react-native';


const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });



// const Section = ({children, title}) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

const App = () => {
  return (
    <React.Fragment>
      <AppNavigator />
    </React.Fragment>
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
