/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  Platform,
  PermissionsAndroid,
} from 'react-native';
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
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import SearchInput from '../../uicomponents/SearchInput';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

import Geolocation from '@react-native-community/geolocation';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function MyServices({navigation, route}) {
  const refRBSheet = useRef();
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          subscribeLocationLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
// alert("hello")
  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      async position => {
        //Will give you the location on location change

        // setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        var ser = await getStoreData('SERVICEMAN');
        const currentLatitude = position.coords.latitude;
        const body={latitude:currentLatitude,longitude:currentLongitude,serviceman_id:ser.serviceman_id}
        const result = await postData('serviceman/livelocation',body);
    // alert(JSON.stringify(body))
        // console.log("----------->",result);
        //  alert(JSON.stringify(result))
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        // alert(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const fetchServices = async () => {
    setLoader(true);
    const ser = await getStoreData('SERVICEMAN');
    var result = await getData('services/byServiceman/' + ser.serviceman_id);
    // alert(JSON.stringify(result))
    if (result.status) {
      setServices(result.data);
    }
    setLoader(false);
  };

  const fetchFilterData = async item => {
    setLoader(true);
    const ser = await getStoreData('SERVICEMAN');
    var result = await getData(
      'services/byServiceman/' + ser.serviceman_id + '?filter=' + item,
    );
    // alert(JSON.stringify(result))
    if (result.status) {
      setServices(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchServices();
      fetchFilterList();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
      fetchFilterList();
    }, []),
  );
  const [filterList, setFilterList] = useState([]);
  const fetchFilterList = async () => {
    var result = await postData('services/filterlist');
    if (result.status) {
      setFilterList(result.data);
    }
  };

  const Box = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: COLORS.white,
          borderRadius: 10,
          borderColor: '#d2d2d2',
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          height: height * 0.045,
          marginLeft: width * 0.02,
          marginTop: height * 0.01,
          elevation: 1.5,
        }}
        onPress={() => fetchFilterData(item.status)}>
        <Text
          style={{
            color: '#000',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  const FilterDates = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: COLORS.white,
          borderRadius: 9,
          borderColor: '#d2d2d2',
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
            fetchDetail(item);
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
  const Boxes = ({item}) => {
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
          backgroundColor: '#fff',

          // width: width * 0.9,
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
            padding: 10,
            flexDirection: 'row',
            borderRadius: 10,
            alignItems: 'center',
            // backgroundColor: COLORS.cardcolor,
            backgroundColor: '#fff',
          }}>
          <View style={{marginTop: 5, marginLeft: 15, width: width * 0.85}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 2,
                  }}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: '#2C2C2C',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.tname}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="supervised-user-circle"
                    size={16}
                    style={{color: COLORS.btnColor, padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: '#2C2C2C',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.customername}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="call"
                    size={16}
                    style={{color: COLORS.btnColor, padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: '#2C2C2C',

                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.mobileno}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', marginTop: height * 0.025}}>
                  <Icon
                    name="home"
                    size={16}
                    style={{color: COLORS.btnColor, padding: 1}}
                  />
                  <Text
                    numberOfLines={4}
                    adjustsFontSizeToFit
                    style={{
                      color: '#2C2C2C',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.address}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{width: width * 0.88}}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="description"
                  size={16}
                  style={{color: COLORS.btnColor, padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 10,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.description}
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end'}}>
                {item.status == 'Accepted' ? (
                  <AppButtons
                    buttonText={'Start Service'}
                    onPress={() => handleButton(item.service_id)}
                  />
                ) : null}
              </View>
            </View>
            {/* <SwipeButton
              disabled={false}
              //disable the button by doing true (Optional)
              swipeSuccessThreshold={70}
              height={25}
              //height of the button (Optional)
              width={350}
              //width of the button (Optional)
              title="Swipe to Submit"
              //Text inside the button (Optional)
              //thumbIconImageSource={thumbIcon}
              //You can also set your own icon (Optional)
              onSwipeSuccess={() => {
                alert('Submitted Successfully!');
              }}
              //After the completion of swipe (Optional)
              railFillBackgroundColor="#0077b5" //(Optional)
              //   railFillBorderColor="white" //(Optional)
              thumbIconBackgroundColor="#ed9a73" //(Optional)
              thumbIconBorderColor="#ed9aff" //(Optional)
              railBackgroundColor="#bbeaa6" //(Optional)
              railBorderColor="#bbeaff" //(Optional)
            /> */}
          </View>
          <View
            style={{
              width: 50,
              position: 'absolute',
              right: 60,
              top: -5,
            }}>
            <View
              style={{
                width: 100,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,

                // backgroundColor:'red'
              }}>
              <Tag
                bgColor={item.status == 'Rejected' ? 'red' : COLORS.green}
                // tagText={'Active'}
                tagText={item.status}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  const handleButton = async service_id => {
    let body = {
      status: 'In-Progress',
    };
    const result = await putData('services/' + service_id, body);
    if (result.status) {
      fetchServices();
    }
  };
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
      'services/byServiceman/' + ser.serviceman_id + str,
    );
    console.log(result);
    if (result.status) {
      setServices(result.data);
    }
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchServices();
      fetchFilterList();
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
        backgroundColor: '#fff',
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 5,
                paddingHorizontal: 10,
              }}>
              <SearchInput
                placeholder={strings.SEARCH}
                simpleLineIcons="magnifier"
                contWidth={width * 0.85}
                height={40}
              />
              <TouchableOpacity
                style={{marginLeft: 5, padding: 3}}
                onPress={() => setShowFilterDate(!showFilterDate)}>
                <MCI name={'filter'} size={24} color="black"></MCI>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignSelf: 'flex-start'}}>
              <FlatList
                data={[{status: 'ALL'}, ...filterList]}
                renderItem={({item}) => <Box item={item} />}
                keyExtractor={item => item.id}
                horizontal
              />
            </View>
            {showFilterDate && (
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
            )}

            <View style={{width: width, marginTop: 10}}>
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
              ) : (
                <FlatList
                  data={services}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('About Service', {
                          id: item.service_id,
                        })
                      }>
                      <Boxes item={item} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});
