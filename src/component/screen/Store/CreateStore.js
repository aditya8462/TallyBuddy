/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  Appearance,
} from 'react-native';
import AppButton from '../../uicomponents/AppButton';
import {postData} from '../../Connection/FetchServices';
import {RadioButton} from 'react-native-paper';
import Input from '../../uicomponents/Input';
import Inputs from '../../uicomponents/Inputs';

import SweetAlert from 'react-native-sweet-alert';
import {ScrollView} from 'react-native-gesture-handler';
import COLORS from '../../helper/Colors';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';

const {height, width} = Dimensions.get('screen');

export default function CreateStore({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
    emailid: '',
    mobileno: '',
    address: '',
    gstno: '',
    status: '',
  });
  
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [hideButton, setHideButton] = useState(false)
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const [error, setError] = useState({});
  const [checked, setChecked] = React.useState('first');

  const isFocused = useIsFocused();

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

  const validate = () => {
    var isValid = true;
    if (!inputs.name) {
      handleErrors('Please Input Name', 'name');
      isValid = false;
    } else if (inputs.name.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.name)) {
        handleErrors('Please Input valid name', 'name');
        isValid = false;
      }
      console.log('here');
    }
    console.log('1')
    if (!inputs.username.length) {
      handleErrors('Please Input username', 'username');
      isValid = false;
    } 
    else if (inputs.username.length) {
      if (!/^[a-zA-Z0-9_][a-zA-Z0-9_.]{0,29}$/.test(inputs.username)) {
        handleErrors('Please Input valid username', 'username');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log('2')

    if (!inputs.password) {
      handleErrors('Please Input Password', 'password');
      isValid = false;
    }
    if (!inputs.mobileno) {
      handleErrors('Please Input Mobile No.', 'mobileno');
      isValid = false;
    } else if (inputs.mobileno.length) {
      if (isNaN(inputs.mobileno.length) || inputs.mobileno.length < 10) {
        handleErrors('Please Input valid Mobile No.', 'mobileno');
        isValid = false;
      }
    }

   if (inputs.gstno.length) {
      if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(inputs.gstno)) {
        handleErrors('Please Input valid Gst no.', 'gstno');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log('3')
    
    if (!inputs.address) {
      handleErrors('Please Input Address', 'address');
      isValid = false;
    } else if (inputs.address.length) {
      if (!/^[a-zA-Z0-9\s,.'-]{3,}$/.test(inputs.address)) {
        handleErrors('Please Input Valid Address', 'address');
        isValid = false;
      }
      console.log(isValid);
    }
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
    }
    console.log('4')
    console.log(isValid);
    return isValid;
  };

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let body = {
        name: inputs.name,
        username: inputs.username,
        password: inputs.password,
        emailid: inputs.emailid,
        mobileno: inputs.mobileno,
        address: inputs.address,
        gstno: inputs.gstno,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await postData('store', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.STORE_CREATED_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
        navigation.goBack();
      } else {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVER_ERROR,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
        });
      }
    }
    setHideButton(false)
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  return (
    <ScrollView>
      <View>
        <ImageBackground
          source={require('../../assets/background.png')}
          style={{
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 25,
              marginTop: 10,
            }}>
            {strings.CREATE_STORE_DETAILS}
          </Text>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Input
              error={error.name}
              onFocus={() => handleErrors(null, 'name')}
              onChangeText={txt => handleValues(txt.trimStart(), 'name')}
              placeholder={strings.NAME}
              autoCompleteType="off"
              simpleLineIcons="user"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.username}
              onFocus={() => handleErrors(null, 'username')}
              onChangeText={txt => handleValues(txt.trimStart(), 'username')}
              placeholder={strings.USERNAME}
              autoCompleteType="off"
              simpleLineIcons="user"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.password}
              onFocus={() => handleErrors(null, 'password')}
              onChangeText={txt => handleValues(txt, 'password')}
              placeholder={strings.PASSWORD}
              autoCompleteType="off"
              simpleLineIcons="lock"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
            error={error.emailid}
              onFocus={() => handleErrors(null, 'emailid')}
              onChangeText={txt => handleValues(txt, 'emailid')}
              placeholder={strings.EMAILID}
              autoCompleteType="off"
              fontisto="email"
              keyboardType="email-address"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.mobileno}
              onFocus={() => handleErrors(null, 'mobileno')}
              onChangeText={txt => handleValues(txt.trimStart(), 'mobileno')}
              keyboardType="numeric"
              placeholder={strings.MOBILE}
              maxLength={10}
              autoCompleteType="off"
              simpleLineIcons="phone"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            
            <Inputs
              error={error.address}
              onFocus={() => handleErrors(null, 'address')}
              onChangeText={txt => handleValues(txt.trimStart(), 'address')}
              placeholder={strings.ADDRESS}
              multiline
              numberOfLines={5}
              height={120}
              autoCompleteType="off"
              simpleLineIcons="home"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />

            <Input
              error={error.gstno}
              onFocus={() => handleErrors(null, 'gstno')}
              onChangeText={txt => handleValues(txt, 'gstno')}
              placeholder={strings.GST_NO}
              autoCompleteType="off"
              simpleLineIcons="user"
              maxLength={15}
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />

            <View style={{alignSelf: 'flex-start'}}>
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: 'bold',
                  color: theme== 'light'? "black":'white',
                  fontSize: 14,
                  marginLeft: 20,
                }}>
                {strings.STATUS}
              </Text>
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    marginLeft: 20,
                  }}>
                  <RadioButton
                    value="1"
                    status={checked === '1' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('1');
                      handleValues('1', 'status');
                    }}
                  />
                  <Text style={{marginRight: 50,color: theme== 'light'? "black":'white',}}>{strings.YES}</Text>
                  <RadioButton
                    value="2"
                    status={checked === '2' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('2');
                      handleValues('2', 'status');
                    }}
                  />
                  <Text style={{color: theme== 'light'? "black":'white',}}>{strings.NO}</Text>
                </View>
              </View>
            </View>
            {hideButton?
              (<AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ):(<AppButton
                onPress={handleCreate}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />)}
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}
