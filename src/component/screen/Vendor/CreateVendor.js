/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ToastAndroid,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FilePicker, {types} from 'react-native-document-picker';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {postData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';

import stateCity from '../stateCity.json';
import COLORS from '../../helper/Colors';
import Inputs from '../../uicomponents/Inputs';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';
import {Appearance} from 'react-native';

const {height, width} = Dimensions.get('screen');
export default function CreateVendor({navigation}) {
  const [inputs, setInputs] = useState({
    firmname: '',
    typeoffirm: '',
    country: '',
    gstno: '',
    address: '',
    emailid: '',
    mobileno: '',
    status: '',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
  });
  const [error, setError] = useState({});
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

  const validate = () => {
    var isValid = true;
    if (!inputs.firmname) {
      handleErrors('Please Input Firm Name', 'firmname');
      isValid = false;
    } else if (inputs.firmname.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.firmname)) {
        handleErrors('Please Input valid firmname', 'firmname');
        isValid = false;
      }
    }

    if (!inputs.typeoffirm) {
      handleErrors('Please Input firm type', 'typeoffirm');
      isValid = false;
    } else if (inputs.typeoffirm.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.typeoffirm)) {
        handleErrors('Please Input valid firm type', 'typeoffirm');
        isValid = false;
      }
    }

    if (!inputs.country) {
      handleErrors('Please Input Country', 'country');
      isValid = false;
    } else if (inputs.country.length) {
      const regex = new RegExp(/^[a-zA-Z ]{5,30}$/);
      if (!regex.test(inputs.country)) {
        handleErrors('Please Input valid Country', 'country');
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
    if (!inputs.mobileno) {
      handleErrors('Please Input Mobile No.', 'mobileno');
      isValid = false;
    } else if (inputs.mobileno.length) {
      if (isNaN(inputs.mobileno.length) || inputs.mobileno.length < 10) {
        handleErrors('Please Input valid Mobile No.', 'mobileno');
        isValid = false;
      }
    }
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input valid emailid', 'emailid');
        isValid = false;
      }
    }
    console.log(isValid);
    return isValid;
  };

  const states = Object.keys(stateCity);
  const [getCities, setCities] = useState([]);

  const handleState = state => {
    const cities = stateCity[state];
    setCities(cities);
  };

  const handleCity = city => {};

  const [fileData, setFileData] = useState([]);
  const handleFilePicker = async () => {
    try {
      const response = await FilePicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: false,
        type: [types.images],
      });
      setFileData(response);
    } catch (err) {
      console.log(error);
    }
  };

  const [checked, setChecked] = React.useState('first');

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');
    if (validate()) {
      let body = {
        firm_name: inputs.firmname,
        type_of_firm: inputs.typeoffirm,
        country: inputs.country,
        gstno: inputs.gstno,
        address: inputs.address,
        emailid: inputs.emailid,
        mobileno: inputs.mobileno,
        status: inputs.status,
        state: inputs.state,
        city: inputs.city,
        added_by: asyncData?asyncData.name:superAdmin.name||employeeAdmin.name||storeAdmin.name,
      };
      setHideButton(true)
      const result = await postData('vendor', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.VENDOR_CREATED_SUCCESSFULLY,
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
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <ScrollView>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              marginTop: 5,
            }}>
            {strings.CREATE_VENDOR}
          </Text>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              error={error.firmname}
              onFocus={() => handleErrors(null, 'firmname')}
              onChangeText={txt => handleValues(txt.trimStart(), 'firmname')}
              placeholder={strings.FIRM_NAME}
              autoCompleteType="off"
              materialCommunityIcons="office-building-outline"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Input
              error={error.typeoffirm}
              onFocus={() => handleErrors(null, 'typeoffirm')}
              onChangeText={txt => handleValues(txt.trimStart(), 'typeoffirm')}
              placeholder={strings.TYPE_OF_FIRM}
              autoCompleteType="off"
              materialCommunityIcons="office-building-cog"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Input
              error={error.country}
              onFocus={() => handleErrors(null, 'country')}
              onChangeText={txt => handleValues(txt.trimStart(), 'country')}
              placeholder={strings.COUNTRY}
              autoCompleteType="off"
              simpleLineIcons="globe"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
          </View>
          <View>
            <Text
              style={{
                marginTop: 10,
                fontWeight: '600',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                fontSize: 14,
                marginLeft: 20,
              }}>
              {strings.STATUS}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                marginLeft: 20,
              }}>
              <RadioButton
                value="first"
                status={checked === '1' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('1');
                  handleValues('1', 'status');
                }}
              />
              <Text
                style={{
                  marginRight: 50,
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.YES}
              </Text>
              <RadioButton
                value="second"
                status={checked === '2' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('2');
                  handleValues('2', 'status');
                }}
              />
              <Text style={{color:theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              error={error.gstno}
              onFocus={() => handleErrors(null, 'gstno')}
              onChangeText={txt => handleValues(txt, 'gstno')}
              placeholder={strings.GST_NO}
              autoCompleteType="off"
              maxLength={15}
              materialCommunityIcons="file-edit-outline"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Inputs
              error={error.address}
              onFocus={() => handleErrors(null, 'address')}
              onChangeText={txt => handleValues(txt.trimStart(), 'address')}
              placeholder={strings.ADDRESS}
              multiline
              numberOfLines={5}
              autoCompleteType="off"
              height={120}
              simpleLineIcons="home"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
          </View>

          <View>
            <SelectDropdown
              data={states}
              onSelect={(selectedItem, index) => {
                handleState(selectedItem);
                handleValues(selectedItem, 'state');
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                height: 50,
                width: '90%',
                borderRadius: 10,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                paddingLeft: 20,
                marginTop: 10,
                alignSelf: 'center',
              }}
              buttonTextStyle={{
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                textAlign: 'left',
                fontSize: 14,
              }}
              defaultButtonText="Madhya Pradesh"
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={theme == 'light' ? '#2C2C2C' : '#fff'}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition="right"
            />
            <SelectDropdown
              data={getCities}
              onSelect={(selectedItem, index) => {
                handleValues(selectedItem, 'city');
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                height: 50,
                width: '90%',
                borderRadius: 10,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                paddingLeft: 20,
                marginTop: 10,
                alignSelf: 'center',
              }}
              buttonTextStyle={{
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                textAlign: 'left',
                fontSize: 14,
              }}
              defaultButtonText="Gwalior"
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={theme == 'light' ? '#2C2C2C' : '#fff'}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition="right"
            />
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              error={error.emailid}
              onFocus={() => handleErrors(null, 'emailid')}
              onChangeText={txt => handleValues(txt, 'emailid')}
              placeholder={strings.EMAILID}
              autoCompleteType="off"
              materialCommunityIcons="email-outline"
              keyboardType="email-address"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Input
              error={error.mobileno}
              onFocus={() => handleErrors(null, 'mobileno')}
              onChangeText={txt =>
                handleValues(txt.trimStart(), 'mobileno')
              }
              keyboardType="numeric"
              placeholder={strings.MOBILE}
              autoCompleteType="off"
              simpleLineIcons="phone"
              maxLength={10}
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
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
          <View style={{marginTop: 10}} />
        </View>
      </ScrollView>
    </ImageBackground>
    </ScrollView>
  );
}
