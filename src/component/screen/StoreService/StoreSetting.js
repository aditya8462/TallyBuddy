/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity, Appearance} from 'react-native';
import {Image} from 'react-native-elements';
import {ServerURL} from '../../Connection/FetchServices';
import {getStoreData} from '../../storage/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';
import StoreChangePassword from './StoreChangePassword';
import StoreProfile from './StoreProfile';
import RaiseDemands from './RaiseDemands';
import AsyncStorage from '@react-native-community/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const {height, width} = Dimensions.get('window');

export default function StoreSetting({navigation}) {
  const [store, setStore] = useState([]);
  const [loader, setLoader] = useState(true);
  const [index, setIndex] = useState(0);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });


  const handleLogout = async () => {
    await AsyncStorage.removeItem('STORE');
    SweetAlert.showAlertWithOptions({
      title: strings.LOGOUT_SUCCESSFULLY,
      confirmButtonTitle: 'OK',
      confirmButtonColor: '#000',
      otherButtonTitle: 'Cancel',
      otherButtonColor: '#dedede',
      style: 'success',
      cancellable: true,
    });
    navigation.replace('StoreLogin');
  };

  const fetchStoreDetails = async () => {
    setLoader(true);
    var result = await getStoreData('STORE');
    if (result) {
      setStore(result);
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchStoreDetails();
    selectedLng();
  },
  [isFocused],
);

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreDetails();
    }, []),
  );
  return (
    <View
      style={{
        marginTop: height * 0.0002,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#8b0000',
        backgroundColor: COLORS.btnColor,
      }}>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Icon
          name="logout"
          size={25}
          color="white"
          style={{marginLeft: width * 0.76, marginTop: height * 0.06}}
        />
      </TouchableOpacity>
      <View>
        <Image
          source={require('../../assets/store.png')}
          style={{
            borderRadius: 95,
            borderWidth: 3,
            borderColor: 'white',
            width: width * 0.40,
            height: height * 0.18,
            elevation: 10,
            alignSelf:'center',
          }}
          resizeMode="cover"
        />
      </View>
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'Poppins-Medium',
          marginTop: height * 0.01,
        }}>
        {store.name}
      </Text>
      {/* <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontFamily: 'Poppins-Medium',
        }}>
        {store.designation}
      </Text> */}
      <View style={{alignItems: 'center', width: '100%'}}>
        <View
          style={{
            backgroundColor: 'white',
            // height: '90%',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            padding: 10,
            width: '100%',
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
            marginTop: height * 0.02,
          }}>
          <TouchableOpacity
            onPress={() => setIndex(0)}
            style={{
              borderBottomColor: index == 0 ? COLORS.btnColor : null,
              borderWidth: index == 0 ? 2.5 : null,
              borderTopColor: 'white',
              borderLeftColor: 'white',
              borderRightColor: 'white',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: index == 0 ? 'black' : '#d0d0d0',
              }}>
              {strings.PROFILE_DETAILS}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIndex(1)}
            style={{
              // backgroundColor: index == 1 ? 'blue' : null,
              borderBottomColor: index == 1 ? COLORS.btnColor : null,
              borderWidth: index == 1 ? 2.5 : null,
              borderTopColor: 'white',
              borderLeftColor: 'white',
              borderRightColor: 'white',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: index == 1 ? 'black' : '#d0d0d0',
              }}>
              {strings.CHANGE_PASSWORD}
            </Text>
          </TouchableOpacity>
        </View>
        <View  style={{backgroundColor: theme == 'light' ? '#fff' : 'black'}}>
          {index == 0 && <StoreProfile />}
          {index == 1 && <StoreChangePassword />}
        </View>
      </View>
    </View>
  );
}
