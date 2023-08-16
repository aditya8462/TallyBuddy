/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  Appearance,
  ScrollView,
} from 'react-native';
import Input from '../../uicomponents/Input';
import Lottie from 'lottie-react-native';
import AppButton from '../../uicomponents/AppButton';
import {postData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import {getStoreData, storeData} from '../../storage/AsyncStorage';
import COLORS from '../../helper/Colors';
import AnimatedLottieView from 'lottie-react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';

const {height, width} = Dimensions.get('screen');

export default function EmployeeLogin({navigation}) {
  const [inputs, setInputs] = useState({email: '', password: ''});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const validate = () => {
    var isValid = true;
    if (!inputs.email) {
      handleErrors('Please input email..', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleErrors('Please input password..', 'password');
      isValid = false;
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (validate()) {
      var result = await postData('employee/login', {
        email: inputs.email,
        password: inputs.password,
      });
      if (result.status) {
        storeData('EMPLOYEE', result.data);
        navigation.replace('ClockIn');
      } else {
        SweetAlert.showAlertWithOptions({
          title: strings.INVALID_PASSWORD,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
        });
      }
    }
  };
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  useEffect(
    function () {
      const fetchData = async () => {
        setLoader(true);
        const data = await getStoreData('EMPLOYEE');
        if (data) {
          navigation.replace('ClockIn');
        }
        setLoader(false);
      };
      fetchData();
      selectedLng();
    },
    [isFocused],
  );

  if (loader) {
    return (
      <AnimatedLottieView
        source={require('../../assets/TallyBudy Loader.json')}
        autoPlay
        loop
        style={{height: 100, alignSelf: 'center', display: 'flex'}}
      />
    );
  }

  return (
    <ScrollView>
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{
          flex: 1,
          zIndex: 9999,
          height,
          width: '100%',
          backgroundColor: theme == 'light' ? '#fff' : 'black',
        }}>
        <KeyboardAvoidingView>
          <View>
            <View style={{alignSelf: 'center'}}>
            {theme=='light' ? ( <Image
                source={require('../../assets/Logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: 120,
                  marginTop: 20,
                }}
              />):( <Image
                source={require('../../assets/Logonew.png')}
                style={{
                  resizeMode: 'contain',
                  width: 120,
                  marginTop: 20,
                }}
              />)}
            </View>
            <View style={{alignSelf: 'center'}}>
              <Lottie
                source={require('../../assets/Hello.json')}
                autoPlay
                loop
                style={{height: 250, width: 50}}
              />
            </View>
            <View style={{paddingHorizontal: 25}}>
              <Text
                style={{
                  color: COLORS.btnColor,
                  fontSize: 25,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {strings.HELLO_TEAM}
              </Text>
              <Text
                style={{
                  color: theme == 'light' ? 'black' : 'white',
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  fontWeight: 'regular',
                  marginTop: 10,
                }}>
                {strings.LOGIN_TO_YOUR_ACCOUNT}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
               <Input
                    error={error.email}
                     onFocus={() => handleErrors(null, 'email')}
                     onChangeText={txt => handleValues(txt, 'email')}
                     placeholder={strings.MOBILE}
                     maxLength={10}
                     autoCompleteType="off"
                     simpleLineIcons="phone"
                     keyboardType="phone-pad"
                     placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                   />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <Input
                  error={error.password}
                  onFocus={() => handleErrors(null, 'password')}
                  onChangeText={txt => handleValues(txt, 'password')}
                  placeholder={strings.PASSWORD}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  simpleLineIcons="lock"
                  EntypoEnd="eye"
                />
               
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <AppButton onPress={handleLogin} buttonText={strings.LOGIN} />
              </View>
              {/* <Text
                style={{
                  color: COLORS.btnColor,
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold',
                  alignSelf: 'center',
                  marginTop: 15,
                }}>
                {strings.FORGET_PASSWORD}
              </Text> */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
    </ScrollView>
  );
}
