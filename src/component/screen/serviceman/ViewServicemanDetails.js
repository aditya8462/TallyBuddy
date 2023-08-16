/* eslint-disable eqeqeq */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  RefreshControl,
  Appearance,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome';
import {ServerURL, getData} from '../../Connection/FetchServices';
import {useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import MI from 'react-native-vector-icons/MaterialIcons';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';



const {height, width} = Dimensions.get('window');

export default function ViewServicemanDetails({navigation, route}) {
  const [serviceman, setServiceman] = useState({});
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };
  const fetchServiceman = async () => {
    setLoader(true);
    var result = await getData('serviceman/' + route.params.id);
    if (result.status) {
      setServiceman(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setServiceman);
  };

  useEffect(
    function () {
      fetchServiceman();
      selectedLng();
    },
    [],
  );


  const Boxes = ({item}) => {
    return (
      <View style={{flexDirection:'column',backgroundColor:COLORS.btnColor}}>
      <View style={{backgroundColor:'white',borderBottomLeftRadius:height*0.1}}>
      <View style={{backgroundColor:COLORS.btnColor,height:height*0.32,borderBottomRightRadius:height*0.1}}>
      <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image
               source={{uri: `${ServerURL}/images/${item.picture}`}}
               style={{
                borderRadius: 15,
                 borderWidth: 3,
                 borderColor: 'white',
                 width: width * 0.4,
                 height: height * 0.18,
                 elevation: 10,
                 alignSelf: 'center',
                 marginTop: height*0.03,
               }}
               resizeMode="cover"
             />
             </TouchableOpacity>
             <View style={{marginTop:5}}>
             <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize:30,
                   color: 'white',
                   fontFamily: 'Poppins-Bold',
                   textAlign:'center'
                 }}>
                 {item.name}
               </Text>
             </View>
             <View style={{flexDirection: 'row', alignSelf: 'center'}}>
             <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: 'white',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 +91 {item.mobileno}
               </Text>
             </View>
      </View> 
      </View>

      <View style={{backgroundColor:'#0652DD',borderTopLeftRadius:height*0.1}}>
      <View style={{backgroundColor:'white',height:height,borderTopLeftRadius:height*0.1}}>
        <View style={{padding:height*0.015,paddingLeft:height*0.06}}>
        {item.emailid ? (
        <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MC
                  name="email"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                   paddingTop:5
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.EMAILID}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.emailid}
               </Text>
               </View>
               </View>
               ):null}
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MCI
                  name="home"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                   paddingTop:5
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03,width:width*0.6}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.ADDRESS}
               </Text>
               <Text
                 numberOfLines={2}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.address},{item.city}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MI
                  name="add-location-alt"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                   paddingTop:5
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.SERVICE_AREA}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.servicearea.join(',')}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <FA
                   name="rupee"
                   size={32}
                   style={{
                     color: theme == 'light' ? COLORS.btnColor : 'white',
                     padding: 2,
                     paddingLeft:8,
                     paddingTop:8
                   }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.SALARY}
               </Text>
               <View style={{flexDirection: 'row', alignItems: 'center'}}></View>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.salary}.00
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MC
                  name="card-account-details-outline"
                  size={30}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 2,
                    paddingTop:8
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.AADHAR_NO}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.addhar_no}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MC
                 name="office-building-marker"
                 size={32}
                 style={{
                   color: theme == 'light' ? COLORS.btnColor : 'white',
                   padding: 1,
                   paddingTop:6
                                  
                 }}
               />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.STATE}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.state}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{backgroundColor:COLORS.grey,borderRadius:15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
               <MC
 name="list-status"
 size={32}
 style={{
   color: theme == 'light' ? COLORS.btnColor : 'white',
   padding: 2,
   paddingTop:4
 }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.STATUS}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.status == '1'?'Active':'Inactive'}
               </Text>
               </View>
               </View>
               </View>
      </View>
      </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#f5f6fa' : 'black',
      }}>
        <ScrollView>
      <View style={{flex: 1}}>
        <View style={{width: width}}>
          {loader ? (
            <AnimatedLottieView
              source={require('../../assets/TallyBudy Loader.json')}
              autoPlay
              loop
              style={{height: 100, alignSelf: 'center', display: 'flex'}}
            />
          ) : (
            <>
              <Boxes item={serviceman} />
            </>
          )}
        </View>
      </View>
      </ScrollView>
    </ImageBackground>
  );
}
