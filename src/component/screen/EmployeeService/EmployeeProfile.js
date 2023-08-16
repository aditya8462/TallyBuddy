/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Appearance,
} from 'react-native';
import {getStoreData} from '../../storage/AsyncStorage';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const {width, height} = Dimensions.get('window');
function EmployeeProfile({navigation}) {
  const [employee, setEmployee] = useState([]);
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

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
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployee();
    }, []),
  );

  return (
    <View
      style={{
        width: width * 1,
        paddingLeft: 20,
        padding: 5,
        height: height * 0.57,
      }}>
      <Text
        style={{
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
          color: theme == 'light' ? '#2C2C2C' : '#fff',
        }}>
        {strings.STORE}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.store_name}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
        }}>
        {strings.EMAILID}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.emailid}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
        }}>
        {strings.ADDRESS}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.address}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
        }}>
        {strings.CITY}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.city}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
        }}>
        {strings.AADHAR_NO}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.addhar_no}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
        }}>
        {strings.MOBILE}
      </Text>
      <Text
        style={{color: theme == 'light' ? '#2C2C2C' : '#fff', fontSize: 12, fontFamily: 'Poppins-Medium'}}>
        {employee.mobileno}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headingText: {
    fontSize: 17,
    color: '#1D1D1D',
    fontFamily: 'Poppins-Bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * -0.025,
    marginBottom: height * 0.08,
  },
  image: {
    borderRadius: 500,
    borderWidth: 3,
    borderColor: '#0000011a',
    position: 'absolute',
    width: width * 0.3,
    height: height * 0.148,
    elevation: 10,
  },
  labelHeadingText: {},
  labelText: {},

  rbsheetContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    marginTop: height * 0.01,
  },
  modalsubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rbcategoryText: {
    color: '#1D1D1D',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  rbResetText: {
    color: '#347DFC',
    fontSize: 16,
  },
  rbContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rbFilterText: {
    color: '#777777',
  },

  modecenter: {
    width: width * 0.75,
    paddingTop: height * 0.01,
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: 18,
    alignItems: 'center',
  },
  languagecenter: {
    width: width * 0.75,
    paddingTop: height * 0.01,
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'column',
    fontSize: 18,
    alignItems: 'center',
  },
});

export default EmployeeProfile;
