/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import COLORS from '../helper/Colors';
const {width, height} = Dimensions.get('window');

export default function Tag({tagText,txtColor, tagWidth, bgColor, ...props}) {
  return (
    <View
      style={{
        width: tagWidth || 100,
        backgroundColor: bgColor || COLORS.red,
        opacity:0.7,
        borderBottomRightRadius:height*0.2,
        borderBottomLeftRadius:50,
        borderTopLeftRadius:30,
        borderColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: height*0.022,
      }}>
        <View>
      <Text
        style={{
          color: txtColor ||'#03753C',
          fontSize: 12,
          textAlign:'center',
          fontFamily: 'Poppins-Bold',
        }}>
        {tagText}
      </Text>
    </View>
    </View>
  );
}
