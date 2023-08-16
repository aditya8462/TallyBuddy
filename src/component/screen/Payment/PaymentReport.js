/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Appearance
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {
  postDataAxios,
  getData,
  postData,
  putData,
} from '../../Connection/FetchServices';
import COLORS from '../../helper/Colors.js';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AnimatedLottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MCI from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {RefreshControl} from 'react-native';
import Tag from '../../uicomponents/Tag';
import AppButtons from '../../uicomponents/AppButtons';
const {width, height} = Dimensions.get('window');

export default function PaymentReport({navigation}) {
  const refRBSheet = useRef();
  const [inputs, setInputs] = useState({
    cash: '',
    cheque: '',
    upi: '',
    comment: '',
  });
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [subItemsList, setSubItemsList] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [expenses, setExpenses] = useState({});
  

  const validate = () => {
    var isValid = true;
    if (!inputs.comment) {
      handleErrors('Please Select Comment', 'comment');
      isValid = false;
    }

    return isValid;
  };
  const FilterDates = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: theme == 'light' ? 'white' : 'black',
          borderRadius: 8,
          borderColor: '#d0d0d0',
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          height: height * 0.045,
          marginLeft: width * 0.02,
          marginTop: height * 0.01,
          elevation: 1.5,
        }}
        onPress={() => {
          if (item.name != 'Custom') {
            fetchDetail(item.name);
            fetchSettlement(item.name)
          } else {
            refRBSheet.current.open();
          }
        }}>
        <Text
          style={{
            color: theme == 'light' ? '#2C2C2C' : '#fff',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.key}
        </Text>
      </TouchableOpacity>
    );
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
    if (startDate) {
      condition.push('startdate=' + moment(startDate).format());
    }
    if (endDate) {
      condition.push('enddate=' + moment(endDate).format());
    }
    if (condition.length > 0) {
      str = '?' + condition.join('&');
    }

    var result = await getData('report/todaycollection' + str);
   
    if (result.status) {
      setServices(result.data);
    }
  };

  const fetchSettlement = async (item = '') => {
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
    if (startDate) {
      condition.push('startdate=' + moment(startDate).format());
    }
    if (endDate) {
      condition.push('enddate=' + moment(endDate).format());
    }
    if (condition.length > 0) {
      str = '?' + condition.join('&');
    }

    
    var results= await getData('expenses/reportByDate'+ str)
   
    if(results.status)
    {
      setSettlement(results.data.reverse());
      setExpenses(results.details);
    }
  };
  useEffect(() => {
    fetchDetail('Today')
    fetchSettlement('Today')
    selectedLng();
  }, [isFocused]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchDetail('Today');
      fetchSettlement('Today');
      setRefreshing(false);
    }, 2000);
  }, []);

  const getReceipt = async(item) => {
    const result = await getData('expenses/expensebyid/' + item.expenses_id);
    if(result.status){
      navigation.navigate('GetReceipt',{expenid:result.data})
    }}
  

    const handleCross = () => {
      refRBSheet.current.close();
    };
    const handleDone = () => {
      refRBSheet.current.close();
      fetchDetail();
      fetchSettlement()
    };
  const handleButton = async (expenses_id, status) => {
    let body = {
      isVerified: status,
    };
    const result = await putData('expenses/' + expenses_id, body);
    if (result.status) {
      fetchDetail('Today');
      fetchSettlement('Today');
    }
  };
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  function onDateSelected(event, value) {
    hideDatePicker();
    if (event.type == 'set') {
      setStartDate(value);
    }
  }

  function onDateSelected2(event, value) {
    hideDatePicker2();
    if (event.type == 'set') {
      setEndDate(value);
    }
  }
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
  const Boxes = ({item}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 5,
            borderWidth: 0.7,
            borderColor: '#f2f2f2',
            paddingBottom: 3,
            paddingRight: 2,
            backgroundColor: '#f5f6f7',
            shadowColor: '#000000',
            alignItems: 'center',
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1,
            },
          }}>
          <View
            style={{
              height: '100%',
              width:width*0.9,
              padding: 10,
              flexDirection: 'row',
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <View style={{marginTop: 5, marginLeft: 15, width: width * 0.55}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Reason -
                </Text>
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'right',
                  }}>
                  {item.comment}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Cash -
                </Text>
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'right',
                  }}>
                  &#x20b9;{item.cash}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  UPI -
                </Text>
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  &#x20b9;{item.upi}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Cheque -
                </Text>
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  &#x20b9;{item.cheque}
                </Text>
              </View>
              {item.isVerified == 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppButtons
                    buttonText={strings.ACCEPT}
                    entypo="check"
                    color="white"
                    size={16}
                    bgColor={'green'}
                    onPress={() => handleButton(item.expenses_id, 1)}
                  />
                  <AppButtons
                    buttonText={strings.REJECT}
                    bgColor="red"
                    entypo="cross"
                    color="red"
                    size={16}
                    onPress={() => handleButton(item.expenses_id, 0)}
                  />
                </View>
              )}
            </View>
           <View>
           <AppButtons style={{marginTop:-9}} buttonText={strings.GET_RECEIPT}  onPress={() =>getReceipt(item)}/>
           </View>
            <View
              style={{
                width: 50,
                position: 'absolute',
                right: 100,
                top: -5,
              }}>
              <View
                style={{
                  marginTop:height *0.0065,
                  height: 30,
                }}>
                <Tag
                  bgColor={item.isVerified == '1' ? COLORS.green : COLORS.cardcolor}
                  tagText={item.isVerified == '1' ? 'Verified' : 'Not Verified'}
                  txtColor={item.isVerified=='0' ? 'red':'#03753C' }
                 tagWidth={110}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? 'white' : 'black',
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1}}>
        <View style={{flex:1,justifyContent:'flex-start'}}>
            <FlatList
              data={[
                {key: strings.TODAY, name: 'Today'},
                {key: strings.YESTERDAY, name: 'Yesterday'},
                {key: strings.CUSTOM, name: 'Custom'},
              ]}
              renderItem={({item}) => <FilterDates item={item} />}
              keyExtractor={item => item.id}
              horizontal
            />
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
                padding: 10,
                borderColor: '#d0d0d0',
                width: width * 0.9,
              }}>
              <View
                style={{
                  backgroundColor: theme == 'light' ? 'white' : 'black',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-SemiBold',
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                  }}>
                 {strings.SETTLEMENT_SUMMARY}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      color: theme == 'light' ? 'green' : 'white',
                    }}>
                    {strings.TOTAL}
                  </Text>
                  <View style={{marginLeft: 3}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        color: theme == 'light' ? 'green' : 'white',
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
                      color: theme == 'light' ? '#2c2c2c' : 'white',
                    }}>
                    {strings.CASH}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? '#2c2c2c' : 'white',
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
                      color: theme == 'light' ? COLORS.primary : 'white',
                    }}>
                    {strings.UPI}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? COLORS.primary : 'white',
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
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                    }}>
                    {strings.CHEQUE}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? '#2C2C2C' : 'white',
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
                      color: theme == 'light' ? COLORS.primary : 'white',
                    }}>
                    {strings.FINANCE}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? COLORS.primary : 'white',
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
                      color: theme == 'light' ? '#2c2c2c' : 'white',
                    }}>
                    {strings.EXPENSE}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: theme == 'light' ? '#2c2c2c' : 'white',
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
                       color: theme == 'light' ? 'green' : 'white',
                    }}>
                    {strings.REMAINING_TOTAL}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                       color: theme == 'light' ? 'green' : 'white',
                    }}>
                    &#x20b9; {services.total - expenses.total}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{width: width, marginTop: 5}}>
              {loader ? (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    overflow: 'hidden',
                    marginVertical: 5,
                    borderWidth: 0.4,
                    borderColor: '#f2f2f2',
                    width: width * 0.95,
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '110%',
                      padding: 10,
                      flexDirection: 'row',
                      backgroundColor: COLORS.cardcolor,
                    }}>
                    <View>
                      <ShimerPlaceHolder
                        style={{
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                    </View>
                  </View>
                </View>
              ) : settlement.length != 0 ? (
                <FlatList
                  data={settlement}
                  renderItem={({item}) => <Boxes item={item} />}
                  keyExtractor={item => item.id}
                />
              ) : (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
          </View>
        </View>
        <RBSheet
          ref={refRBSheet}
          height={150}
          openDuration={250}
          closeDuration={80}
          customStyles={{
            container: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
          }}>
          <View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 12,
                backgroundColor: theme == 'light' ? 'white' : 'black',
              }}>
              <TouchableOpacity onPress={handleCross}>
                <EntypoIcon name="cross" size={20} color="red" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.SET_FILTERS}
              </Text>
              <TouchableOpacity onPress={handleDone}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.DONE}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />
            <View
              style={{backgroundColor: theme == 'light' ? 'white' : 'black'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  padding: 8,
                }}>
                {strings.SORT_BY_DATE_RANGE}
              </Text>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  paddingLeft: 3,
                  paddingRight: 3,
                  width: '99%',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                    {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                  </Text>
                  <MCI name="calendar" size={16} color="#6a5acd" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker2()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                    {moment(endDate || new Date()).format('DD-MMMM-YYYY')}
                  </Text>
                  <MCI name="calendar" size={16} color="#6a5acd" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>
        {isDatePickerVisible && (
          <DateTimePicker
            value={startDate || new Date()}
            mode={'date'}
            display={'default'}
            maximumDate={new Date()}
            is24Hour={true}
            onChange={onDateSelected}
            textColor="black"
          />
        )}
        {isDatePickerVisible2 && (
          <DateTimePicker
            value={endDate || new Date()}
            maximumDate={new Date()}
            mode={'date'}
            display={'default'}
            is24Hour={true}
            onChange={onDateSelected2}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
}
