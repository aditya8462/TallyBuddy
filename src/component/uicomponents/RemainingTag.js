/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import COLORS from '../helper/Colors';
const {width, height} = Dimensions.get('window');

export default function RemainingTag({tagText,txtColor, tagWidth, bgColor, ...props}) {
  return (
    <View
      style={{
        width: tagWidth || 40,
        borderRadius:7,
        backgroundColor: bgColor || '#F6BE00',
        borderColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: height*0.022,
      }}>
        <View>
      <Text
        style={{
          color: txtColor || COLORS.white,
          fontSize: 10,
          textAlign:'center',
          fontFamily: 'Poppins-Bold',
        }}>
        {tagText}
      </Text>
    </View>
    </View>
  );
}
