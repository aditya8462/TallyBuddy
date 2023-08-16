
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import Antd from 'react-native-vector-icons/AntDesign';
import {getData, postData, putData} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/FontAwesome';
import SwipeButton from 'rn-swipe-button';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import Tag from '../../uicomponents/Tag';
import AppButton from '../../uicomponents/AppButton';
import AppButtons from '../../uicomponents/AppButtons';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

export default function ServicemanReport({navigation, route}) {
  const refRBSheet = useRef();
  const isFocused = useIsFocused();

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
const [completeservice,setCompleteService]=useState([])
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
          //   marginBottom: 15,
          marginTop: height * 0.03,
          //   marginHorizontal: 5,
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
              textAlign:'left'
            }}>
            {moment(item.updated_at).format("hh:mm A")}
          </Text>
        </View>
        <View style={{width: '50%'}}>
          <Text
            style={{
              color: '#2C2C2C',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              textAlign:'center'
            }}>
            {item.customername}
          </Text>
        </View>
        <View style={{width: '20%'}}>
          <Text
            style={{
              color: '#2C2C2C',
              fontSize: 14,
              fontFamily: 'Poppins-SemiBold',
              textAlign:'right',
            }}>
            &#x20b9;{item.amount}
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
    const ser = await getStoreData('SERVICEMAN');
    var result = await getData(
      'services/byServicemanReport/' + ser.serviceman_id + str,
    );
    var results = await getData(
      'services/byServicemanCompleteReport/' + ser.serviceman_id + str,
    );
    if(results.status){
      setCompleteService(results.data)
      // alert(JSON.stringify(results))

    }
    if (result.status) {
      if (
        result.data.amountcollectedfromservice ||
        result.data.needtocollect ||
        result.data.totalservice ||
        result.data.needtopay
      ) {
        setServices(result.data);
        // alert(JSON.stringify(result))
      } else {
        setServices({});
      }
    }
  };

 
  const FilterDates = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: COLORS.white,
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
            color: '#000',
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
  
  return (
    <ImageBackground
    source={require('../../assets/background.png')}
    style={{
      flex: 1,
      zIndex: 9999,
      height,
      width: '100%',
      backgroundColor: '#fff',
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
            // height: height * 0.06,
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
              //   borderWidth: 1,
              backgroundColor: '#fff',
              //   padding: 10,
              //   borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.btnColor,
                // padding: 7,
              }}>
            {strings.SETTLEMENT_SUMMARY}
            </Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: 'green',
              }}>
              {strings.TOTAL_SERVICE}
              </Text>
              <View style={{marginLeft:3}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: 'green',
                }}>
                {services.totalservice || '--'}
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
                  color: '#2C2C2C',
                }}>
                {strings.COLLECETION}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: 'black',
                }}>
                &#x20b9;{services.amountcollectedfromservice || '--'}
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
                  color: 'red',
                }}>
                {strings.AMOUNTTOPAY}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: 'red',
                }}>
                &#x20b9;{services.needtopay || '--'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            margin: 10,
            padding: 10,
            borderColor: '#d0d0d0',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-SemiBold',
              color: 'black',
            }}>
            {strings.TOTAL}  &#x20b9;{services.amountcollectedfromservice ||'0'} {strings.FROM} {services.totalservice || '0'} service
          </Text>
          <SafeAreaView>
            <FlatList
              horizontal={false}
              data={completeservice.slice(0, index)}
              renderItem={({item}) => <Item item={item} />}
              keyExtractor={item => item.id}
            />
            <View style={{margin: height * 0.02}}>
              {completeservice.length > 4 && (
                <TouchableOpacity
                  onPress={() =>
                    setIndex(prev => (prev == 4 ? TotalDetail.length : 4))
                  }
                  style={{
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 50,
                    padding: 5,
                    width: width * 0.28,
                    borderColor: '#d0d0d0',
                  }}>
                  <Text
                    style={{
                      alignItems: 'center',
                      color: '#000',
                      fontSize: 14,
                    }}>
                    {index == 4 ? (
                      <Text
                        style={{
                          color: '#2C2C2C',
                          fontSize: 14,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {strings.VIEW_MORE}
                        <Antd name="down" size={14} />
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: '#2C2C2C',
                          fontSize: 14,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {strings.VIEW_LESS}
                        <Antd name="up" size={14} />
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        height={150}
        openDuration={250}
        closeDuration={80}
        //  animationType={'fade'}
        customStyles={{
          container: {
            //  overflow: 'hidden',
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
                // marginTop: height * 0.01,
                padding: 8,
                // paddingLeft:10
              }}>
              {strings.SORT_BY_DATE_RANGE}
            </Text>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                //alignItems: 'center',
                flexDirection: 'row',
                // marginTop: height * 0.02,
                // paddingHorizontal:3,
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
