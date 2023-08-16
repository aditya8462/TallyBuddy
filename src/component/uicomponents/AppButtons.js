/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import COLORS from '../helper/Colors';
import Entypo from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('window');

export default function AppButtons({
  buttonText,
  entypo,
  btnWidth,
  bgColor,
  color,
  ...props
}) {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          padding:5,
          backgroundColor: bgColor || COLORS.btnColor,
          borderRadius: 5,
          borderColor: bgColor,
          marginTop: height * 0.012,
          justifyContent: 'space-evenly',
           height: 30,
          flexDirection: 'row',
        }}>
        {entypo && <Entypo name={entypo} style={styles.icon} {...props} />}
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
            alignSelf:'center'
          }}>
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  icon: {
    size: 20,
    color: COLORS.white,
    
    alignSelf:'center'
  },
});
