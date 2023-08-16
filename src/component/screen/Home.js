/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import AnimatedLottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Appearance
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import COLORS from '../helper/Colors';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {selectedLng, setLng} from '../../changeLanguage/ChangeLanguage';
import strings from '../../changeLanguage/LocalizedString';
import {useIsFocused} from '@react-navigation/native';
import FA from 'react-native-vector-icons/FontAwesome'
import { getStoreData } from '../storage/AsyncStorage';

const {width, height} = Dimensions.get('screen');

export default function Home({navigation}) {
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme())

  const fetchData = async (item) => {
   
    const superadmin = await getStoreData('SUPERADMIN');
    const admin = await getStoreData('ADMIN');
    const employee = await getStoreData('EMPLOYEE');
    const serviceman = await getStoreData('SERVICEMAN');
    const store = await getStoreData('STORE');

    if(item=="SuperAdminLogin"){
    if( superadmin ){
      navigation.navigate('SuperAdminMainPage');
    }else{
      navigation.navigate(item)
    }
  }

 else if(item=="AdminLogin"){
    if( admin ){
      navigation.navigate('Main');
    }else{
      navigation.navigate(item)
    }
  }
   
  else if(item=="EmployeeLogin"){
    if( employee ){
      navigation.navigate('ClockIn');
    }else{
      navigation.navigate(item)
    }
  }

  else if(item=="ServicemanLogin"){
    if( serviceman ){
      navigation.navigate('ServiceManClockIn');
    }else{
      navigation.navigate(item)
    }
  }
  else if(item=="StoreLogin"){
    if( store){
      navigation.navigate('StorePage');
    }else{
      navigation.navigate(item)
    }
  }
}

  Appearance.addChangeListener((scheme)=>{
   setTheme(scheme.colorScheme);
  })

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

  const data = [
    {
      id: 1,
      type: 'SUPER_ADMIN',
      icon: (
        <FontAwesome
          name="user"
          style={{fontSize: 40, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'SuperAdminLogin',
    },
    {
      id: 2,
      type: 'ADMIN',
      icon: (
        <FontAwesome
          name="user"
          style={{fontSize: 40, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'AdminLogin',
    },
    {
      id: 3,
      type: 'TEAM',
      icon: (
        <FontAwesome
          name="users"
          style={{fontSize: 36, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'EmployeeLogin',
    },
    {
      id: 4,
      type: 'SERVICE_MAN',
      icon: (
        <MCI
          name="human-dolly"
          style={{fontSize: 38, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'ServicemanLogin',
    },

    {
      id: 5,
      type: 'STORE',
      icon: (
        <MCI
          name="store"
          style={{fontSize: 42, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'StoreLogin',
    },
  ];

  const Boxes = ({item,index}) => {
    return (

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          fetchData(item.route)
        }}>
        <View style={{...styles.MainView, ...(index == 4 && {width: width})}}>
          <View
            style={{
              alignSelf: 'center',
    justifyContent: 'flex-start',
    padding: 0.5,
    flex: 1,
    backgroundColor: theme == 'light'? '#fff':'#2C2C2C' ,
    width: width * 0.45,
    borderRadius: 10,
    borderColor: '#d0d0d0',
    borderWidth: 0.5,
    height: 110,
    margin: 5,
    marginLeft:width*0.03
            }}>
            <View style={styles.ImageView}>
              {item.icon ? (
                item.icon
              ) : (
                <Image
                  style={styles.IMGStyle}
                  source={item.source}
                  resizeMode={'contain'}
                />
              )}
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light'? '#000': 'white',
                alignSelf: 'center',
                top: 15,
                paddingVertical: 5,
                textAlign: 'center',
              }}>
              {strings[item.type]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        resizeMode="contain"
        source={require('../assets/background.png')}
        style={{
          zIndex: 9999,
          height,
          width: '100%',
          backgroundColor: theme == 'light'? '#fff':'black',
          flex: 1,
        }}>
        <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            top: 8,
            paddingRight: 10,
            paddingBottom:10,
            borderWidth:0.5,
            borderColor:theme == 'light' ? '#2C2C2C' : 'white',
            width:width*0.1,
            marginLeft:width*0.9,
            borderTopLeftRadius:15,
            borderBottomLeftRadius:15,
            borderTopRightRadius:5,
            alignSelf:'center'
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Language')}
            style={{
              width:-( width * 1),
              borderRadius: 180,
            }}>
            <FA
                name={'language'}
                size={30}
                style={{alignSelf: 'center', marginTop: height*0.01, color: theme == 'light' ? '#2C2C2C' : 'white'}}
              />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: height * 0.02}}>
          {theme == 'light' ? ( <Image
            source={require('../assets/Logo.png')}
            style={{
              resizeMode: 'contain',
              width: 120,
              height: 135,
              alignSelf: 'center',
            }}
          />):( <Image
            source={require('../assets/Logonew.png')}
            style={{
              resizeMode: 'contain',
              width: 120,
              height: 135,
              alignSelf: 'center',
            }}
          />)}
         
          <View style={{alignSelf: 'center', marginTop: height * 0.03}} />
          <AnimatedLottieView
            source={require('../assets/Select User.json')}
            autoPlay
            loop
            style={{width: '50%', alignSelf: 'center'}}
          />
          <View style={{alignItems: 'center', marginTop: height * 0.03}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: theme == 'light'? '#000':'white',
              }}>
              {strings.TYPE}
            </Text>
            <View style={{width: width}}>
              <FlatList
                data={data}
                key={2}
                numColumns={2}
                renderItem={({item, index}) => (
                  <Boxes item={item} index={index} />
                )}
                keyExtractor={item => item.id}
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>
        </View></ScrollView>
      </ImageBackground>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainView: {height: 'auto', padding: 1},
  ImageView: {
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
    alignSelf: 'center',
    top: 12,
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
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: width * 0.5,
    padding: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginRight: 5,
  },
});
