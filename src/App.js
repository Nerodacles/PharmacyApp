/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'
import React from 'react';
import { Provider } from 'react-redux'
import './Translations';

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import { TopHeader } from './Components';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <React.Fragment>
      <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TopHeader />
        <View
          style={{
            // backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          
          {/* <Section>Test MongoDB Connection: {client.collection}</Section> */}
        </View>
      </ScrollView>
      <Section title="PharmacyApp">
        <Text>Edit </Text> MongoDB app.
      </Section>
    </SafeAreaView>
    <SafeAreaView style={{flex: 3, backgroundStyle}}>
      <View>
        <Text style={styles.highlight}>
          Hola Mundo Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra ultricies quam, a pharetra sem blandit a. Vivamus rhoncus nisi quis tempus feugiat. Cras vulputate, eros quis hendrerit posuere, sem urna fringilla lacus, sit amet commodo nisi augue vel magna. Etiam mollis arcu neque, vitae porta sapien finibus quis. Nulla ac nisl vitae nisl suscipit pretium. Proin eleifend euismod magna et viverra. Ut id dolor at felis finibus condimentum eu tincidunt nibh.
          { '\n \n' } Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur rutrum magna nibh, sed molestie ipsum mattis non. Sed luctus justo luctus nisl interdum, id laoreet arcu rhoncus. Nam posuere justo diam, vitae facilisis felis suscipit vehicula. Proin nec faucibus ipsum. Mauris facilisis, enim sed tincidunt venenatis, erat dolor dapibus est, quis vehicula lacus nulla ac turpis. Ut mi nisl, feugiat id vulputate in, fermentum vitae nibh. Donec porta ultricies congue. Etiam id eros nec nunc iaculis porttitor. Cras eu diam rutrum, sagittis tellus a, euismod lorem. Praesent orci turpis, consectetur vel nisi eget, egestas vestibulum purus. Praesent sollicitudin vulputate ipsum, eget commodo dui ultricies in. Quisque lobortis augue diam, a consequat sapien convallis sed.
        </Text>
      </View>
    </SafeAreaView>  
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
    margin: 5,
  },
});

export default App;
