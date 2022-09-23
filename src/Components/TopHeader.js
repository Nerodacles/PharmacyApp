 import React from 'react';
 import {ImageBackground, StyleSheet, Text} from 'react-native';

 
const TopHeader = () => {
    // // const isDarkMode = useColorScheme() === 'dark';
    // return (
    //   <ImageBackground
    //     accessibilityRole="image"
    //     testID="new-app-screen-header"
    //     source={require('../../android/app/src/main/res/mipmap-hdpi/logo_black_rounded.png')}
    //     style={[
    //       styles.background,
    //       // {
    //       //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    //       // },
    //     ]}
    //     imageStyle={styles.logo}>
     
    //     <Text
    //       style={[
    //         styles.text,
    //         // {
    //         //   color: isDarkMode ? Colors.white : Colors.black,
    //         // },
    //       ]}>
    //       Welcome to Our App
    //       {'\n'}
    //       PharmacyApp
    //     </Text>
    //   </ImageBackground>
    // );
  };
  
  const styles = StyleSheet.create({
    background: {
      paddingBottom: 40,
      paddingTop: 96,
      paddingHorizontal: 32,
    },
    logo: {
      opacity: 0.5,
      overflow: 'visible',
      resizeMode: 'cover',
      /*
       * These negative margins allow the image to be offset similarly across screen sizes and component sizes.
       *
       * The source logo.png image is 512x512px, so as such, these margins attempt to be relative to the
       * source image's size.
       */
      marginLeft: -128,
      marginBottom: -192,
    },
    text: {
      fontSize: 30,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
 
 export default TopHeader
 