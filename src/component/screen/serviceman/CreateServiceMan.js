/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';
import Dicon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native';
import {RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FilePicker, {types} from 'react-native-document-picker';
import AppButton from '../../uicomponents/AppButton';
import Icon from 'react-native-vector-icons/Entypo';
import Input from '../../uicomponents/Input';
import {postDataAxios, getData} from '../../Connection/FetchServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';

import stateCity from '../stateCity.json';
import COLORS from '../../helper/Colors';
import Inputs from '../../uicomponents/Inputs';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';
import { Appearance } from 'react-native';

const {height, width} = Dimensions.get('screen');
export default function Rough({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    emailid: '',
    mobileno: '',
    address: '',
    aadhar_no: '',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    servicearea: '',
    password: '',
    status: '',
  });

  const [error, setError] = useState({});
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(function () {
    selectedLng();
  }, [isFocused]);


  const validate = () => {
    // alert(inputs.servicearea.length)
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
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
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
    if (!inputs.password) {
      handleErrors('Please Input password', 'password');
      isValid = false;
      console.log(4);
    }
    if (!inputs.aadhar_no) {
      handleErrors('Please Input aadhar no.', 'aadhar_no');
      isValid = false;
    } else if (inputs.aadhar_no.length) {
      if (isNaN(inputs.aadhar_no.length) || inputs.aadhar_no.length < 12) {
        handleErrors('Please Input valid aadhar no.', 'aadhar_no');
        isValid = false;
      }
    }
    console.log('4');
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

// if(inputs.servicearea.length==0){
//   handleErrors('Please Input Servicearea', 'servicearea');
//   isValid= false
// }
// else if (inputs.servicearea.length) {
//   if (!/^[1-9][0-9]{5}$/.test(inputs.servicearea)) {
//     handleErrors('Please Input Valid service area', 'servicearea');
//     isValid = false;
//   }
// }
    console.log(isValid);
    return isValid;
  };

  const states = Object.keys(stateCity);
  const [getCities, setCities] = useState([]);

  const handleState = state => {
    const cities = stateCity[state];
    setCities(cities);
  };

  const [filePath, setFilePath] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Write permission err', err);
      }
      return false;
    } else {
      return true;
    }
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      } else {
        const source = {
          base64: 'data:image/jpeg;base64,' + response.assets[0].base64,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        };
        setFilePath(source);
      }
    });
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      setFilePath(response);
    });
  };

  const [checked, setChecked] = React.useState('first');
  const [servicearea, setServiceArea] = useState(['']);
  const [hideButton, setHideButton]=useState(false)


  const handleDeleteInput = index => {
    const deletename = [...servicearea];
    deletename.splice(index, 1);
    setServiceArea([...deletename]);
  };

  const handleInputChange = (index, text) => {
    const newInputs = [...servicearea];
    newInputs[index] = text;
    setServiceArea(newInputs);
  };

  const handleAddInput = () => {
    const newInputs = [...servicearea];
    newInputs.push('');
    setServiceArea(newInputs);
  };


  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('name', inputs.name);
      formdata.append('mobileno', inputs.mobileno);
      formdata.append('emailid', inputs.emailid);
      formdata.append('address', inputs.address);
      formdata.append('password', inputs.password);
      formdata.append('addhar_no', inputs.aadhar_no);
      formdata.append('state', inputs.state);
      formdata.append('city', inputs.city);
      formdata.append('servicearea', JSON.stringify(servicearea));
      formdata.append('status', inputs.status);
      formdata.append('added_by', asyncData?asyncData.name:superAdmin.name);

      formdata.append('picture', {
        ...filePath,
      });
      setHideButton(true)
      const result = await postDataAxios('serviceman', formdata);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVICEMAN_CREATED_SUCCESSFULLY,
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
  // }

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  return (
  
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor:  theme == 'light' ? '#fff' : 'black',
      }}>
      <ScrollView>
        <View style={{flex: 1}}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                marginTop: 10,
              }}>
              {strings.CREATE_SERVICEMAN}
            </Text>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder={strings.NAME}
                autoCompleteType="off"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                simpleLineIcons="user"
              />
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
                onChangeText={txt => handleValues(txt.trimStart(), 'mobileno')}
                placeholder={strings.MOBILE}
                maxLength={10}
                autoCompleteType="off"
                simpleLineIcons="phone"
                keyboardType="numeric"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
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
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.aadhar_no}
                onFocus={() => handleErrors(null, 'aadhar_no')}
                onChangeText={txt => handleValues(txt.trimStart(), 'aadhar_no')}
                placeholder={strings.AADHAR_NO}
                maxLength={12}
                keyboardType="numeric"
                autoCompleteType="off"
                simpleLineIcons="user"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />

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
                  defaultButtonText={'Gwalior'}
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
              <Input
                error={error.password}
                onFocus={() => handleErrors(null, 'password')}
                onChangeText={txt => handleValues(txt, 'password')}
                placeholder={strings.PASSWORD}
                autoCompleteType="off"
                simpleLineIcons="lock"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: width * 0.87,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily:'Poppins-Bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.SERVICE_AREA}
                </Text>
                <TouchableOpacity onPress={handleAddInput}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily:'Poppins-Bold',
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.ADD_MORE}
                  </Text>
                </TouchableOpacity>
              </View>
              {servicearea.map((item, index) => (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                   style={{width: index != 0 ? width * 0.8 : width * 0.9,
                    backgroundColor:theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                    borderColor: '#f2f2f2',
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,}}>
                    <TextInput
                      style={{
                        fontSize: 12,
                        marginLeft: 20,
                        width: '100%',
                      }}
                      error={error.servicearea}
                      keyboardType='numeric'
                      maxLength={6}
                      onChangeText={txt => handleInputChange(index, txt)}
                      placeholder={strings.SERVICE_AREA}
                      placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                    />
                  </View>
                  {index != 0 ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleDeleteInput(index)}>
                        <Dicon name="delete" size={40} color={theme == 'light' ? '#2C2C2C' : '#fff'} />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
            <View>
                    <View>
                    <Text style={{marginTop:height*0.002,marginLeft:width*0.06,fontSize: 10,
              fontFamily: 'Poppins-SemiBold',
              color: 'red',}}>{error.servicearea}</Text>
                      </View>
                    </View>

            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily:'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 16,
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
                  value="1"
                  status={checked === '1' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('1');
                    handleValues('1', 'status');
                  }}
                />
                <Text style={{marginRight: 50,
              color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
                <RadioButton
                  value="2"
                  status={checked === '0' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('0');
                    handleValues('0', 'status');
                  }}
                />
                <Text style={{color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Icon
                name={'camera'}
                size={50}
                color="#4171E1"
                buttonText={'Select File'}
                bgColor="#95a5a6"
                btnWidth={0.4}
                marginTop={20}
                onPress={() => captureImage('photo')}
              />
              <Text
                style={{
                  color: '#4171E1',
                  fontSize: 16,
                  marginTop: 20,
                }}>
               {strings.TAKE_PICTURE}
              </Text>
            </View>
            <View
              style={{marginTop: 10, alignItems: 'center', marginBottom: 10}}>
              {filePath ? (
                <Image
                  source={{uri: filePath.uri}}
                  style={{width: 100, height: 100}}
                />
              ) : null}
            </View>
            <View style={{alignItems: 'center'}}>
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
      </ScrollView>
    </ImageBackground>
  
  );
}

const styles = StyleSheet.create({
  textContainer: {
    width: width * 0.9,
    backgroundColor: COLORS.inputColor,
    borderColor: COLORS.inputColor,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
