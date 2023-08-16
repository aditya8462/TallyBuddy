import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  RefreshControl,
  Alert,
  Appearance,
} from 'react-native';
import {
  ServerURL,
  getData,
  putData,
  putDataAxios,
} from '../../Connection/FetchServices';
import {Picker} from '@react-native-picker/picker';
import {useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import Inputs from '../../uicomponents/Inputs';
import {getStoreData} from '../../storage/AsyncStorage';
import COLORS from '../../helper/Colors';
import SweetAlert from 'react-native-sweet-alert';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

import NumericInput from 'react-native-numeric-input';
const {height, width} = Dimensions.get('window');

export default function AboutServices({navigation, route}) {
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filePath, setFilePath] = useState([]);
  const [filePathArray, setFilePathArray] = useState([]);
  const [error, setError] = useState({});
  const isFocused = useIsFocused();
  const [product, setProduct] = useState([]);
  const [isFocusProduct, setIsFocusProduct] = useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [inputs, setInputs] = useState({
    productid: '',
    amount: 0,
    comments: '',
    quantity:''
  });


  const validate = () => {
    var isValid = true;

    if (!inputs.amount) {
      handleErrors('Please Input Cost', 'amount');
      isValid = false;
      console.log('---->', 2);
    }
    
    if (!inputs.quantity) {
      handleErrors('Please Input Quantity', 'quantity');
      isValid = false;
      console.log('---->', 2);
    }
    if (!filePath.length) {
      handleErrors('Please Take Picture ', 'filePath');
      isValid = false;
      console.log('-->', 1);
    }
    return isValid;
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const handleImagePress2 = item => {
    navigation.navigate('SelectBill2', {imgpp: item});
  };
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const fetchServices = async () => {
    setLoader(true);
    var result = await getData('services/' + route.params.id);
  alert(JSON.stringify(result))
    if (result.status) {
      setServices(result.data);
    
      
    }
    setLoader(false);
  };
  // alert(JSON.stringify(services.products))
  const [productlist, setProductList] = useState([]);

  const handleAddDropDown = () => {
    const newInputs = [...productlist];
    newInputs.push({productid: '', quantity: ''});
    setProductList(newInputs);
  };

  const handleDeleteDropDown = () => {
    const deletename = [...productlist];
    deletename.pop();
    setProductList([...deletename]);
  };
  
  const handleProductId=(item,index)=>{
    const data=[...productlist]
    data[index].productid=item;
    setProductList([...data])
    // alert(JSON.stringify(productlist))
    
  }
  const handleInputQuantity=(index,text)=>{
    const newInput=[...productlist]
    newInput[index].quantity=text;
    setProductList(newInput)
    // alert(JSON.stringify(productlist))
  }

  // alert(JSON.stringify(productlist))
  
  // const handleProduct = (item, index) => {
  //   const data = [...productlist];
  //   data[index].productid = item;
  //   setProductList([...data]);
  // };

  const fetchProductByServiceman = async product_id => {
    var ser = await getStoreData('SERVICEMAN');
    const result = await getData('servicemanstock/byServiceman/' + ser.serviceman_id);
    setProduct(result.data);
  };

  useEffect(
    function () {
      fetchProductByServiceman();
      fetchServices();
      selectedLng();
    },
    [],
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchServices();
      fetchProductByServiceman();
      setRefreshing(false);
    }, 2000);
  }, []);


  const handleKhali = () => {
    setInputs('');
  };

  const handleDone = async () => {
    const asyncData = await getStoreData('SERVICEMAN');
    //  if (validate()) {
      let formData = new FormData();
      filePath.map(item => {
        formData.append('pictures', {...item});
      });
      formData.append('products',JSON.stringify(productlist));
      formData.append('amount', inputs.amount);
      formData.append('comments', inputs.comments);
      formData.append('added_by', asyncData.name);
      // formData.append('quantity',inputs.quantity)
      formData.append('servicemanid',asyncData.serviceman_id)
      formData.append('status', 'Completed');
      console.log("=============?",formData)
       const result = await putDataAxios(
         'services/' + services.service_id,
         formData,
       );
// console.log("=======>",result);
        if (result.status) {
          SweetAlert.showAlertWithOptions({
            title: strings.DONE,
            confirmButtonTitle: 'OK',
            confirmButtonColor: '#000',
            otherButtonTitle: 'Cancel',
            otherButtonColor: '#dedede',
            style: 'success',
            cancellable: true,
          });
          handleKhali();
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
  };

  const handleCross = index => {
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
            <View style={{width: width * 0.95}}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.SERVICE_TYPE}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.tname}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                {strings.CUSTOMER_NAME}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.customername}
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
                {strings.STATUS}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: item.status == 'Rejected' ? 'red' : COLORS.black,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.status}
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
                numberOfLines={3}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.address} {item.pincode}
              </Text>
              {item.product_name ? (
                <>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#57606f',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {strings.PRODUCT}
                  </Text>
                  <Text
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.product_name}
                  </Text>
                </>
              ) : null}
              {item.comments && (
                <>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#57606f',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {strings.COMMENTS}
                  </Text>
                  <Text
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.comments}
                  </Text>
                </>
              )}
              {item.amount ? (
                <>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#57606f',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {strings.AMOUNT}
                  </Text>
                  <Text
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.amount}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const handleStartService = async () => {
    const ser = await getStoreData('SERVICEMAN');
    let body = {
      status: 'In-Progress',
    };
    const result = await putData('services/' + services.service_id, body);
    if (result.status) {
      fetchServices();
    }
  };

  const handleGenerateBill = async () => {
    const ser = await getStoreData('SERVICEMAN');
    let body = {
      status: 'Completed',
    };
    const result = await putData('services/' + services.service_id, body);
    if (result.status) {
      fetchServices();
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
      backgroundColor: theme == 'light' ? 'white' : 'black',
    }}>
    <KeyboardAvoidingView behavior="position">
      <View style={{width: width}}>
        {loader ? (
          <AnimatedLottieView
            source={require('../../assets/TallyBudy Loader.json')}
            autoPlay
            loop
            style={{height: 100, alignSelf: 'center', display: 'flex'}}
          />
        ) : (
         
           
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{flex:1}}/>
            }>
            <View style={{flex:1}}>
              <Boxes item={services} />
              {services.status == 'In-Progress' && (
                <>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        marginTop: 30,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width,
                      }}>
                      <View style={{}}>
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
                                    theme == 'light' ? '#fff' : 'black',
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
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                        marginTop: 10,
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
                                      bgColor="#95a5a6"
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
                                  onPress={handleCross}
                                  style={{
                                    width: 15,
                                  }}>
                                  <Icon
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
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 5,
                    }}>
                    <TouchableOpacity onPress={handleAddDropDown}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: theme == 'light' ? '#2C2C2C' : 'white',
                          paddingLeft: width * 0.05,
                        }}>
                        {strings.ADD_PRODUCT}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteDropDown()}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: theme == 'light' ? '#2C2C2C' : 'white',
                          paddingRight: width * 0.05,
                        }}>
                        {strings.DELETE}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    {productlist.map((item, index) => (
                      <>
                      <View style={{marginTop: 10}}>
                        <Picker
                          selectedValue={item.productid}
                          style={{
                            height: 50,
                            width: width * 0.9,
                            borderRadius: 10,
                            overflow: 'hidden',
                            backgroundColor:
                              theme == 'light' ? COLORS.inputColor : '#2c2C2C',
                          }}
                          onValueChange={itemValue => {
                            handleProductId(itemValue, index);
                          }}>
                          <Picker.Item label={'-Select Product-'} value={''} />
                          {product.map(itm => {
                            console.log('===>', itm);
                            return (
                              <Picker.Item
                                label={itm.product_name}
                                value={itm.product_id}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                        <Input
                        error={error.quantity}
                        onFocus={() => handleErrors(null, 'quantity')}
                        onChangeText={txt => handleInputQuantity(index,txt)}
                        placeholder={strings.QUANTITY}
                        keyboardType="numeric"
                        autoCompleteType="off"
                        materialCommunityIcons="format-list-numbered"
                        placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                      />
                        {/* <NumericInput
                    totalWidth={120}
                    minValue={1}
                    maxValue={999}
                    totalHeight={50}
                    textColor="#B0228C"
                    iconStyle={{color: 'black'}}
                    value={item.quantity}
                    onChange={txt => handleInputQuantity(index, txt)}
                  /> */}
                      </>
                    ))}

                    <Input
                      error={error.amount}
                      onFocus={() => handleErrors(null, 'amount')}
                      onChangeText={txt => handleValues(txt, 'amount')}
                      placeholder={strings.AMOUNT}
                      placeholderTextColor={
                        theme == 'light' ? 'black' : 'white'
                      }
                      keyboardType="numeric"
                      fontAwesome="rupee"
                    />
                    <Inputs
                      error={error.description}
                      onFocus={() => handleErrors(null, 'comments')}
                      onChangeText={txt => handleValues(txt, 'comments')}
                      placeholder={strings.COMMENTS}
                      placeholderTextColor={
                        theme == 'light' ? 'black' : 'white'
                      }
                      multiline
                      numberOfLines={5}
                      height={120}
                      materialIcons="description"
                    />
                  
                    <AppButton onPress={handleDone} buttonText={strings.DONE} />
                  </View>
                  <View style={{alignSelf: 'center'}} />
                </>
              )}
              {services.status == 'Accepted' && (
                <AppButton
                  onPress={() => handleStartService()}
                  buttonText={strings.START_SERVICE}
                  style={{alignSelf: 'center'}}
                />
              )}
              {services.status == 'Completed' && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: width * 0.005,
                    }}>
                    {services.pictures.map(item => {
                      return (
                        <View
                          style={{
                            marginTop: height * 0.05,
                            paddingLeft: width * 0.04,
                          }}>
                          <TouchableOpacity
                            onPress={() => handleImagePress2(item)}>
                            <Image
                              source={{uri: `${ServerURL}/images/${item}`}}
                              style={{
                                height: 100,
                                width: 100,
                                borderRadius: 10,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                  {services.product_name ? (
                    <View style={{marginTop: height * 0.04}}>
                      <AppButton
                        onPress={() =>
                          navigation.navigate('ServiceViewBill', {
                            id: services.service_id,
                            products: services.products,
                          })
                        }
                        buttonText={strings.VIEW_BILL}
                        style={{alignSelf: 'center'}}
                      />
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          </ScrollView>
         
         
        )}
      </View>
    </KeyboardAvoidingView>
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
