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
import {Card} from 'react-native-paper';
import {ServerURL} from '../../Connection/FetchServices';
import {getStoreData} from '../../storage/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const {width, height} = Dimensions.get('window');
function StoreProfile({navigation}) {
  const [store, setStore] = useState([]);
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchStoreDetails = async () => {
    setLoader(true);
    var result = await getStoreData('STORE');
    if (result) {
      setStore(result);
    }
    setLoader(false);
  };

  useEffect(
    function () {
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
        {strings.NAME}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        }}>
        {store.username}
      </Text>
      {store.emailid ? (
        <>
          <Text
            style={{
              fontSize: 10,
              marginTop: height * 0.01,
              fontFamily: 'Poppins-Medium',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
            }}>
            {strings.EMAILID}
          </Text>
          <Text
            style={{
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
            }}>
            {store.emailid}
          </Text>
        </>
      ) : null}

      <Text
        style={{
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
          color: theme == 'light' ? '#2C2C2C' : '#fff',
        }}>
        {strings.MOBILE}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        }}>
        {store.mobileno}
      </Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
          color: theme == 'light' ? '#2C2C2C' : '#fff',
        }}>
        {strings.ADDRESS}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        }}>
        {store.address}
      </Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: height * 0.01,
          fontFamily: 'Poppins-Medium',
          color: theme == 'light' ? '#2C2C2C' : '#fff',
        }}>
        {strings.MOBILE}
      </Text>
      <Text
        style={{
          color: theme == 'light' ? '#2C2C2C' : '#fff',
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        }}>
        {store.mobileno}
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
  labelHeadingText: {
    color: '#777777',
    fontSize: 10,
    marginTop: height * 0.01,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  labelText: {
    color: '#1D1D1D',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    // marginTop: height * 0.003,
    // marginBottom: height * 0.007,
  },

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

export default StoreProfile;
