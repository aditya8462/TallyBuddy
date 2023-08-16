import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
const {width, height} = Dimensions.get('screen');


const DarkMode = StyleSheet.create({
  CardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000',
    alignSelf: 'center',
    top: 15,
  },
  MainView: {height: 'auto', padding: 1},
  SecondView: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0.5,
    flex: 1,
    backgroundColor: '#fff',
    width: width * 0.45,
    borderRadius: 10,
    // borderColor: COLORS.btnColor,
    borderColor: '#d0d0d0',
    borderWidth: 0.5,
    height: 110,
    margin: 5,
  },
  ImageView: {
    // backgroundColor: props.bgcolor,
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    top: 15,
  },
  IMGStyle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  statusTextIn: {
    fontSize: 9,
    color: '#000',
    // fontFamily: FontFamily.PopinsRegular,
    alignSelf: 'center',
    top: 12,
    // color: '#44bd32',
  },
  DotStatusGreenColor: {
    width: 5,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#44bd32',
  },
  selectLangaugeBtn: {
    width: '50%',
    height: 30,
    // borderWidth: 0.5,
    borderRadius: 10,
    // position: 'absolute',
    // alignSelf: 'center',
    // justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.5,
    padding: 4,
    // backgroundColor:'red'
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 5,
    // alignSelf:'center'
  },
});

export default DarkMode;
