/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';

const {height, width} = Dimensions.get('screen');

export default function SplashScreen({navigation}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{
          flex: 1,
          zIndex: 9999,
          height,
          width: '100%',
          backgroundColor: '#fff',
        }}>
        <KeyboardAvoidingView>
          <View>
            <View style={{alignSelf: 'center', marginTop: height * 0.25}}>
              <Image
                source={require('../assets/Logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: 160,
                  marginTop: 20,
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
