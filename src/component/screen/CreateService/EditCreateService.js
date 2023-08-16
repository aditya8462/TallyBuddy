/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Appearance,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import AnimatedLottieView from 'lottie-react-native';
import SweetAlert from 'react-native-sweet-alert';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Inputs from '../../uicomponents/Inputs';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';

import {Picker} from '@react-native-picker/picker';

const {width, height} = Dimensions.get('window');

export default function EditCreateService({navigation, route, props}) {
  const [inputs, setInputs] = useState({
    typesofservice_id: '',
    description: '',
    customername: '',
    mobileno: '',
    address: '',
    pincode: '',
    status: 'New',
  });

  const [error, setError] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [serviceType, setServiceType] = useState([]);
  const [value, setValue] = useState(null);
  const [loader, setLoader] = useState(true);
  const [stat, setStat] = useState('');
  const status = ['New', 'In-Progress', 'Completed', 'Closed'];
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false);
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const validate = () => {
    var isValid = true;
    if (!typeofservicelist) {
      handleErrors('Please Select Service Type', 'service_id');
      isValid = false;
    }

    if (!inputs.description) {
      handleErrors('Please Input Description', 'description');
      isValid = false;
    } else if (inputs.description.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.description)) {
        handleErrors('Please Input valid description', 'description');
        isValid = false;
      }
      console.log('here');
    }
    if (!inputs.customername) {
      handleErrors('Please Input Name', 'customername');
      isValid = false;
    } else if (inputs.customername.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.customername)) {
        handleErrors('Please Input valid name', 'customername');
        isValid = false;
      }
      console.log('here');
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

    if (!inputs.pincode) {
      handleErrors('Please Input Pincode', 'pincode');
      isValid = false;
    } else if (inputs.pincode.length) {
      if (!/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(inputs.pincode)) {
        handleErrors('Please Input Valid pincode', 'pincode');
        isValid = false;
      }
      console.log(isValid);
    }
    return isValid;
  };

  const handleDelete = async () => {
    const result = await deleteData('services/' + route.params.id);
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

  const fetchServiceType = async typesofservice_id => {
    const result = await getData('typesofservice', {
      typesofservice_id: typesofservice_id,
    });
    setServiceType(result.data);
  };
  const fetchServices = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('services/' + route.params.id);
    if (result.status) {
      setInputs({
        typesofservice_id: result.data.typesofservices_id,
        description: result.data.description,
        customername: result.data.customername,
        mobileno: result.data.mobileno,
        address: result.data.address,
        pincode: result.data.pincode,
        status: result.data.status,
      });
      setTypeOfServiceList(String(result.data.typesofservices_id));
    }
    setLoader(false);
  };
  useEffect(
    function () {
      fetchServiceType();
      fetchServices();
      selectedLng();
    },
    [isFocused],
  );

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        typesofservices_id: typeofservicelist,
        description: inputs.description,
        customername: inputs.customername,
        mobileno: inputs.mobileno,
        address: inputs.address,
        pincode: inputs.pincode,
        status: inputs.status,
        added_by: asyncData ? asyncData.name : superAdmin.name,
      };
      setHideButton(true);
      const result = await putData('services/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.CUSTOMER_SERVICE_EDITED_SUCCESSFULLY,
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
  const [typeofservicelist, setTypeOfServiceList] = useState('');
  const handleServiceType = itemValue => {
    setTypeOfServiceList(itemValue);
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
      <ScrollView style={{flex: 1}}>
        <>
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
                {strings.EDIT_SERVICE_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                }}>
                {error.service_id ? (
                  <View style={{marginTop: 5}}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'Poppins-Bold',
                        textAlign: 'left',
                        color: theme == 'light' ? 'black' : '#fff',
                        paddingLeft: width * 0.31,
                      }}>
                      {strings.TYPE_OF_SERVICE}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      {serviceType.length ? (
                        <Picker
                          selectedValue={typeofservicelist}
                          style={{
                            height: 50,
                            width: '60%',
                            backgroundColor:
                              theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                          }}
                          onValueChange={itemValue => {
                            handleServiceType(itemValue);
                          }}>
                          <Picker.Item
                            label={'-Select Service Type-'}
                            value={''}
                          />
                          {serviceType.map(itm => {
                            return (
                              <Picker.Item
                                label={itm.name}
                                value={String(itm.typesofservice_id)}
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
                      {error.service_id}
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
                        {strings.TYPE_OF_SERVICE}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      {serviceType.length ? (
                        <Picker
                          selectedValue={typeofservicelist}
                          style={{
                            height: 50,
                            width: '60%',
                            backgroundColor:
                              theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                          }}
                          onValueChange={itemValue => {
                            handleServiceType(itemValue);
                          }}>
                          <Picker.Item
                            label={'-Select Service Type-'}
                            value={''}
                          />
                          {serviceType.map(itm => {
                            return (
                              <Picker.Item
                                label={itm.name}
                                value={String(itm.typesofservice_id)}
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
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Inputs
                  error={error.description}
                  onFocus={() => handleErrors(null, 'description')}
                  onChangeText={txt =>
                    handleValues(txt.trimStart(), 'description')
                  }
                  placeholder={strings.DESCRIPTION}
                  multiline
                  numberOfLines={5}
                  height={120}
                  value={inputs.description}
                  labelTxt={strings.DESCRIPTION}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.customername}
                  onFocus={() => handleErrors(null, 'customername')}
                  onChangeText={txt =>
                    handleValues(txt.trimStart(), 'customername')
                  }
                  placeholder={strings.CUSTOMER_NAME}
                  value={inputs.customername}
                  labelTxt={strings.CUSTOMER_NAME}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.mobileno}
                  onFocus={() => handleErrors(null, 'mobileno')}
                  onChangeText={txt =>
                    handleValues(txt.trimStart(), 'mobileno')
                  }
                  placeholder={strings.MOBILE}
                  maxLength={10}
                  value={String(inputs.mobileno)}
                  labelTxt={strings.MOBILE}
                  keyboardType="numeric"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.address}
                  onFocus={() => handleErrors(null, 'address')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'address')}
                  placeholder={strings.ADDRESS}
                  multiline
                  numberOfLines={5}
                  height={120}
                  value={inputs.address}
                  labelTxt={strings.ADDRESS}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.pincode}
                  onFocus={() => handleErrors(null, 'pincode')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'pincode')}
                  placeholder={strings.PINCODE}
                  value={inputs.pincode}
                  labelTxt={strings.PINCODE}
                  maxLength={6}
                  keyboardType="numeric"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: 'Poppins-Bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 16,
                    marginLeft: 20,
                  }}>
                  {strings.STATUS}
                </Text>
                <SelectDropdown
                  data={status}
                  onSelect={selectedItem => {
                    handleValues(selectedItem, 'status');
                  }}
                  defaultValue={inputs.status}
                  value={inputs.status}
                  buttonTextAfterSelection={selectedItem => {
                    return selectedItem;
                  }}
                  rowTextForSelection={item => {
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
                  defaultButtonText="Select Status"
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
              <View style={{alignItems: 'center'}}>
                {hideButton ? (
                  <AppButton
                    buttonText={strings.EDIT}
                    bgColor={COLORS.disable}
                  />
                ) : (
                  <AppButton
                    onPress={() => handleEdit()}
                    buttonText={strings.EDIT}
                    bgColor={COLORS.btnColor}
                  />
                )}
                <AppButton onPress={askDelete} buttonText={strings.DELETE} />
              </View>
              <View style={{marginTop: 10}} />
            </View>
          )}
        </>
      </ScrollView>
    </ImageBackground>
    </ScrollView>
  );
}

