/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Appearance,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default function Splash({navigation}) {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(function () {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.35,
          }}>
          {theme == 'light' ? (
            <Image source={require('../../assets/Logo.png')} />
          ) : (
            <Image source={require('../../assets/Logonew.png')} />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
