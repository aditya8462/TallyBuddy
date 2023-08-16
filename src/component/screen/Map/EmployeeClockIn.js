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
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {launchCamera} from 'react-native-image-picker';

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
const {height, width} = Dimensions.get('window');

export default function EmployeeClockIn({navigation, route}) {
  const [status, setStatus] = useState();
  const [time, setTime] = useState('Start time');
  const [endTime, setEndTime] = useState('End time');
  const [startTime, setStartTime] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const [checkEmployee, setCheckEmployee] = useState({});
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

  const getOneTimeLocation = () => {
    setLocationStatus('Please Wait ...');
    Geolocation.getCurrentPosition(
      position => {
        setLocationStatus('');

        const currentLongitude = position.coords.longitude;

        const currentLatitude = position.coords.latitude;

        setCurrentLongitude(currentLongitude);

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

        console.log(position);

        const currentLongitude = position.coords.longitude;

        const currentLatitude = position.coords.latitude;

        setCurrentLongitude(currentLongitude);

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
  var hours = mainDate.getHours(); 
  var min = mainDate.getMinutes();
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
    weekArr[mainDate.getDay()] + ',  ' + monthArr[mainmonth] + '' + '' + date;
  const currentTime = hours + ':' + min;

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
      durationLimit: 30,
      saveToPhotos: true,
      cameraType: 'front',
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
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

  const handleCheckIn = async source => {
   
    if (currentLatitude && currentLongitude) {
     
    setStatus(!status);
    const asyncData = await getStoreData('EMPLOYEE');
    let formdata = new FormData();
    formdata.append('employee_id', asyncData.employee_id);
    formdata.append('store_id', asyncData.store_id);
    formdata.append('checkin_date', new Date().toISOString());
    formdata.append(
      'checkin_location',
      currentLatitude + ' ' + currentLongitude,
    );
    formdata.append('picture', {
      ...source,
    });
    const result = await postDataAxios('employeeLoginDetail', formdata);
   
    if (result.status) {
      navigation.navigate('EmployeePage');
      checkLogin();
    } else {
    }
  
}else {
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

  const handleCheckOut = async source => {
   
    if (currentLatitude && currentLongitude) {
  
   
    setStatus(!status);
    let formdata = new FormData();
    formdata.append('checkout_date', new Date().toISOString());
    formdata.append(
      'checkout_location',
      currentLatitude + ' ' + currentLongitude,
    );
    formdata.append('picture', {
      ...source,
    });
    const result = await putDataAxios(
      'employeeLoginDetail/' + checkEmployee.eld_id,
      formdata,
    );
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

  const checkLogin = async () => {
    setLoading(true);
    const asyncData = await getStoreData('EMPLOYEE');
    var result = await getData(
      'employeeLoginDetail/' +
        asyncData.employee_id +
        '?date=' +
        new Date().toISOString(),
    );
    if (result.status) {
      setStatus(result.status);
      setCheckEmployee(result.data);
      if (result.data.checkin_date && result.data.checkout_date) {
        setLoading(false);
      } else if (result.data.checkin_date && route?.params?.profile) {
        setLoading(false);
      } else if (result.data.checkin_date) {
        navigation.replace('EmployeePage');
      }
    } else {
      setStatus(result.status);
      setLoading(false);
    }
  };
  const handleDeleteAsync = async () => {
    await removeStoreData('EMPLOYEE');
    navigation.navigate('Home');
  };

  useFocusEffect(
    React.useCallback(() => {
      checkLogin();
    }, [route?.params?.profile]),
  );

  useEffect(
    function () {
      checkLogin();
      selectedLng();
    },
    [isFocused],
  );

  return (
<ScrollView>
  <SafeAreaView style={{flex:1}}>
    <View
      style={{
        flex: 1,
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
              color: '#2C2C2C',
              alignSelf: 'center',
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
            checkEmployee.checkout_date != null ? (
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
                <TouchableOpacity onPress={() => captureImage('photo')}>
                  <View
                    style={{
                      backgroundColor: 'green',
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
                        color: theme == 'light' ? '#000' : 'white',
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
                    top: -(height * 0.3),
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
            <TouchableOpacity onPress={() => captureImage('photo')}>
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
            style={{fontSize: 12, color: 'red', fontFamily: 'Poppins-Medium'}}>
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
            marginTop: height * 0.19,
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
              {checkEmployee.checkin_date
                ? moment(checkEmployee.checkin_date).format('hh:mm A')
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
              {checkEmployee.checkout_date
                ? moment(checkEmployee.checkout_date).format('hh:mm A')
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
              {checkEmployee.checkout_date
                ? DateDiff(
                    checkEmployee.checkin_date,
                    checkEmployee.checkout_date,
                  )
                : '--'}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
    </SafeAreaView>
    </ScrollView>
  );
}
