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
  Dimensions,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../uicomponents/AppButton';
import Icon from 'react-native-vector-icons/Entypo';
import Input from '../../uicomponents/Input';
import {postDataAxios, getData, postData} from '../../Connection/FetchServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';
import Inputs from '../../uicomponents/Inputs';
import stateCity from '../stateCity.json';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';

const {width, height} = Dimensions.get('window');
export default function CreateEmployee({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    mobileno: '',
    address: '',
    store_id: '',
    emailid: '',
    password: '',
    aadharno: '',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    status: '',
    salary: '',
    designation: '',
  });
  const [error, setError] = useState({});
  const [store, setStore] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

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
    }
    if (!inputs.aadharno) {
      handleErrors('Please Input aadhar no.', 'aadharno');
      isValid = false;
    } else if (inputs.aadharno.length) {
      if (isNaN(inputs.aadharno.length) || inputs.aadharno.length < 12) {
        handleErrors('Please Input valid aadhar no.', 'aadharno');
        isValid = false;
      }
    }
    if (!inputs.salary) {
      handleErrors('Please Input Name', 'salary');
      isValid = false;
    } else if (inputs.salary.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.salary)) {
        handleErrors('Please Input valid salary', 'salary');
        isValid = false;
      }
    }
    if (!inputs.designation) {
      handleErrors('Please Input Name', 'designation');
      isValid = false;
    } else if (inputs.designation.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.designation)) {
        handleErrors('Please Input valid designation', 'designation');
        isValid = false;
      }
    }
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
    }
    if (!inputs.address) {
      handleErrors('Please Input Address', 'address');
      isValid = false;
    } else if (inputs.address.length) {
      if (!/^[a-zA-Z0-9\s,.'-]{3,}$/.test(inputs.address)) {
        handleErrors('Please Input Valid Address', 'address');
        isValid = false;
      }
    }
    if (!storelist) {
      handleErrors('Please Select Store Name', 'store_id');
      isValid = false;
    }
    return isValid;
  };

  const states = Object.keys(stateCity);
  const [getCities, setCities] = useState([]);

  const handleState = state => {
    const cities = stateCity[state];
    setCities(cities);
  };

  const handleCity = city => {};

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
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {

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
      setFilePath(response);
    });
  };

  const [checked, setChecked] = React.useState('first');

  const fetchActiveStore = async store_id => {
    const result = await getData('store/display/active', {store_id: store_id});
    setStore(result.data);
  };

  useEffect(function () {
    fetchActiveStore();
  }, []);
  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('name', inputs.name);
      formdata.append('store_id', storelist);
      formdata.append('mobileno', inputs.mobileno);
      formdata.append('emailid', inputs.emailid);
      formdata.append('address', inputs.address);
      formdata.append('password', inputs.password);
      formdata.append('addhar_no', inputs.aadharno);
      formdata.append('state', inputs.state);
      formdata.append('city', inputs.city);
      formdata.append('status', inputs.status);
      formdata.append('salary', inputs.salary);
      formdata.append('designation', inputs.designation);
      formdata.append('added_by', asyncData ? asyncData.name : superAdmin.name);
      formdata.append('picture', {
        ...filePath,
      });
      setHideButton(true);
      const result = await postDataAxios('employee', formdata);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.TEAM_CREATED_SUCCESSFULLY,
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
    setHideButton(false);
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const [storelist, setStoreList] = useState('');
  const handleStore = itemValue => {
    setStoreList(itemValue);
  };
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
        flex: 1,
      }}>
      <ScrollView style={{flex: 1}}>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              marginTop: 15,
              marginBottom: 5,
            }}>
            {strings.CREATE_TEAM}
          </Text>
          <View
            style={{
              alignItems: 'center',
            }}>
            {error.store_id ? (
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: width * 1.5,
                    margin: 5,
                  }}>
                  <Picker
                    selectedValue={storelist}
                    style={{
                      height: 50,
                      width: '60%',
                      backgroundColor:
                        theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                    }}
                    onValueChange={itemValue => {
                      handleStore(itemValue);
                    }}>
                    <Picker.Item label={'-Select Store-'} value={''} />
                    {store.map(itm => {
                      console.log('===>', itm);
                      return (
                        <Picker.Item label={itm.name} value={itm.store_id} />
                      );
                    })}
                  </Picker>
                </View>
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 11,
                    marginLeft: width * 0.32,
                  }}>
                  {error.store_id}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: width * 1.5,
                  margin: 5,
                }}>
                <Picker
                  selectedValue={storelist}
                  style={{
                    height: 50,
                    width: '60%',
                    backgroundColor:
                      theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                  }}
                  onValueChange={itemValue => {
                    handleStore(itemValue);
                  }}>
                  <Picker.Item label={'-Select Store-'} value={''} />
                  {store.map(itm => {
                    return (
                      <Picker.Item label={itm.name} value={itm.store_id} />
                    );
                  })}
                </Picker>
              </View>
            )}
            <Input
              error={error.name}
              onFocus={() => handleErrors(null, 'name')}
              onChangeText={txt => handleValues(txt.trimStart(), 'name')}
              placeholder={strings.NAME}
              autoCompleteType="off"
              simpleLineIcons="user"
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

            <Input
              error={error.emailid}
              onFocus={() => handleErrors(null, 'emailid')}
              onChangeText={txt => handleValues(txt.trimStart(), 'emailid')}
              placeholder={strings.EMAILID}
              autoCompleteType="off"
              fontisto="email"
              keyboardType="email-address"
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
              error={error.password}
              onFocus={() => handleErrors(null, 'password')}
              onChangeText={txt => handleValues(txt, 'password')}
              placeholder={strings.PASSWORD}
              autoCompleteType="off"
              simpleLineIcons="lock"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Input
              error={error.aadharno}
              onFocus={() => handleErrors(null, 'aadharno')}
              onChangeText={txt => handleValues(txt, 'aadharno')}
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
                defaultButtonText="Gwalior"
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
                  marginTop: 13,
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
                value="Yes"
                status={checked == 1 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(1);
                  handleValues(1, 'status');
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
                value="No"
                status={checked == 0 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(0);
                  handleValues(0, 'status');
                }}
              />
              <Text
                style={{
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.NO}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              error={error.salary}
              onFocus={() => handleErrors(null, 'salary')}
              onChangeText={txt => handleValues(txt, 'salary')}
              placeholder={strings.SALARY}
              maxLength={7}
              autoCompleteType="off"
              fontAwesome="rupee"
              keyboardType="numeric"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
            <Input
              error={error.designation}
              onFocus={() => handleErrors(null, 'designation')}
              onChangeText={txt => handleValues(txt.trimStart(), 'designation')}
              placeholder={strings.DESIGNATION}
              autoCompleteType="off"
              simpleLineIcons="user"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
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
          <View style={{marginTop: 10, alignItems: 'center', marginBottom: 10}}>
            {filePath ? (
              <Image
                source={{uri: filePath.uri}}
                style={{width: 100, height: 100}}
              />
            ) : null}
          </View>
          <View style={{alignItems: 'center'}}>
            {hideButton ? (
              <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
            ) : (
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
  );
}
