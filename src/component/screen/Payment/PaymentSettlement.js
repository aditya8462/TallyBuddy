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
  Appearance,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input.js';
import {postDataAxios, getData, postData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors.js';
import FA from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {getStoreData} from '../../storage/AsyncStorage.js';
import Inputs from '../../uicomponents/Inputs.js';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AnimatedLottieView from 'lottie-react-native';
const {width, height} = Dimensions.get('window');

export default function PaymentSettlement({navigation}) {
  const [inputs, setInputs] = useState({
   cash:'',
   cheque:'',
   upi:'',
  comment:''
  });

  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();  
  const [hideButton, setHideButton] = useState(false)


  const [settlement, setSettlement] = useState([]);
  const [expenses, setExpenses] = useState({});
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
   

  const validate = () => {
    var isValid = true;
    if (!inputs.comment) {
      handleErrors('Please Select Comment', 'comment');
      isValid = false;
    }
   
    
    return isValid;
  };
  
  const fetchDetail = async (item = '') => {
    var condition = [],
      str = '';

    var dateObj = new Date();
    if (item == 'Today') {
      condition.push('startdate=' + moment(dateObj).format());
      condition.push('enddate=' + moment(dateObj).format());
    }
    if (item == 'Yesterday') {
      dateObj.setDate(dateObj.getDate() - 1);
      condition.push('startdate=' + moment(dateObj).format());
      condition.push('enddate=' + moment(dateObj).format());
    }
    
    if (condition.length > 0) {
      str = '?' + condition.join('&');
    }

    var result = await getData('report/todaycollection' + str);
    if (result.status) {
      setServices(result.data);
    }
  };
  useEffect(() => {
    fetchDetail('Today');
    fetchSettlement()
    selectedLng();
  }, [isFocused]);
  
  const handleSubmit = async () => {
    const asyncData = await getStoreData('SUPERADMIN');
    const adminData = await getStoreData('ADMIN')
    if (validate()) {
    var body = {cash:inputs.cash,upi:inputs.upi,cheque:inputs.cheque,comment:inputs.comment,added_by:asyncData?asyncData.name:adminData.name,};
    setHideButton(true)
    const result = await postData('expenses', body);

    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.DETAILS_SUBMIT_SUCCESSFULLY,
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
  const fetchSettlement = async () => {
    setLoader(true);
    var result = await getData('expenses/todayexpenses');
    if (result.status) {
      setSettlement(result.data.reverse());
      setExpenses(result.details);
    }
    setLoader(false);
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

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
        
       
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            margin: 10,
            padding: 10,
            borderColor: '#d0d0d0',
          }}>
          <View
            style={{
              backgroundColor: theme == 'light' ? '#fff' : 'black',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: theme == 'light' ? COLORS.btnColor : '#fff',
              }}>
              {strings.SETTLEMENT_SUMMARY}
            </Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? 'green' : '#fff',
              }}>
              {strings.TOTAL}
              </Text>
              <View style={{marginLeft:3}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? 'green' : '#fff',
                }}>
                : {services.total || '--'}
              </Text>
              </View>
              </View>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 15}}>
            <View style={{width: width * 0.5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.CASH}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                &#x20b9; {services.cash || '--'}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.5,
                borderLeftColor: '#d0d0d0',
                borderLeftWidth: 1,
                paddingLeft: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                {strings.UPI}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                &#x20b9; {services.upi || '--'}
              </Text>
            </View>
          </View>


          <View style={{flexDirection: 'row', paddingTop: 15}}>
            <View style={{width: width * 0.5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.CHEQUE}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                &#x20b9; {services.chequeamount || '--'}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.5,
                borderLeftColor: '#d0d0d0',
                borderLeftWidth: 1,
                paddingLeft: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                {strings.FINANCE}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                &#x20b9; {services.financeamount || '--'}
              </Text>
            </View>
          </View>


          <View style={{flexDirection: 'row', paddingTop: 15}}>
            <View style={{width: width * 0.5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.EXPENSE}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                &#x20b9; {expenses.total || '--'}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.5,
                borderLeftColor: '#d0d0d0',
                borderLeftWidth: 1,
                paddingLeft: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? 'green' : '#fff',
                }}>
                {strings.REMAINING_TOTAL}
              </Text>
              <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? 'green' : 'white',
                    }}>
                    &#x20b9; {services.total - expenses.total || '--'}
                  </Text>
            </View>
          </View>

        </View>


       
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  marginTop: 5,
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 16,
                }}>
                {strings.SETTLEMENT_DETAILS}
              </Text>
            </View>
          <View>
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
                  color: COLORS.green,

                }}>
                {strings.REMAINING}
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{color: COLORS.green, padding: 1, marginLeft: 5}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  color: COLORS.green,
                }}>
                {services.total - expenses.total-
                  Number(inputs.cash) -
                  Number(inputs.cheque) -
                  Number(inputs.upi) 
                  }
                .00
              </Text>
              </View>
              
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
             
              <Input
                placeholder={strings.AMOUNT}
                labelTxt={strings.CHEQUE}
                keyboardType="numeric"
                fontAwesome="rupee"
                value={inputs.cheque}
                error={error.cheque}
                onFocus={() => handleErrors(null, 'cheque')}
                onChangeText={txt => {
                  let re = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/g;
                  const chk = re.test(txt);
                  if (chk) {
                    handleValues(txt, 'cheque');
                    handleErrors(null, 'cheque');
                  } else {
                    handleErrors('Invalid Amount', 'cheque');
                    handleValues(txt, 'cheque');
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
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />

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
          <View style={{alignItems: 'center'}}>
          {hideButton?
              ( <AppButton
                buttonText={strings.SUBMIT}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleSubmit}
                buttonText={strings.SUBMIT}
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
