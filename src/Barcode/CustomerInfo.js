/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../component/uicomponents/AppButton.js';
import Input from '../component/uicomponents/Input.js';
import {
  postDataAxios,
  getData,
  postData,
} from '../component/Connection/FetchServices.js';
import SweetAlert from 'react-native-sweet-alert';
import stateCity from '../component/screen/stateCity.json';
import COLORS from '../component/helper/Colors.js';
import FA from 'react-native-vector-icons/FontAwesome';

import {useDispatch, useSelector} from 'react-redux';

import MCI from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getStoreData} from '../component/storage/AsyncStorage.js';
import Inputs from '../component/uicomponents/Inputs.js';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../changeLanguage/ChangeLanguage.js';
import strings from '../changeLanguage/LocalizedString.js';
import AnimatedLottieView from 'lottie-react-native';
const {width, height} = Dimensions.get('window');

export default function CustomerInfo({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    mobileno: '',
    alternatemobile: '',
    address: '',
    store_id: '',
    emailid: '',
    password: '',
    aadharno: '',
    comment: '',
    discount: 0,
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    status: '',
    designation: '',
    cash: 0,
    chequeno: '',
    cbankname: '',
    camount: 0,
    upi: 0,
    fbank: '',
    famount: 0,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [error, setError] = useState({});
  const [banks, setBanks] = useState([]);
  const [isFocusBank, setIsFocusBank] = useState(false);
  const [employee, setEmployee] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [startDate2, setStartDate2] = useState(null);
  const [loader, setLoader] = useState(true);
  const [value, setValue] = useState(null);
  const [hideButton, setHideButton] = useState(false)
  const product = useSelector(state => state.cart);
  const productDetails = Object.values(product);
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const finalPrice = productDetails.reduce(
    (acc, item) => {
      acc.mrp += Number(item.costprice) * Number(item?.quantity ?? 1);
      item.subItemList.map(sitem => {
        acc.mrp += Number(sitem.costprice) * Number(sitem?.qty);
      });
      return acc;
    },
    {mrp: 0},
  );
  function onDateSelected(event, value) {
    setDatePickerVisibility(false);
    if (event.type == 'set') {
      setStartDate(value);
    }
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  function onDateSelected2(event, value) {
    setDatePickerVisibility2(false);
    if (event.type == 'set') {
      setStartDate2(value);
    }
  }

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

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

    if (!startDate) {
      handleErrors('Please select delivery date', 'startDate');
      isValid = false;
      console.log(4);
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

  const [checked, setChecked] = React.useState('first');


  useEffect(function () {
    fetchEmployee();
    if(productDetails.length==0){
      navigation.navigate('ClockIn')
    }
  }, [isFocused]);
  
  const fetchEmployee = async () => {
    setLoader(true);
    var result = await getStoreData('EMPLOYEE');
    if (result) {
      setEmployee(result);
    }
    setLoader(false);
  };

  const SearchCustomer = async mob => {
    setLoader(true);
    var result = await postData('bill/searchCustomer?mobile=' + mob);
    if (result.status) {
      handleValues(result.data.cname, 'name');
      handleValues(result.data.cmobile, 'mobileno');
      handleValues(result.data.caddress, 'address');
      handleValues(result.data.ccity, 'city');
      handleValues(result.data.cstate, 'state');
      handleValues(result.data.cemail, 'emailid');
      handleValues(result.data.calternatemobile, 'alternatemobile');
    } else {
      SweetAlert.showAlertWithOptions({
        title: result.message,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
    }
    setLoader(false);
  };
  const handleDelete = item => {
    dispatch({type: 'CLEAR_CART'});
  };
  const handleSubmit = async () => {
    if (
      finalPrice.mrp -
        Number(inputs.discount) -
        Number(inputs.cash) -
        Number(inputs.camount) -
        Number(inputs.upi) -
        Number(inputs.famount) <
      0
    ) {
      SweetAlert.showAlertWithOptions({
        title: "Amount can't be negative",
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
      return;
    }
    if (validate()) {
      const productlist = [];
      productDetails.map(item => {
        productlist.push(item);
        item.subItemList.map(sitem => {
          productlist.push({...item, ...sitem,quantity:sitem.qty});
        });
      });
      var employees = await getStoreData('EMPLOYEE');
      var body = {
        cname: inputs.name,
        cmobile: inputs.mobileno,
        cemail: inputs.emailid,
        caddress: inputs.address,
        cstate: inputs.state,
        ccity: inputs.city,
        calternatemobile: inputs.alternatemobile,
        deliverydate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
        employeeid: employees.employee_id,
        storeid: employees.store_id,
        mrp: finalPrice.mrp,
        discount: inputs.discount,
        total: finalPrice.mrp - Number(inputs.discount),
        cash: inputs.cash,
        chequeno: inputs.chequeno,
        chequebankname: inputs.cbankname,
        chequeamount: inputs.camount,
        upi: inputs.upi,
        financebank: inputs.fbank,
        financeamount: inputs.famount,
        remainingamount:
          finalPrice.mrp -
          Number(inputs.cash) -
          Number(inputs.camount) -
          Number(inputs.upi) -
          Number(inputs.famount) -
          Number(inputs.discount),
        productlist,
        remainingpaymentdate: moment(startDate2).format('YYYY-MM-DD HH:mm:ss'),
        comments: inputs.comment,
        added_by: employees.name,
      };
      // console.log(JSON.stringify(body))
      setHideButton(true)
       const result = await postData('bill/bill', body);

       if (result.status) {
         SweetAlert.showAlertWithOptions({
           title: strings.ORDERED_SUCCESSFULLY,
           confirmButtonTitle: 'OK',
           confirmButtonColor: '#000',
           otherButtonTitle: 'Cancel',
           otherButtonColor: '#dedede',
           style: 'success',
           cancellable: true,
         });
         navigation.navigate('BillView', {
           bill_id: result.data,
         });
         handleDelete();
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

  const fetchBanks = async () => {
    const result = await getData('banks');
    setBanks(result.data);
  };

  useEffect(
    function () {
      fetchBanks();
      selectedLng();
    },
    [],
  );


  const BankDropdownComponent = bank_id => {
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={{
            height: 50,
            width: width * 0.9,
            borderColor: 'white',
            borderRadius: 8,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            padding: 8,
          }}
          placeholderStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          selectedTextStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          containerStyle={{
            flex: 1,
            backgroundColor: theme == 'light' ? '#ecf0f1' : 'black',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={banks}
          maxHeight={200}
          labelField="name"
          valueField="bank_id"
          placeholder={!isFocusBank ? strings.SELECT_BANK : '...'}
          value={inputs.bank_id}
          onFocus={() => setIsFocusBank(true)}
          onBlur={() => setIsFocusBank(false)}
          onChange={item => {
            handleValues(item.bank_id, 'fbank');
            setIsFocusBank(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusBank}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  if (loader) {
    return (
      <AnimatedLottieView
        source={require('../component/assets/TallyBudy Loader.json')}
        autoPlay
        loop
        style={{height: 100, alignSelf: 'center', display: 'flex'}}
      />
    );
  }

  return (
    <ImageBackground
      source={require('../component/assets/background.png')}
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
              fontFamily:'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              paddingTop: 10,
              marginBottom: 10
            }}>
            {strings.CUSTOMER_DETAILS}
          </Text>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              error={error.name}
              value={inputs.name}
              onFocus={() => handleErrors(null, 'name')}
              onChangeText={txt => handleValues(txt.trimStart(), 'name')}
              placeholder={strings.NAME}
              autoCompleteType="off"
              simpleLineIcons="user"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />

            <Input
              error={error.mobileno}
              value={inputs.mobileno}
              onFocus={() => handleErrors(null, 'mobileno')}
              onChangeText={txt => {
                handleValues(txt.trimStart(), 'mobileno');
                if (txt.length == 10) SearchCustomer(txt);
              }}
              placeholder={strings.MOBILE}
              autoCompleteType="off"
              simpleLineIcons="phone"
              keyboardType="numeric"
              placeholderTextColor= {theme== 'light'? "black":'white'}
              maxLength={10}
            />
            <Input
              error={error.alternatemobile}
              value={inputs.alternatemobile}
              onFocus={() => handleErrors(null, 'alternatemobile')}
              onChangeText={txt => handleValues(txt, 'alternatemobile')}
              placeholder={strings.ALTERNATE_MOBILE}
              autoCompleteType="off"
              simpleLineIcons="phone"
              keyboardType="numeric"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.emailid}
              value={inputs.emailid}
              onFocus={() => handleErrors(null, 'emailid')}
              onChangeText={txt => handleValues(txt.trimStart(), 'emailid')}
              placeholder={strings.EMAILID}
              autoCompleteType="off"
              fontisto="email"
              keyboardType="email-address"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Inputs
              error={error.address}
              value={inputs.address}
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

          <View style={{justifyContent: 'center', margin: 15}}>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                margin: 5,
                marginLeft: 20,
                fontSize: 12,
              }}>
              {strings.DELIVERY_DATE}
            </Text>
            {error.startDate ? ( <><View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              <TouchableOpacity
                onPress={() => showDatePicker()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor:COLORS.inputColor,
                  padding: 10,
                  width: '97%',
                  borderRadius: 6,
                  marginLeft:10
                }}>
                <Text
                  style={{ color: '#000'}}
                  label="Date"
                  mode="inlined"
                  editable={false}>
                  {startDate ? moment(startDate || new Date()).format('DD-MMM-YYYY') : 'Select Delivery Date'}
                </Text>
                <MCI name="calendar" color="black" size={14} />
              </TouchableOpacity>
            </View><Text
              style={{
                color: 'red',
                fontFamily: 'Poppins-Medium',
                fontSize: 11,
                marginLeft: 10
              }}>
                {error.startDate}
              </Text></>
            ):( <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              <TouchableOpacity
                onPress={() => showDatePicker()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                  padding: 10,
                  width: '97%',
                  borderRadius: 6,
                  marginLeft:10
                }}>
                <Text
                  style={{color:theme == 'light' ? '#2C2C2C' : 'white',}}
                  label="Date"
                  mode="inlined"
                  editable={false}>
                  {startDate ? moment(startDate || new Date()).format('DD-MMM-YYYY'):'Select Delivery Date'}
                </Text>
                <MCI name="calendar" color={theme == 'light' ? '#2C2C2C' : 'white'} size={14} />
              </TouchableOpacity>
            </View>)}
          </View>
          {isDatePickerVisible && (
            <DateTimePicker
              minimumDate={new Date()}
              value={startDate || new Date()}
              mode={'date'}
              display={'default'}
              is24Hour={true}
              onChange={onDateSelected}
            />
          )}
          <View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  marginTop: 5,
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 16,
                }}>
                {strings.PAYMENT_DETAILS}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 15,
                paddingTop:5
              }}>
                 <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.TOTAL_AMOUNT}:
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{ color: theme == 'light' ? '#2C2C2C' : '#fff', padding: 1, marginLeft: 5}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {finalPrice.mrp}.00
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 15,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: 'green',
                }}>
                {strings.REMAINING}:
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{color: 'green', padding: 1, marginLeft: 5}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  color: 'green',
                }}>
                {finalPrice.mrp -
                  Number(inputs.cash) -
                  Number(inputs.camount) -
                  Number(inputs.upi) -
                  Number(inputs.famount) -
                  Number(inputs.discount)}
                .00
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                placeholder={strings.AMOUNT}
                labelTxt={strings.CASH}
                keyboardType="numeric"
                fontAwesome="rupee"
                onFocus={() => handleErrors(null, 'cash')}
                error={error.cash}
                value={inputs.cash}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  console.log(chk);
                  if (chk) {
                    handleValues(txt, 'cash');
                    handleErrors(null, 'cash');
                  } else {
                    handleErrors('Invalid Amount', 'cash');
                    handleValues(txt, 'cash');
                  }
                }}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: width * 1,
                }}>
                <Input
                  placeholder={strings.CHEQUE_NO}
                  labelTxt={strings.CHEQUE}
                  contWidth={width * 0.4}
                  inptWidth={width * 0.4}
                  keyboardType="numeric"
                  onFocus={() => handleErrors(null, 'chequeno')}
                  onChangeText={txt => {
                    if (txt[0] != '.') {
                      handleValues(txt, 'chequeno');
                    }
                  }}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  placeholder={strings.BANK_NAME}
                  contWidth={width * 0.4}
                  onFocus={() => handleErrors(null, 'cbankname')}
                  onChangeText={txt => handleValues(txt, 'cbankname')}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
              </View>
              <Input
                placeholder={strings.AMOUNT}
                keyboardType="numeric"
                fontAwesome="rupee"
                value={inputs.camount}
                error={error.camount}
                onFocus={() => handleErrors(null, 'camount')}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  if (chk) {
                    handleValues(txt, 'camount');
                    handleErrors(null, 'camount');
                  } else {
                    handleErrors('Invalid Amount', 'camount');
                    handleValues(txt, 'camount');
                  }
                }}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                placeholder={strings.AMOUNT}
                keyboardType="numeric"
                labelTxt="UPI"
                error={error.upi}
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                onFocus={() => handleErrors(null, 'upi')}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  if (chk) {
                    handleValues(txt, 'upi');
                    handleErrors(null, 'upi');
                  } else {
                    handleErrors('Invalid Amount', 'upi');
                    handleValues(txt, 'upi');
                  }
                }}
              />
              <View style={{marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'Poppins-Bold',
                    textAlign: 'left',
                    color: theme == 'light' ? '#2C2C2C' : 'white',
                  }}>
                  {strings.FINANCE}
                </Text>
                {BankDropdownComponent()}
              </View>
              <Input
                placeholder={strings.AMOUNT}
                keyboardType="numeric"
                fontAwesome="rupee"
                error={error.famount}
                onFocus={() => handleErrors(null, 'famount')}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  if (chk) {
                    handleValues(txt, 'famount');
                    handleErrors(null, 'famount');
                  } else {
                    handleErrors('Invalid Amount', 'famount');
                    handleValues(txt, 'famount');
                  }
                }}
              />
              <Input
                placeholder={strings.DISCOUNT}
                keyboardType="numeric"
                fontAwesome5="percent"
                error={error.discount}
                onFocus={() => handleErrors(null, 'discount')}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  if (chk) {
                    handleValues(txt, 'discount');
                    handleErrors(null, 'discount');
                  } else {
                    handleErrors('Invalid Amount', 'discount');
                    handleValues(txt, 'discount');
                  }
                }}
              />
            </View>
           {finalPrice.mrp -
                  Number(inputs.cash) -
                  Number(inputs.camount) -
                  Number(inputs.upi) -
                  Number(inputs.famount) -
                  Number(inputs.discount) != 0 ?( <View style={{justifyContent: 'center', margin: 10}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  fontSize: 12,
                }}>
                {strings.REMAINING_PAYMENT_DATE}
              </Text>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => showDatePicker2()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                    padding: 10,
                    width: '97%',
                  borderRadius: 6,
                  marginLeft:10
                  }}>
                  <Text
                     style={{color:theme == 'light' ? '#2C2C2C' : 'white',}}
                    label="Date"
                    mode="inlined"
                    editable={false}>
                   {startDate2 ? moment(startDate2).format('DD-MMM-YYYY'):"Select Remaining Payment Date"}
                  </Text>
                  <MCI name="calendar" color={theme == 'light' ? '#2C2C2C' : 'white'} size={14} />
                </TouchableOpacity>
              </View>
            </View>):null}
           
            {isDatePickerVisible2 && (
              <DateTimePicker
                value={startDate2 || new Date()}
                minimumDate={new Date()}
                mode={'date'}
                display={'default'}
                is24Hour={true}
                onChange={onDateSelected2}
              />
            )}
            <Inputs
              error={error.comment}
              onFocus={() => handleErrors(null, 'comment')}
              onChangeText={txt => handleValues(txt, 'comment')}
              placeholder={strings.COMMENTS}
              multiline
              numberOfLines={5}
              height={120}
              autoCompleteType="off"
              octicons="comment"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
          </View>
          <View style={{marginTop: 10}} />
          <View style={{alignItems: 'center',marginBottom:5}}>
          {hideButton?
              ( <AppButton
                buttonText={strings.PAY}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleSubmit}
                buttonText={strings.PAY}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
    padding: 8,
  },
  icon: {
    marginRight: 5,
    color: COLORS.btnColor,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  selectedTextStyle: {
    fontSize: 14,
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
