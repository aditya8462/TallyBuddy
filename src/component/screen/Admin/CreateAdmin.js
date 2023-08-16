/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  Text,
  ImageBackground,
  Appearance,
} from 'react-native';
import AppButton from '../../uicomponents/AppButton';
import {postData} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
import SweetAlert from 'react-native-sweet-alert';
import {ScrollView} from 'react-native-gesture-handler';
import COLORS from '../../helper/Colors';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';
const {height, width} = Dimensions.get('screen');
export default function CreateAdmin({navigation}) {
  const [inputs, setInputs] = useState({
    fullname: '',
    mobile: '',
    emailid: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState({});
  const isFocused = useIsFocused();
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [hideButton, setHideButton] = useState(false)

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

  const validate = () => {
    var isValid = true;
    console.log(1);
    if (!inputs.fullname) {
      handleErrors('Please Input Name', 'fullname');
      isValid = false;
    } else if (inputs.fullname.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.fullname)) {
        handleErrors('Please Input valid name', 'fullname');
        isValid = false;
      }
      console.log('here');
    }
    console.log(2);
    if (!inputs.mobile) {
      handleErrors('Please Input Mobile No.', 'mobile');
      isValid = false;
    } else if (inputs.mobile.length) {
      if (isNaN(inputs.mobile.length) || inputs.mobile.length < 10) {
        handleErrors('Please Input valid Mobile No.', 'mobile');
        isValid = false;
      }
    }
    console.log(3);
    if (!inputs.username) {
      handleErrors('Please Input username', 'username');
      isValid = false;
    } else if (inputs.username.length) {
      if (!/^[a-zA-Z0-9_][a-zA-Z0-9_.]{0,29}$/.test(inputs.username)) {
        handleErrors('Please Input valid username', 'username');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log(4);
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
    }
    console.log(isValid);
    if (!inputs.password) {
      handleErrors('Please Input Password', 'password');
      isValid = false;
    }

    console.log('5');
    console.log(isValid);
    return isValid;
  };


  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let body = {
        name: inputs.fullname,
        mobileno: inputs.mobile,
        emailid: inputs.emailid,
        username: inputs.username,
        password: inputs.password,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      console.log('->>>>>>', body)
      setHideButton(true)
      const result = await postData('admins', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.ADMIN_CREATED_SUCCESSFULLY,
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

  const handleErrors = (error, attr) => {
    setError(prevStates => ({...prevStates, [attr]: error}));
  };

  return (
    <ScrollView style={{flex: 1}}>
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      
        <View>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                paddingTop: 10,
              }}>
              {strings.CREATE_ADMIN_DETAILS}
            </Text>
            <View style={{display: 'flex', alignItems: 'center'}}>
              <Input
                error={error.fullname}
                onFocus={() => handleErrors(null, 'fullname')}
                onChangeText={txt => handleValues(txt.trimStart(), 'fullname')}
                placeholder={strings.NAME}
                autoCompleteType="off"
                simpleLineIcons="user"
                value={inputs.fullname}
                keyboardType="text"
                placeholderTextColor= {theme== 'light'? "black":'white'}
              />
              <Input
                error={error.mobile}
                onFocus={() => handleErrors(null, 'mobile')}
                onChangeText={txt => handleValues(txt.trimStart(), 'mobile')}
                keyboardType="numeric"
                placeholder={strings.MOBILE}
                autoCompleteType="off"
                simpleLineIcons="phone"
                placeholderTextColor= {theme== 'light'? "black":'white'}
                maxLength={10}
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
                error={error.username}
                onFocus={() => handleErrors(null, 'username')}
                onChangeText={txt =>
                  handleValues(txt.trimStart(), 'username')
                }
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
              {hideButton?
              ( <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleCreate}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
             
            </View>
          </View>
        </View>
    </ImageBackground>
    </ScrollView>
  );
}
