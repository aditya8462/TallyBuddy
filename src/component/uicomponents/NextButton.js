/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import COLORS from '../helper/Colors';
const {width, height} = Dimensions.get('window');

export default function NextButton({buttonText, btnWidth, bgColor, ...props}) {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          width: width * 0.3,
          backgroundColor: bgColor || COLORS.btnColor,
          borderRadius: 5,
          borderColor: bgColor,
          marginTop: height * 0.012,
          alignItems: 'center',
          justifyContent:'center',
          height: 35,
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
