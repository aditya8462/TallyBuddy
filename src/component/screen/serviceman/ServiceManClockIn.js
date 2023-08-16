/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Appearance,
  Alert,
} from 'react-native';
import {ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  getData,
  postData,
  postDataAxios,
  putData,
  putDataAxios,
} from '../../Connection/FetchServices';
import {getStoreData, removeStoreData} from '../../storage/AsyncStorage';
import moment from 'moment';
import AnimatedLottieView from 'lottie-react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AppButton from '../../uicomponents/AppButton';
import {launchCamera} from 'react-native-image-picker';

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {height, width} = Dimensions.get('window');

export default function ServiceManClockIn({navigation, route}) {
  const [status, setStatus] = useState();
  const [time, setTime] = useState('Start time');
  const [endTime, setEndTime] = useState('End time');
  const [startTime, setStartTime] = useState('');
  // const [timeCal, setTimeCal] = useState('final');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const [checkServiceMan, setCheckServiceMan] = useState({});
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
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
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

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
        // If CAMERA Permission is granted
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
        // If WRITE_EXTERNAL_STORAGE Permission is granted
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
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        // Alert.alert('');
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
        if (status == true) {
          handleCheckOut(source);
        } else {
          handleCheckIn(source);
        }
      }
    });
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

  const getOneTimeLocation = () => {
    // setLocationStatus('Getting Location ...');

    setLocationStatus('Please Wait ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('');

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    setLocationStatus('Please Wait...');
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        // setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
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

  const mainDate = new Date();

  var date = mainDate.getDate();
  var mainmonth = mainDate.getMonth();
  // var year = mainDate.getFullYear();
  var hours = mainDate.getHours(); //To get the Current Hours
  var min = mainDate.getMinutes(); //To get the Current Minutes
  var weekArr = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var monthArr = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentDate =
    weekArr[mainDate.getDay()] + ',  ' + monthArr[mainmonth] + ' ' + '' + date;
  const currentTime = hours + ':' + min;

  const handleCheckIn = async source => {
    if (currentLatitude && currentLongitude) {
      setStatus(!status);
      const asyncData = await getStoreData('SERVICEMAN');
      let formdata = new FormData();
      formdata.append('serviceman_id', asyncData.serviceman_id);
      formdata.append('checkin_date', new Date().toISOString());
      formdata.append(
        'checkin_location',
        currentLatitude + ' ' + currentLongitude,
      );
      formdata.append('picture', {
        ...source,
      });
      console.log('---->', formdata);
      const result = await postDataAxios('employeeLoginDetail', formdata);
      // alert(result.status)
      console.log('hiii', result);
      if (result.status) {
        navigation.navigate('Page');
        checkLogin();
      } else {
      }
    } else {
      SweetAlert.showAlertWithOptions({
        title: 'Please click on refresh button to refresh location',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
    }
  };

  const handleDeleteAsync = async () => {
    await removeStoreData('SERVICEMAN');
    navigation.navigate('Home');
  };
  // alert(JSON.stringify(checkServiceMan.eld_id))

  const handleCheckOut = async source => {
    if (currentLatitude && currentLongitude) {
      setStatus(!status);
      //console.log(status)
      // setEndTime(new Date().toLocaleTimeString());
      let formdata = new FormData();
      formdata.append('checkout_date', new Date().toISOString());
      formdata.append(
        'checkout_location',
        currentLatitude + ' ' + currentLongitude,
      );
      formdata.append('picture', {
        ...source,
      });
      var result = await putDataAxios(
        'employeeLoginDetail/' + checkServiceMan.eld_id,
        formdata,
      );
      console.log(formdata);
      if (result.status) {
        checkLogin();
      } else {
      }
    } else {
      SweetAlert.showAlertWithOptions({
        title: 'Please click on refresh button to refresh location',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
    }
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

  useFocusEffect(
    React.useCallback(() => {
      checkLogin();
    }, [route?.params?.profile]),
  );

  const checkLogin = async () => {
    setLoading(true);
    const asyncData = await getStoreData('SERVICEMAN');
    console.log(asyncData.serviceman_id);
    var result = await getData(
      'employeeLoginDetail/' +
        asyncData.serviceman_id +
        '?date=' +
        new Date().toISOString(),
    );
    console.log(result);
    console.log(route?.params?.profile);
    if (result.status) {
      setStatus(result.status);
      setCheckServiceMan(result.data);

      console.log(result.data);
      if (result.data.checkin_date && result.data.checkout_date) {
        setLoading(false);
      } else if (result.data.checkin_date && route?.params?.profile) {
        setLoading(false);
      } else if (result.data.checkin_date) {
        navigation.replace('Page');
      } else {
        setLoading(false);
      }
    } else {
      setStatus(result.status);
      setLoading(false);
    }
  };

  useEffect(
    function () {
      checkLogin();
      selectedLng();
    },
    [isFocused],
  );

  if (loading) {
    return (
      <AnimatedLottieView
        source={require('../../assets/TallyBudy Loader.json')}
        autoPlay
        loop
        style={{height: 100, alignSelf: 'center', display: 'flex'}}
      />
    );
  } else {
    return (
      <View
        style={{
          margin: height * 0.001,
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={require('../../assets/Map.png')}
          style={{width: width, height: height}}>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 40,
                fontFamily: 'Poppins-Bold',
                marginTop: 20,
                alignSelf: 'center',
                color: '#2C2C2C',
              }}>
              {currentTime}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                alignSelf: 'center',
                color: '#2C2C2C',
              }}>
              {currentDate}
            </Text>
          </View>

          <View
            style={{
              alignSelf: 'center',
              padding: 15,
              marginTop: height * 0.14,
            }}>
            {status ? (
              checkServiceMan.checkout_date != null ? (
                <>
                  <TouchableOpacity onPress={() => handleDeleteAsync()}>
                    <View
                      style={{
                        backgroundColor: 'red',
                        alignItems: 'center',
                        height: 220,
                        width: 220,
                        borderRadius: 250,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../assets/fingerprint.png')}
                        style={{
                          resizeMode: 'contain',
                          width: 100,
                          height: 100,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'Poppins-Bold',
                          color: '#ffff',
                          marginTop: height * 0.039,
                        }}>
                        {strings.TIME_UP}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteAsync()}
                    style={{
                      width: 30,
                      height: 30,
                      position: 'absolute',
                      right: -60,
                      top: -(height * 0.25),
                    }}>
                    <Icon
                      name={'log-out'}
                      size={30}
                      style={{alignSelf: 'center', color: 'red'}}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      captureImage('photo');
                    }}>
                    <View
                      style={{
                        backgroundColor:'green',
                        alignItems: 'center',
                        height: 220,
                        width: 220,
                        borderRadius: 220,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../assets/fingerprint.png')}
                        style={{
                          resizeMode: 'contain',
                          width: 100,
                          height: 100,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'Poppins-Bold',
                          color: '#ffff',
                          marginTop: 30,
                        }}>
                        {strings.CHECK_OUT}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      width: 30,
                      height: 30,
                      position: 'absolute',
                      right: -60,
                      top: -(height * 0.25),
                    }}>
                    <Icon
                      name={'circle-with-cross'}
                      size={30}
                      style={{alignSelf: 'center', color: 'red'}}
                    />
                  </TouchableOpacity>
                </>
              )
            ) : (
              <TouchableOpacity
                onPress={() => {
                  captureImage('photo');
                }}>
                <View
                  style={{
                    backgroundColor: '#4171E1',
                    alignItems: 'center',
                    height: 220,
                    width: 220,
                    borderRadius: 250,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../assets/fingerprint.png')}
                    style={{
                      resizeMode: 'contain',
                      width: 100,
                      height: 100,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Poppins-Bold',
                      color: '#ffff',
                      marginTop: height * 0.039,
                    }}>
                    {strings.CHECK_IN}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: 'red',
                fontFamily: 'Poppins-Medium',
              }}>
              {locationStatus}
            </Text>
            <TouchableOpacity
              onPress={() => {
                getOneTimeLocation();
                subscribeLocationLocation();
              }}>
              <MaterialIcons
                name={'refresh'}
                size={25}
                style={{alignSelf: 'center', color: 'red'}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
              marginTop: height * 0.15,
            }}>
            <View style={{alignSelf: 'center'}}>
              <Image
                source={require('../../assets/clockin.png')}
                style={{
                  resizeMode: 'contain',
                  width: 37,
                  height: 37,
                  borderRadius: 250,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#2C2C2C',
                  textAlign: 'center',
                }}>
                {strings.CHECK_IN}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                  color: '#2C2C2C',
                }}>
                {checkServiceMan.checkin_date
                  ? moment(checkServiceMan.checkin_date).format('hh:mm A')
                  : '--'}
              </Text>
            </View>
            <View>
              <Image
                source={require('../../assets/clockout.png')}
                style={{
                  resizeMode: 'contain',
                  width: 37,
                  height: 37,
                  borderRadius: 250,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#2C2C2C',
                  textAlign: 'center',
                }}>
                {strings.CHECK_OUT}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                  color: '#2C2C2C',
                }}>
                {checkServiceMan.checkout_date
                  ? moment(checkServiceMan.checkout_date).format('hh:mm A')
                  : '--'}
              </Text>
            </View>
            <View>
              <Image
                source={require('../../assets/clockout.png')}
                style={{
                  resizeMode: 'contain',
                  width: 37,
                  height: 37,
                  borderRadius: 250,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#2C2C2C',
                  textAlign: 'center',
                }}>
                {strings.WORKING_HRS}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                  color: '#2C2C2C',
                }}>
                {checkServiceMan.checkout_date
                  ? DateDiff(
                      checkServiceMan.checkin_date,
                      checkServiceMan.checkout_date,
                    )
                  : '--'}
                {/* Hrs */}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
