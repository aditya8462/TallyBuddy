/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Inputs from '../../uicomponents/Inputs';
import {RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../uicomponents/AppButton';
import Icon from 'react-native-vector-icons/Entypo';
import Input from '../../uicomponents/Input';
import SweetAlert from 'react-native-sweet-alert';
import {
  getData,
  deleteData,
  putDataAxios,
  ServerURL,
} from '../../Connection/FetchServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import stateCity from '../stateCity.json';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';
import {Picker} from '@react-native-picker/picker';
const {width, height} = Dimensions.get('window');
export default function EditEmployee({navigation, route}) {
  const [inputs, setInputs] = useState({
    name: '',
    mobileno: '',
    address: '',
    store_id: '',
    emailid: '',
    password: '',
    addhar_no: '',
    state: '',
    city: '',
    status: '',
    salary: '',
    designation: '',
    picture: '',
  });
  const [error, setError] = useState({});
  const [store, setStore] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const isFocused = useIsFocused();
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [hideButton, setHideButton] = useState(false);

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

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
    console.log('2');
    if (!inputs.password) {
      handleErrors('Please Input password', 'password');
      isValid = false;
    }
    console.log('3');

    if (!inputs.addhar_no) {
      handleErrors('Please Input aadhar no.', 'addhar_no');
      isValid = false;
    } else if (inputs.addhar_no.length) {
      if (isNaN(inputs.addhar_no.length) || inputs.addhar_no.length < 12) {
        handleErrors('Please Input valid aadhar no.', 'addhar_no');
        isValid = false;
      }
    }
    console.log('4');

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
      console.log('1');
    }
    console.log('5');

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
    console.log('6');

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
      console.log(isValid);
    }
    console.log('7');

    if (!storelist) {
      handleErrors('Please Select Store', 'store_id');
      isValid = false;
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
    if (isCameraPermitted && isStoragePermitted) {
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
    }
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
  const [loader, setLoader] = useState(true);
  const handleDelete = async () => {
    const result = await deleteData('employee/' + route.params.id);
    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.DELETED_SUCCESSFULLY,
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
  };

  const askDelete = () => {
    Alert.alert('Warning !', 'Are you sure want to delete', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => handleDelete(),
      },
    ]);
  };

  const fetchEmployeeDetails = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('employee/' + route.params.id);
    console.log(result);
    if (result.status) {
      console.log(result.data.state);
      handleState(result.data.state);
      setInputs({
        name: result.data.name,
        mobileno: result.data.mobileno,
        emailid: result.data.emailid,
        address: result.data.address,
        password: result.data.password,
        addhar_no: result.data.addhar_no,
        state: result.data.state,
        city: result.data.city,
        status: result.data.status,
        salary: result.data.salary,
        designation: result.data.designation,
        picture: result.data.picture,
      });
      setStoreList(String(result.data.store_id));
    }
    setLoader(false);
  };

  
  const fetchStore = async store_id => {
    const result = await getData('store', {store_id: store_id});
    setStore(result.data);
  };
  useEffect(
    function () {
      fetchEmployeeDetails();
      fetchStore();
      selectedLng();
    },
    [isFocused],
  );

  const handleEdit = async () => {
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
      formdata.append('addhar_no', inputs.addhar_no);
      formdata.append('state', inputs.state);
      formdata.append('city', inputs.city);
      formdata.append('status', inputs.status);
      formdata.append('salary', inputs.salary);
      formdata.append('designation', inputs.designation);
      formdata.append('added_by', asyncData ? asyncData.name : superAdmin.name);

      if (filePath) {
        formdata.append('picture', {
          ...filePath,
        });
      }
      setHideButton(true);
      const result = await putDataAxios(
        'employee/' + route.params.id,
        formdata,
      );
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.TEAM_EDITED_SUCCESSFULLY,
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

  const [storelist,setStoreList]=useState('')
  const handleStore=(itemValue)=>{
   setStoreList(itemValue)
  }
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
      <ScrollView>
        <View>
          {loader ? (
            <AnimatedLottieView
              source={require('../../assets/TallyBudy Loader.json')}
              autoPlay
              loop
              style={{height: 100, alignSelf: 'center', display: 'flex'}}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  paddingTop: 10,
                  paddingLeft: 5,
                }}>
                {strings.EDIT_TEAM_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                }}>
                {/* <View
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
                </View> */}
                   {error.store_id ? (
                  <View style={{marginTop: 5}}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'Poppins-Bold',
                        textAlign: 'left',
                        color: theme == 'light' ? 'black' : '#fff',
                        paddingLeft: width * 0.31,
                      }}>
                      {strings.STORE}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      {store.length ? (
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
                              <Picker.Item
                                label={itm.name}
                                value={String(itm.store_id)}
                              />
                            );
                          })}
                        </Picker>
                      ) : (
                        <></>
                      )}
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginLeft: width * 0.33,
                      }}>
                      {error.store_id}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={{alignSelf: 'flex-start'}}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'Poppins-Bold',
                          textAlign: 'left',
                          color: theme == 'light' ? 'black' : '#fff',
                          paddingLeft: 18,
                        }}>
                        {strings.STORE}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      {store.length ? (
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
                              <Picker.Item
                                label={itm.name}
                                value={String(itm.store_id)}
                              />
                            );
                          })}
                        </Picker>
                      ) : (
                        <></>
                      )}
                    </View>
                  </>
                )}
                <Input
                  error={error.name}
                  onFocus={() => handleErrors(null, 'name')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                  placeholder={strings.NAME}
                  value={inputs.name}
                  labelTxt={strings.NAME}
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
                  maxLength={10}
                  value={inputs.mobileno}
                  labelTxt={strings.MOBILE}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.emailid}
                  onFocus={() => handleErrors(null, 'emailid')}
                  onChangeText={txt => handleValues(txt, 'emailid')}
                  placeholder={strings.EMAILID}
                  value={inputs.emailid}
                  labelTxt={strings.EMAILID}
                  keyboardType="email-address"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Inputs
                  error={error.address}
                  onFocus={() => handleErrors(null, 'address')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'address')}
                  placeholder={strings.ADDRESS}
                  value={inputs.address}
                  multiline
                  numberOfLines={5}
                  height={120}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  labelTxt={strings.ADDRESS}
                />
                <Input
                  error={error.password}
                  onFocus={() => handleErrors(null, 'password')}
                  onChangeText={txt => handleValues(txt, 'password')}
                  placeholder={strings.PASSWORD}
                  value={inputs.password}
                  labelTxt={strings.PASSWORD}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.addhar_no}
                  onFocus={() => handleErrors(null, 'addhar_no')}
                  onChangeText={txt => handleValues(txt, 'addhar_no')}
                  placeholder={strings.AADHAR_NO}
                  maxLength={12}
                  keyboardType="numeric"
                  value={inputs.addhar_no}
                  labelTxt={strings.AADHAR_NO}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.STATE}
                  </Text>
                  <SelectDropdown
                    data={states}
                    onSelect={(selectedItem, index) => {
                      handleState(selectedItem);
                      handleValues(selectedItem, 'state');
                      handleValues('', 'city');
                    }}
                    defaultValue={inputs.state}
                    value={inputs.state}
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
                      alignSelf: 'center',
                    }}
                    buttonTextStyle={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      textAlign: 'left',
                      fontSize: 14,
                    }}
                    defaultButtonText="Select State"
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
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'left',
                      marginTop: 10,
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.CITY}
                  </Text>
                  <SelectDropdown
                    data={getCities}
                    onSelect={selectedItem => {
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
                      alignSelf: 'center',
                    }}
                    buttonTextStyle={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      textAlign: 'left',
                      fontSize: 14,
                    }}
                    {...(inputs.city
                      ? {defaultButtonText: inputs.city || 'Select City'}
                      : {defaultButtonText: 'Select City'})}
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
                    fontFamily: 'Poppins-Bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
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
                    status={
                      checked == '1' || inputs.status == '1'
                        ? 'checked'
                        : 'unchecked'
                    }
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
                    value="2"
                    status={
                      checked == '2' || inputs.status == '2'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => {
                      setChecked('2');
                      handleValues('2', 'status');
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
                  keyboardType="numeric"
                  value={String(inputs.salary)}
                  labelTxt={strings.SALARY}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.designation}
                  onFocus={() => handleErrors(null, 'designation')}
                  onChangeText={txt =>
                    handleValues(txt.trimStart(), 'designation')
                  }
                  placeholder={strings.DESIGNATION}
                  value={inputs.designation}
                  labelTxt={strings.DESIGNATION}
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
              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                {filePath ? (
                  <Image
                    source={{uri: filePath.uri}}
                    style={{width: 100, height: 100}}
                  />
                ) : (
                  <Image
                    source={{uri: `${ServerURL}/images/${inputs.picture}`}}
                    style={{width: 100, height: 100}}
                  />
                )}
              </View>
              <View style={{alignItems: 'center'}}>
                {hideButton ? (
                  <AppButton
                    buttonText={strings.EDIT}
                    bgColor={COLORS.disable}
                  />
                ) : (
                  <AppButton
                    onPress={handleEdit}
                    buttonText={strings.EDIT}
                    bgColor={COLORS.btnColor}
                  />
                )}
                <AppButton onPress={askDelete} buttonText={strings.DELETE} />
              </View>
              <View style={{marginTop: 10}} />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
