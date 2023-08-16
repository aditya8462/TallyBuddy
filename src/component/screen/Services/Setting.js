/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Appearance,
  ScrollView,
} from 'react-native';
import {Image} from 'react-native-elements';
import {ServerURL} from '../../Connection/FetchServices';
import {getStoreData} from '../../storage/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChangePassword from './ChangePassword';
import ProfileDetails from './ProfileDetails';
import COLORS from '../../helper/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const {height, width} = Dimensions.get('window');

export default function Seeting({navigation}) {
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [index, setIndex] = useState(0);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const handleImagePress = picture => {
    navigation.navigate('ServiceImageSet', {imgp: picture});
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('SERVICEMAN');
    SweetAlert.showAlertWithOptions({
      title: strings.LOGOUT_SUCCESSFULLY,
      confirmButtonTitle: 'OK',
      confirmButtonColor: '#000',
      otherButtonTitle: 'Cancel',
      otherButtonColor: '#dedede',
      style: 'success',
      cancellable: true,
    });
    navigation.replace('ServicemanLogin');
  };

  const fetchServiceman = async () => {
    setLoader(true);
    var result = await getStoreData('SERVICEMAN');
    if (result) {
      setServices(result);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchServiceman();
      selectedLng();
    },
    [],
  );
  return (
    <ScrollView>
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.btnColor,
        marginTop: height * 0.0001,
      }}>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Icon
          name="logout"
          size={25}
          color="white"
          style={{marginLeft: width * 0.8, marginTop: height * 0.06}}
        />
      </TouchableOpacity>
      <View>
        <TouchableOpacity onPress={() => handleImagePress(services.picture)}>
          <Image
            source={{uri: `${ServerURL}/images/${services.picture}`}}
            style={{
              borderRadius: 95,
              borderWidth: 3,
              borderColor: 'white',
              width: width * 0.4,
              height: height * 0.18,
              elevation: 10,
              alignSelf: 'center',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'Poppins-Medium',
          marginTop: height * 0.01,
        }}>
        {services.name}
      </Text>
      <View style={{alignItems: 'center', width: '100%'}}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'space-between',
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ServiceManClockIn', {
                id: services.service_id,
                profile: true,
              })
            }>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: index == 2 ? 'black' : '#d0d0d0',
              }}>
              {strings.CLOCK_OUT}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor: theme == 'light' ? '#fff' : 'black'}}>
          {index == 0 && <ProfileDetails />}
          {index == 1 && <ChangePassword />}
        </View>
      </View>
    </View>
    </ScrollView>
  );
}
