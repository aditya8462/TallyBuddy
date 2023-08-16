/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {postData, getData} from '../../Connection/FetchServices';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../helper/Colors';
import Inputs from '../../uicomponents/Inputs';
import SweetAlert from 'react-native-sweet-alert';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';

import {Picker} from '@react-native-picker/picker';
import MCI from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { getStoreData } from '../../storage/AsyncStorage';


const {width, height} = Dimensions.get('window');

export default function CreateService({navigation}) {
  const [inputs, setInputs] = useState({
    typesofservice_id: '',
    description: '',
    billno:'',
    date:'',
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
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)


  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  function onDateSelected(event, value) {
    hideDatePicker();
    if (event.type == 'set') {
      setStartDate(value);
    }
  }
  const status = ['New', 'In-Progress', 'Completed', 'Closed'];

  const handleStatus = status => {};

  const validate = () => {
    var isValid = true;
    if (!servicetypelist) {
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

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let body = {
        typesofservices_id: servicetypelist,
        description: inputs.description,
        customername: inputs.customername,
        mobileno: inputs.mobileno,
        address: inputs.address,
        pincode: inputs.pincode,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await postData('services', body);
      if (result.status) {
        console.log(JSON.stringify(result));
        SweetAlert.showAlertWithOptions({
          title: strings.CREATE_CUSTOMER_SERVICE,
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

  const fetchActiveTypeOfService = async typesofservice_id => {
    const result = await getData('typesofservice/display/active', {
      typesofservice_id: typesofservice_id,
    });
    setServiceType(result.data);
  };

  useEffect(function () {
    fetchActiveTypeOfService();
    selectedLng();
  }, [isFocused]);

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  
  const [servicetypelist,setServiceTypeList]=useState('')
  const handleServiceType=(itemValue)=>{
   setServiceTypeList(itemValue)
  }
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
          <View style={{flex:1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                marginTop: 10,
                padding: 5,
              }}>
              {strings.CREATE_CUSTOMER_SERVICE}
            </Text>
            <View
              style={{
                alignItems: 'center',
              }}>
              {error.service_id ? (
               <View style={{marginTop: 10}}>
               <View
                 style={{
                   flexDirection: 'row',
                   justifyContent: 'center',
                   width: width * 1.5,
                   margin: 5,
                 }}>
                  <Picker
                      selectedValue={servicetypelist}
                       style={{
                         height: 50,
                         width: '60%',
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                          handleServiceType(itemValue)
                        }}>
                       <Picker.Item label={'-Select Service Type-'} value={''} />
                       {serviceType.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.name}
                             value={itm.typesofservice_id}
                           />
                         );
                       })}
                     </Picker>
                     </View>
                   <Text
                     style={{
                       color: 'red',
                       fontFamily: 'Poppins-Medium',
                       fontSize: 11,
                       marginLeft:width*0.32
                     }}>
                     {error.service_id}
                   </Text>
                 </View>
              ) : (
                <View><View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: width * 1.5,
                }}>
              
              <Picker
             selectedValue={servicetypelist}
            style={{
              height: 50,
              width: '60%',
              backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            }}
            onValueChange={itemValue => {
            handleServiceType(itemValue)
            }}>
            <Picker.Item label={'-Select Service Type-'} value={''} />
            {serviceType.map(itm => {
              return (
                <Picker.Item
                  label={itm.name}
                  value={itm.typesofservice_id}
                />
              );
            })}
          </Picker>
          </View></View>
              )}

               {/* <Input
                error={error.date}
                onFocus={() => handleErrors(null, 'date')}
                onChangeText={txt => handleValues(txt, 'date')}
                placeholder={strings.PURCHASE_DATE}
                autoCompleteType="off"
                fontisto="date"

              /> */}
               <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent:'space-between',
                  backgroundColor:theme == 'light'?COLORS.inputColor:'#2C2C2C',
                  padding: 10,
                  width: '90%',
                  borderRadius: 6,
                  marginTop:10
                }}
                onPress={() => showDatePicker()}>
                <Text label="Date" mode="outlined" editable={false} style={{color:theme == 'light'?'#2C2C2C':'white',}}>
                  {moment(new Date()).format('DD-MMMM-YYYY')}
                </Text>
                <MCI name="calendar" size={16} color={COLORS.btnColor} />
              </TouchableOpacity>
              {isDatePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode={'date'}
          display={'default'}
          maximumDate={new Date()}
          is24Hour={true}
          onChange={onDateSelected}
          textColor="black"
        />
      )}
              <Inputs
                error={error.description}
                onFocus={() => handleErrors(null, 'description')}
                onChangeText={txt => handleValues(txt.trimStart(), 'description')}
                placeholder={strings.DESCRIPTION}
                autoCompleteType="off"
                fontAwesome5="file"
                multiline
                numberOfLines={5}
                height={120}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.customername}
                onFocus={() => handleErrors(null, 'customername')}
                onChangeText={txt => handleValues(txt.trimStart(), 'customername')}
                placeholder={strings.CUSTOMER_NAME}
                autoCompleteType="off"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                simpleLineIcons="user"
              />
              <Input
                error={error.mobileno}
                onFocus={() => handleErrors(null, 'mobileno')}
                onChangeText={txt => handleValues(txt.trimStart(), 'mobileno')}
                placeholder={strings.MOBILE}
                maxLength={10}
                autoCompleteType="off"
                keyboardType="numeric"
                simpleLineIcons="phone"
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
                error={error.pincode}
                onFocus={() => handleErrors(null, 'pincode')}
                onChangeText={txt => handleValues(txt.trimStart(), 'pincode')}
                placeholder={strings.PINCODE}
                autoCompleteType="off"
                simpleLineIcons="home"
                keyboardType='numeric'
                maxLength={6}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View>
              <View>
                <SelectDropdown
                  data={status}
                  onSelect={(selectedItem, index) => {
                    handleStatus(selectedItem);
                    handleValues(selectedItem, 'status');
                  }}
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
                    marginTop: 10,
                    alignSelf: 'center',
                  }}
                  buttonTextStyle={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    textAlign: 'left',
                    fontSize: 14,
                  }}
                  defaultButtonText= {strings.NEW}
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
            <View style={{alignSelf: 'center'}}>
            {hideButton?
              ( <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
              />
              ) :(
                <AppButton
                onPress={handleCreate}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
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

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderColor: COLORS.inputColor,
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
    padding: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: COLORS.inputColor,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  selectedTextStyle: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
