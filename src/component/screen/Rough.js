import { View, Text, Dimensions } from 'react-native'
import React from 'react'


const {width, height} = Dimensions.get('screen');
export default function Rough() {
  return (
    <View style={{flexDirection:'column',backgroundColor:'#3498db'}}>
    <View style={{backgroundColor:'white',borderBottomLeftRadius:height*0.1}}>
    <View style={{backgroundColor:'#3498db',height:height*0.45,borderBottomRightRadius:height*0.1}}>
      <Text style={{color:'red',fontSize:20}}>Rough</Text>
    </View>
    </View>
    <View style={{backgroundColor:'#3498db',borderTopLeftRadius:height*0.1}}>
    <View style={{backgroundColor:'white',height:height*0.45,borderTopLeftRadius:height*0.1}}>
      <Text style={{color:'red',fontSize:20}}>Rough</Text>
    </View>
    </View>
    </View>
  )
}