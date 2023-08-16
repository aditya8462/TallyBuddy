/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Alert,
  Appearance,
} from 'react-native';

import EntIcon from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  getData,
  postData,
  postDataAxios,
  ServerURL,
} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../uicomponents/AppButton';
import {Divider} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import SweetAlert from 'react-native-sweet-alert';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Inputs from '../../uicomponents/Inputs';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {useDispatch} from 'react-redux';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const status = {
  0: 'Cancelled',
  1: 'Order Booked',
  2: 'Ready for Delivery',
  3: 'Out for delivery',
  4: 'Delivered',
};
export default function ViewBillService({navigation, route}) {
  const refRBSheet = useRef();

  const refRBSheet2 = useRef();
  const [input, setInput] = useState({});
  const [loader, setLoader] = useState(true);
  const [viewbill, setViewBill] = useState([]);
  const [getLineitems, setLineitems] = useState([]);
  const [error, setError] = useState({});
  const [hideButton, setHideButton] = useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [filePath, setFilePath] = useState([]);
  const [services, setServices] = useState([]);
  const [filePathArray, setFilePathArray] = useState([]);

  const [inputs, setInputs] = useState({
    cancellationreason: '',
    amount: 0,
  });
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const fetchServices = async () => {
    setLoader(true);
    var result = await getData('services/' + route.params.id);

    if (result.status) {
      setServices(result.data);
    }
    setLoader(false);
  };

  const fetchBill = async () => {
    setLoader(true);

    var body = {id: route.params.id, products: route.params.products};
    var result = await postData('services/servicebill', body);

    if (result.status) {
      setViewBill(result.data);
      setLineitems(result.data.products);
    }
    setLoader(false);
    console.log(result);
  };

  useEffect(
    function () {
      fetchServices();
      fetchBill();
      selectedLng();
    },
    [],
  );

  const validate = () => {
    var isValid = true;
    if (!inputs.cancellationreason) {
      handleErrors('Please Input Reason', 'cancellationreason');
      console.log(1);
      isValid = false;
    }

    if (!inputs.amount) {
      handleErrors('Please input amount', 'amount');
      console.log(2);
      isValid = false;
    }

    return isValid;
  };

  const validations = () => {
    var isValid = true;
    if (!filePath.length) {
      handleErrors('Please Take Picture ', 'filePath');
      isValid = false;
      console.log('-->', 1);
    }
    return isValid;
  };

  const handleCrossImage = index => {
    const deletename = [...filePath];
    deletename.splice(index, 1);
    setFilePath([...deletename]);
  };

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
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {
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
      } else {
        const source = {
          base64: 'data:image/jpeg;base64,' + response.assets[0].base64,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        };
        console.log(source);
        setFilePath(prev => [...prev, source]);
      }
    });
  };
  const handleImagePress = picture => {
    navigation.navigate('SelectBill', {imgp: picture});
  };
  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      selectionLimit: 5,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      response.assets.forEach(function (item, index) {
        console.log(item);
        if (item[index] != null) {
          const imgArr = [...filePathArray];
          imgArr.push(item[0].uri);
          setFilePathArray([...imgArr]);
          setFilePath(prev => [...prev, response.assets[0]]);
        }
      });
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      setFilePath(prev => [...prev, response]);
    });
  };
  const handleCross = () => {
    refRBSheet.current.close();
  };

  const handleCross2 = () => {
    refRBSheet2.current.close();
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleSubmit = async () => {
    if (validate()) {
      var body = {cancellationreason: inputs.cancellationreason};
      setHideButton(true);
      const result = await postData(
        'bill/cancelbill/' + route.params.bill_id,
        body,
      );
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.BILL_CANCELED_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
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
    setHideButton(false);
  };
  const handleStatus = async sid => {
    var body = {status: sid};

    const result = await postData(
      'bill/cancelbill/' + route.params.bill_id,
      body,
    );
    if (result.status) {
      fetchBill();
    }
  };

  const Box = ({item}) => {
    return (
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: theme == 'light' ? '#f5f6fa' : 'black',
        }}>
        <View
          style={{
            width: width * 1,
            padding: 10,
            borderBottomColor: '#ecf0f1',
            borderBottomWidth: 1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                marginTop: 5,
                fontWeight: '400',
              }}>
              {strings.SERVICE_SUMMARY}
            </Text>
          </View>
          <View style={{marginTop: 8}}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 16,
              }}>
              {item.store_name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 12,
              }}>
              {item.store_address}
            </Text>
          </View>
        </View>
        <View>
          <View
            style={{
              borderBottomColor: '#ecf0f1',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: height * 0.05,
              paddingLeft: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 18,
              }}>
              {strings.YOUR_ORDER} - #{viewbill.service_id}
            </Text>
          </View>

          {getLineitems.map(lineitems => (
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                marginTop: 5,
                borderBottomColor: '#ecf0f1',
                backgroundColor: theme == 'light' ? '#f5f6fa' : 'black',
              }}>
              <View
                style={{
                  width: '30%',
                  justifyContent: 'center',
                  padding: 2,
                }}>
                <TouchableOpacity
                  onPress={() => handleImagePress(lineitems.picture)}>
                  <Image
                    source={{uri: `${ServerURL}/images/${lineitems.picture}`}}
                    style={{width: 100, height: 100}}
                  />
                </TouchableOpacity>
              </View>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {strings.CATEGORY}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.category_name}
                </Text>

                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {strings.BRAND}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.brand_name}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {strings.MODEL}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.model_name}
                </Text>
              </View>
              <View style={{width: '40%'}}>
                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.subitemsid ? strings.PRODUCT_NAME : strings.COLOR}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.subitemsid
                    ? lineitems.productname
                    : lineitems.color}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {strings.MRP}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: 'red',
                    fontFamily: 'Poppins-Medium',
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    textDecorationColor: 'red',
                  }}>
                  {lineitems.mrp}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    color: theme == 'light' ? '#57606f' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {strings.OFFER_PRICE}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: 'green',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {lineitems.costprice}
                </Text>
              </View>
            </View>
          ))}

          <View
            style={{
              borderTopColor: '#ecf0f1',
              borderTopWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: '70%', padding: 10}}>
              <Text
                style={{
                  fontSize: 14,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.GRAND_TOTAL}
              </Text>
            </View>

            <View style={{width: '70%'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {item.amount}.00
              </Text>
            </View>
          </View>

          <Divider />
          <View
            style={{
              justifyContent: 'center',
              borderBottomColor: '#ecf0f1',
              borderBottomWidth: 1,
              paddingLeft: 10,
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 18,
              }}>
              {strings.CUSTOMER_DETAILS}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '48%', padding: 10}}>
              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.TYPE_OF_SERVICE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.tname}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.CUSTOMER_NAME}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.customername}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.MOBILE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.mobileno}
              </Text>
              {item.emailid > 1 ? (
                <>
                  <Text
                    style={{
                      fontSize: 8,
                      color: theme == 'light' ? '#57606f' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {strings.EMAILID}
                  </Text>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: theme == 'light' ? '#000' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.cemail}
                  </Text>
                </>
              ) : null}

              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.ADDRESS}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.address}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.PINCODE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.pincode}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: theme == 'light' ? '#57606f' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.DESCRIPTION}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.description}
              </Text>
            </View>
          </View>

          {item.comments ? (
            <>
              <View
                style={{
                  justifyContent: 'center',
                  borderBottomColor: '#ecf0f1',
                  borderBottomWidth: 1,
                  paddingLeft: 10,
                  paddingTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 18,
                  }}>
                  {strings.COMMENTS}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '48%', padding: 10}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme == 'light' ? '#57606f' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.comments}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
        </View>
      </View>
    );
  };

  const handleDelivery = async () => {
    console.log(input);
    if (validations()) {
      let formdata = new FormData();
      formdata.append('billid', route.params.bill_id);
      formdata.append('amountreceived', inputs.amount);
      filePath.map(item => {
        formdata.append('pictures', {...item});
      });

      const result = await postDataAxios('bill/delivery', formdata);
      console.log('-------->', result);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.DELIVERED_SUCCESSFULLY,
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
      setFilePath(null);
      setInput({
        amount: 0,
      });
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#f5f6fa' : 'black',
      }}>
      <ScrollView>
        <View style={{flex: 1}}>
          <View>
            <View style={{width: width, padding: 5}}>
              {loader ? (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,

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
                <>
                  <Box item={viewbill} />
                </>
              )}
            </View>
          </View>
        </View>
        <RBSheet
          ref={refRBSheet}
          height={250}
          openDuration={250}
          closeDuration={80}
          customStyles={{
            container: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              backgroundColor: theme == 'light' ? 'white' : '#2C2C2C',
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
              <TouchableOpacity />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.REASON}
              </Text>
              <TouchableOpacity onPress={handleCross}>
                <EntypoIcon name="cross" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />

            <ScrollView>
              <View>
                <Inputs
                  onFocus={() => handleErrors(null, 'cancellationreason')}
                  onChangeText={txt => handleValues(txt, 'cancellationreason')}
                  placeholder="Reason"
                  multiline
                  error={error.cancellationreason}
                  numberOfLines={5}
                  height={110}
                  autoCompleteType="off"
                  materialIcons="question-answer"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />

                <View style={{alignItems: 'center'}}>
                  {hideButton ? (
                    <AppButton
                      buttonText={strings.SUBMIT}
                      bgColor={COLORS.disable}
                      btnWidth={0.8}
                    />
                  ) : (
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
          </View>
        </RBSheet>
        <RBSheet
          ref={refRBSheet2}
          height={450}
          openDuration={250}
          closeDuration={80}
          customStyles={{
            container: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              backgroundColor: theme == 'light' ? 'white' : 'black',
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
              <TouchableOpacity />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.DELIVERY_DETAILS}
              </Text>
              <TouchableOpacity onPress={handleCross2}>
                <EntypoIcon name="cross" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />

            <ScrollView>
              <View>
                <Input
                  error={error.amount}
                  onFocus={() => handleErrors(null, 'amount')}
                  onChangeText={txt => handleValues(txt, 'amount')}
                  placeholder={strings.AMOUNT}
                  autoCompleteType="off"
                  fontAwesome="rupee"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <View style={{alignSelf: 'center', flex: 1, marginTop: 5}}>
                  <FlatList
                    data={[{}, ...filePath]}
                    numColumns={3}
                    renderItem={({item, index}) =>
                      index == 0 ? (
                        <View
                          style={{
                            alignItems: 'center',
                            marginRight: 15,
                            marginLeft: 2,
                            marginBottom: 15,
                            borderRadius: 10,
                            backgroundColor:
                              theme == 'light' ? 'white' : 'black',
                            height: 100,
                            width: 100,
                            justifyContent: 'center',
                          }}>
                          {error.filePath ? (
                            <>
                              <Icon
                                name={'camera'}
                                size={55}
                                color="red"
                                buttonText={'Select File'}
                                bgColor="#95a5a6"
                                btnWidth={0.4}
                                onPress={() => captureImage('photo')}
                              />

                              <Text
                                style={{
                                  color: 'red',
                                  fontFamily: 'Poppins-Medium',
                                  fontSize: 11,
                                }}>
                                {error.filePath}
                              </Text>
                            </>
                          ) : (
                            <>
                              <Icon
                                name={'camera'}
                                size={55}
                                color="#4171E1"
                                buttonText={'Select File'}
                                bgColor={theme == 'light' ? 'white' : 'black'}
                                btnWidth={0.4}
                                onPress={() => captureImage('photo')}
                              />
                              <Text
                                style={{
                                  color: '#4171E1',
                                  fontSize: 10,
                                  fontWeight: 'bold',
                                  marginTop: 10,
                                }}>
                                {strings.TAKE_PICTURE}
                              </Text>
                            </>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: width * 0.005,
                          }}>
                          <Image
                            source={{uri: item.uri}}
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 10,
                            }}
                          />
                          <TouchableOpacity
                            onPress={handleCrossImage}
                            style={{
                              width: 15,
                            }}>
                            <EntIcon
                              name={'cross'}
                              size={15}
                              style={{
                                color: 'black',
                                position: 'absolute',
                                left: -18,
                                top: 1,
                                borderRadius: 10,
                                backgroundColor: 'white',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  />
                </View>
                <View style={{alignItems: 'center'}}>
                  <AppButton buttonText={'Submit'} onPress={handleDelivery} />
                </View>
              </View>
            </ScrollView>
          </View>
        </RBSheet>
      </ScrollView>
    </ImageBackground>
  );
}
