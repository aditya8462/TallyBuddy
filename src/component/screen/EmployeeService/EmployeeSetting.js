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
import SweetAlert from 'react-native-sweet-alert';
import {ServerURL} from '../../Connection/FetchServices';
import {getStoreData} from '../../storage/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmployeeProfile from './EmployeeProfile';
import EmployeeChangePassword from './EmployeeChangePassword';
import COLORS from '../../helper/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const {height, width} = Dimensions.get('window');

export default function EmployeeSetting({navigation}) {
  const [employee, setEmployee] = useState([]);
  const [loader, setLoader] = useState(true);
  const [index, setIndex] = useState(0);
  const isFocused = useIsFocused();
  const handleImagePress = picture => {
    navigation.navigate('EmployeImageSet', {imgp: picture});
  };
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem('EMPLOYEE');
    SweetAlert.showAlertWithOptions({
      title: strings.LOGOUT_SUCCESSFULLY,
      confirmButtonTitle: 'OK',
      confirmButtonColor: '#000',
      otherButtonTitle: 'Cancel',
      otherButtonColor: '#dedede',
      style: 'success',
      cancellable: true,
    });
    navigation.replace('EmployeeLogin');
  };

  const fetchEmployee = async () => {
    setLoader(true);
    var result = await getStoreData('EMPLOYEE');
    if (result) {
      setEmployee(result);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchEmployee();
      selectedLng();
    },
    [],
  );

  return (
    <ScrollView>
    <View
      style={{
        marginTop: height * 0.0005,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.btnColor,
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
        <TouchableOpacity onPress={() => handleImagePress(employee.picture)}>
          <Image
            source={{uri: `${ServerURL}/images/${employee.picture}`}}
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
        {employee.name}
      </Text>
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontFamily: 'Poppins-Medium',
        }}>
        {employee.designation}
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
              navigation.navigate('ClockIn', {
                id: employee.employee_id,
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
        <View style={{backgroundColor: theme == 'light' ? '#ffff' : 'black'}}>
          {index == 0 && <EmployeeProfile />}
          {index == 1 && <EmployeeChangePassword />}
        </View>
      </View>
    </View>
    </ScrollView>
  );
}
