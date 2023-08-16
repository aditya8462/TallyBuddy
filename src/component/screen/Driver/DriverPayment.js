import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  Appearance,
} from 'react-native';
import Antd from 'react-native-vector-icons/AntDesign';
import {getData, postData, putData} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
const {width, height} = Dimensions.get('window');
import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../helper/Colors';
import AppButton from '../../uicomponents/AppButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import SweetAlert from 'react-native-sweet-alert';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

export default function DriverPayment({navigation, route}) {
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const [inputs, setInputs] = useState({
    amount: 0,
    
  });
  const [error, setError] = useState({});
  const handleDone = () => {
    refRBSheet.current.close();
    fetchDetail();
  };

  const handleCross = () => {
    refRBSheet.current.close();
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilterDate, setShowFilterDate] = useState(false);
  const [services, setServices] = useState({});
  const [index, setIndex] = useState(4);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });


  const TotalDetail = [
    {
      id: '1',
      img: require('../../assets/bank.png'),
      time: '10:00 PM',
      name: 'BHAWANI S',
      rupee: '₹272',
    },
    {
      id: '2',
      img: require('../../assets/bank.png'),
      time: '09:25 PM',
      name: 'JESSMON J',
      rupee: '₹242',
    },
    {
      id: '4',
      img: require('../../assets/bank.png'),
      time: '09:21 PM',
      name: 'YOGESH K',
      rupee: '₹100',
    },
    {
      id: '5',
      img: require('../../assets/bank.png'),
      time: '08:52 PM',
      name: 'Bishan n s',
      rupee: '₹184',
    },
    {
      id: '6',
      img: require('../../assets/bank.png'),
      time: '07:48 PM',
      name: 'Aditya',
      rupee: '₹22',
    },
  ];

  const Item = ({item}) => (
    <>
      <View
        style={{
          marginTop: height * 0.03,
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          alignSelf: 'center',
          width: '95%',
        }}>
        <View style={{width: '25%'}}>
          <Text
            style={{
              color: '#2C2C2C',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              textAlign: 'left',
            }}>
            {item.time}
          </Text>
        </View>
        <View style={{width: '50%'}}>
          <Text
            style={{
              color: '#2C2C2C',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </View>
        <View style={{width: '20%'}}>
          <Text
            style={{
              color: '#2C2C2C',
              fontSize: 14,
              fontFamily: 'Poppins-Bold',
              textAlign: 'right',
            }}>
            {item.rupee}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 0.5,
          opacity: 1,
          width: '90%',
          alignSelf: 'center',
          borderBottomColor: '#d0d0d0',
        }}
      />
    </>
  );

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

    var result = await getData(
      'driver/amountreportbydriver/' + route.params.id + str,
    );
    if (result.status) {
      setServices(result.data);
    }
  };

  const handlePay=async()=>{
      var body={drivermobile:route.params.id,amount:inputs.amount,remaining:(services.remaining || services.total)-inputs.amount}
    var result=await postData('collection',body)
    
    if(result.status){
       SweetAlert.showAlertWithOptions({
        title: strings.AMOUNT_SUBMIT_SUCCESSFULLY,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'success',
        cancellable: true,
      });
      fetchDetail('Today')
    }else {
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
  const FilterDates = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
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
          } else {
            refRBSheet.current.open();
          }
        }}>
        <Text
          style={{
            color: theme == 'light' ? '#000' : 'white',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.key}
        </Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    fetchDetail('Today');
    selectedLng();
  }, [isFocused]);
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
      backgroundColor: theme == 'light' ? '#fff' : 'black',
    }}>
    <ScrollView>
      <View style={{flex: 1}}>
      <View style={{flex: 1, alignSelf: 'flex-start'}}>
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
        </View>
        <View
          style={{
            backgroundColor: COLORS.inputColor,
            margin: 10,
          }}>
         
        </View>
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
                color: theme == 'light' ? COLORS.btnColor : 'white',
              }}>
              {strings.SETTLEMENT_SUMMARY}
            </Text>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? 'green' : 'white',
              }}>
              {strings.TOTAL}
              </Text>
              <View style={{marginLeft:3}}>
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
              <View style={{flexDirection:'row'}}>
              <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? 'red' : 'white',
              }}>
              {strings.REMAINING}
              </Text>
              <View style={{marginLeft:3}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? 'red' : 'white',
                }}>
                : {(services.remaining || '00')}
              </Text>
              </View>
              </View>
              </View>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 15}}>
          </View>


       


         
          
        </View>
        <View>
            <Input
              error={error.amount}
              onFocus={() => handleErrors(null, 'amount')}
              onChangeText={txt => handleValues(txt, 'amount')}
              placeholder={strings.Received_AMOUNT}
              autoCompleteType="off"
              fontAwesome5="rupee-sign"
              keyboardType="numeric"
            />
            </View>
            <View style={{alignSelf: 'center'}}>
            <AppButton  buttonText={strings.SUBMIT} onPress={handlePay} />
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
            }}>
            <TouchableOpacity onPress={handleCross}>
              <EntypoIcon name="cross" size={20} color="red" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              {strings.SET_FILTERS}
            </Text>
            <TouchableOpacity onPress={handleDone}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                }}>
                {strings.DONE}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />

          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: 'black',
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
                  backgroundColor: '#e7e7e7',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker()}>
                <Text
                  label="Date"
                  mode="outlined"
                  editable={false}
                  style={{color: '#000'}}>
                  {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                </Text>
                <MCI name="calendar" size={16} color="#6a5acd" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#e7e7e7',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker2()}>
                <Text
                  label="Date"
                  mode="outlined"
                  editable={false}
                  style={{color: '#000'}}>
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
