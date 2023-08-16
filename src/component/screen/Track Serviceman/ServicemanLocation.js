/* eslint-disable eqeqeq */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  Linking,
  Appearance,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {getData} from '../../Connection/FetchServices';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AppButtons from '../../uicomponents/AppButtons';

const {height, width} = Dimensions.get('window');

export default function ServicemanLocation({navigation, route}) {
  const refRBSheet = useRef();
  const [employees, setEmployees] = useState({});
  const [loader, setLoader] = useState(true);
  const [detail, setDetails] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

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

  const fetchServiceManDetails = async () => {
    var condition = [],
      str = '';
    if (startDate) {
      condition.push('startdate=' + new Date(startDate).toISOString());
    }
    if (endDate) {
      condition.push('enddate=' + new Date(endDate).toISOString());
    }
    if (startDate || endDate) {
      str = '?' + condition.join('&');
    }
    var result = await getData('serviceman/livelocation/' + route.params.id + str);
    console.log("========>",result);
    if (result.status) {
      setDetails(result.data.reverse());
    }
  };

  const fetchEmployees = async () => {
    setLoader(true);
    var result = await getData('serviceman/' + route.params.id);
    if (result.status) {
      setEmployees(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  useEffect(function () {
    fetchEmployees();
    fetchServiceManDetails();
    selectedLng();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
      fetchServiceManDetails();
    }, []),
  );

  const handleDone = () => {
    refRBSheet.current.close();
    fetchServiceManDetails();
  };

  const handleCross = () => {
    refRBSheet.current.close();
  };

  const DateDiff = (time1, time2) => {
    var Startday = new Date(time1).getTime();
    var Endday = new Date(time2).getTime();
    var diff = Endday - Startday;
    const differenceInMinutes = diff / 1000 / 60;
    let hours = Math.floor(differenceInMinutes / 60);
    if (hours < 0) {
      hours = 24 + hours;
    }
    let minutes = Math.floor(differenceInMinutes % 60);
    if (minutes < 0) {
      minutes = 60 + minutes;
    }
    const hoursAndMinutes = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    return hoursAndMinutes;
  };

  const Boxes = ({item}) => {
    return (
      <View
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
          borderColor: '#f2f2f2',
          elevation: 5,
        }}>
        <ImageBackground
          source={require('../../assets/Backgrounds.png')}
          style={{width: width * 1}}>
          <View
            style={{
              width: width * 1,
              padding: 12,
              flexDirection: 'row',
            }}>
            <View style={{width: '48%'}}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.NAME}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
               {strings.MOBILE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.mobileno}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.ADDRESS}
              </Text>
              <Text
                numberOfLines={4}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.address},{item.city}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
               {strings.SERVICE_AREA}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.servicearea?.join()}
              </Text>
             
            </View>
            <View style={{width: '53%'}}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.EMAILID}
              </Text>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.emailid}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.AADHAR_NO}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.addhar_no}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.STATE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.state}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
               {strings.STATUS}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.status == '1' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const Box = ({items}) => {
    return (
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
        backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
        justifyContent: 'space-between',

         width: width * 0.9,
        shadowColor: '#000000',
        alignItems: 'center',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        width: '95%',
        shadowOffset: {
          height: 1,
          width: 1,
        },
      }}>
      <View
        style={{
          height: '100%',
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          flexDirection: 'column',
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
        }}>
      <View style={{marginTop: 7, width: width * 0.9}}>
      
      <View style={{width: width * 0.92,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 14,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
                textAlign:'left'
              }}>
              {moment(items.created_at).format('DD-MMM-YYYY hh:mm A')}
            </Text>
            <AppButtons style={{marginTop:-9}} buttonText={strings.GET_LOCATION} onPress={()=>Linking.openURL(`https://www.google.com/maps/place/${items.latitude},${items.longitude}`)}/>
          </View>
          </View>
          </View>
        </View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchEmployees();
    fetchServiceManDetails();
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ImageBackground
          source={require('../../assets/background.png')}
          style={{
             flex: 1,
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#f2f2f2' : 'black',
          }}>
    <View style={{flex: 1}}>
      <View style={{width: width}}>
        {loader ? (
          <AnimatedLottieView
            source={require('../../assets/TallyBudy Loader.json')}
            autoPlay
            loop
            style={{height: 100, alignSelf: 'center', display: 'flex'}}
          />
        ) : (
          <>
            <Boxes item={employees} />
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.HISTORY}
              </Text>
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <MCI name={'filter'} size={16} color= {theme == 'light' ? '#000' : 'white'}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      color: theme == 'light' ? '#000' : 'white',
                    }}>
                    {strings.SORT_BY}
                  </Text>
                </MCI>
              </TouchableOpacity>
            </View>

            <ScrollView style={{height: height * 0.6}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {detail.length != 0 ?( <View style={{width: width,marginBottom: height * 0.24}}>
                <FlatList
                  data={detail}
                  renderItem={({item}) => <Box items={item} />}
                  keyExtractor={item => item.id}
                />
              </View>):theme == 'light' ? (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/NOData.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              )}
            </ScrollView>
          </>
        )}
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
              <Icon name="cross" size={20} color="red" />
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
          <View style = {{  borderWidth: 0.5,
        borderColor:'#dcdcdc',
        }} />

          <View style={{backgroundColor: theme == 'light' ? 'white' : 'black',}}>
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
                  justifyContent:'space-between',
                  backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker()}>
                <Text label="Date" mode="outlined" editable={false} style={{color: theme == 'light' ? '#2C2C2C' : '#fff',}}>
                  {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                </Text>
                <MCI name="calendar" size={16} color="#6a5acd" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                 justifyContent:'space-between',
                 backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker2()}>
                 
                <Text label="Date" mode="outlined" editable={false} style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
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
    </View>
    </ImageBackground>
  );
}
