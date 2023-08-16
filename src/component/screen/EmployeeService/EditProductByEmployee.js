/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import SweetAlert from 'react-native-sweet-alert';
import {
  getData,
  deleteData,
  putDataAxios,
  ServerURL,
} from '../../Connection/FetchServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import strings from '../../../changeLanguage/LocalizedString';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';
const {width, height} = Dimensions.get('window');
export default function EditProductByEmployee({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    vendors_id: '',
    costprice: '',
    color: '',
  });
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [value, setValue] = useState(null);
  const [isSelected, setSelection] = useState(false);
  const [subItemsList, setSubItemsList] = useState([
    {productname: '', quantity: '', costprice: ''},
  ]);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });


  const handleQtyChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].quantity = text;
    setSubItemsList(newInputs);
  };

  const handleCostPriceChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].costprice = text;
    setSubItemsList(newInputs);
  };

  const handleDeleteInput = index => {
    const deletename = [...subItemsList];
    deletename.splice(index, 1);
    setSubItemsList([...deletename]);
  };

  const handleInputChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].productname = text;
    setSubItemsList(newInputs);
  };

  const handleAddMore = () => {
    const newInputs = [...subItemsList];
    newInputs.push({productname: '', quantity: '', costprice: ''});
    setSubItemsList(newInputs);
  };

  const validate = () => {
    var isValid = true;
    console.log(inputs);
    if (!categorylist) {
      handleErrors('Please Input Category Id', 'categoryid');
      isValid = false;
    }
    if (!brandlist) {
      handleErrors('Please Input Brand Name', 'brandid');
      isValid = false;
    }
    if (!modellist) {
      handleErrors('Please Input Model', 'modelid');
      isValid = false;
    }
    if (!vendorlist) {
      handleErrors('Please Input Vendor', 'vendorid');
      isValid = false;
    }
    if (!inputs.costprice) {
      handleErrors('Please Input Cost ', 'costprice');
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  };

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
        setFilePath(source);
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

  const [loader, setLoader] = useState(true);
  const handleDelete = async () => {
    const result = await deleteData('product/' + route.params.id);
    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.DELETED_SUCCESSFULLY,
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
  };
  const askDelete = () => {
    Alert.alert('Warning !', 'Are you sure want to delete', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => handleDelete(),
      },
    ]);
  };

  const fetchProducts = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('product/' + route.params.id);
    if (result.status) {
      console.log(result.data);
      setInputs({
        category_id: result.data.categoryid,
        brand_id: result.data.brandid,
        model_id: result.data.modelid,
        vendors_id: result.data.vendorid,
        costprice: String(result.data.costprice),
        picture: result.data.picture,
        color: result.data.color,
      });
      setSelection(result.data.subitems == 1 ? true : false);
      fetchBrand(result.data.categoryid);
      fetchModel(result.data.brandid);
      setSubItemsList(result.data.subitemlist);
      setCategoryList(String(result.data.categoryid))
      setBrandList(String(result.data.brandid))
      setModelList(String(result.data.modelid))
      setVendorList(String(result.data.vendorid))
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchProducts();
      fetchVendor();
      fetchCategory();
      selectedLng();
    },
    [],
  );

  const handleEdit = async () => {
    var st = await getStoreData('EMPLOYEE');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('categoryid', categorylist);
      formdata.append('brandid', brandlist);
      formdata.append('modelid', modellist);
      formdata.append('vendorid', vendorlist);
      formdata.append('costprice', inputs.costprice);
      formdata.append('color', inputs.color);
      formdata.append('subitems', isSelected);
      formdata.append('added_by', st.name);
      formdata.append('subitemlist', JSON.stringify(subItemsList));
      if (filePath) {
        formdata.append('picture', {
          ...filePath,
        });
      }
    setHideButton(true)
      const result = await putDataAxios('product/' + route.params.id, formdata);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.PRODUCT_EDITED_SUCCESSFULLY,
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

  const fetchCategory = async category_id => {
    const result = await getData('category', {category_id: category_id});
    setCategory(result.data);
  };
 
  const fetchBrand = async category_id => {
    const result = await getData('brand/byCategory/' + category_id);
    setBrand(result.data);
    console.log('Brand', result.data);
  };
 

  const fetchModel = async brand_id => {
    const result = await getData('model/byBrand/' + brand_id);
    setModel(result.data);
    console.log('model', result.data);
  };
 

  const fetchVendor = async () => {
    const result = await getData('vendor/display/active');
    console.log(result);
    setVendor(result.data);
  };
 

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const [categorylist, setCategoryList] = useState('');
  const handleCategory = itemValue => {
    setCategoryList(itemValue);
    if (itemValue) fetchBrand(itemValue);
  };

  const [brandlist, setBrandList] = useState('');
  const handleBrand = itemValue => {
    setBrandList(itemValue);
    if (itemValue) {
      fetchModel(itemValue);
    }
  };

  const [modellist, setModelList] = useState('');
  const handleModel = itemValue => {
    setModelList(itemValue);
  };

  const [vendorlist, setVendorList] = useState('');
  const handleVendor = itemValue => {
    setVendorList(itemValue);
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
          {loader ? (
            <AnimatedLottieView
              source={require('../../assets/TallyBudy Loader.json')}
              autoPlay
              loop
              style={{height: 100, alignSelf: 'center', display: 'flex'}}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily:'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  marginTop: 15,
                  marginBottom: 5,
                }}>
                {strings.EDIT_PRODUCT_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                 {error.category_id ? (
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      <Picker
                        selectedValue={categorylist}
                        style={{
                          height: 50,
                          width: '60%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleCategory(itemValue);
                        }}>
                        <Picker.Item label={'-Select Category-'} value={''} />
                        {category.map(itm => {
                          return (
                            <Picker.Item
                              label={itm.name}
                              value={String(itm.category_id)}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      {error.category_id}
                    </Text>
                  </View>
                ) : (
                  <>
                  <View style={{alignSelf: 'flex-start'}}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'Poppins-Bold',
                          textAlign: 'left',
                          color: theme == 'light' ? 'black' : '#fff',
                          paddingLeft: 18,
                        }}>
                        {strings.CATEGORY}
                      </Text>
                    </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 1.5,
                      margin: 5,
                    }}>
                    <Picker
                      selectedValue={categorylist}
                      style={{
                        height: 50,
                        width: '60%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleCategory(itemValue);
                      }}>
                      <Picker.Item label={'-Select Category-'} value={''} />
                      {category.map(itm => {
                        return (
                          <Picker.Item
                            label={itm.name}
                            value={String(itm.category_id)}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  </>
                )}

                <View style={{marginTop: 5}}>
                <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'left',
                      color: theme == 'light' ? 'black' : '#fff',
                      paddingLeft: width * 0.31,
                    }}>
                    {strings.BRAND}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 1.5,
                      margin: 5,
                    }}>
                    {brand.length ? (
                      <Picker
                        selectedValue={String(brandlist)}
                        style={{
                          height: 50,
                          width: '60%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleBrand(itemValue);
                        }}>
                        <Picker.Item label={'-Select Brand-'} value={''} />
                        {brand.map(itm => {
                          return (
                            <Picker.Item
                              label={itm.brand_name}
                              value={String(itm.brand_id)}
                            />
                          );
                        })}
                      </Picker>
                    ) : (
                      <></>
                    )}
                  </View>
                  {error.brand_id ? (
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      {error.brand_id}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>

                <View style={{marginTop: 5}}>
                <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'left',
                      color: theme == 'light' ? 'black' : '#fff',
                      paddingLeft: width * 0.31,
                    }}>
                    {strings.MODEL}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 1.5,
                      margin: 5,
                    }}>
                    {model.length ? (
                      <Picker
                        selectedValue={modellist}
                        style={{
                          height: 50,
                          width: '60%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleModel(itemValue);
                        }}>
                        <Picker.Item label={'-Select Model-'} value={''} />
                        {model?.map(itm => {
                          return (
                            <Picker.Item
                              label={itm.name}
                              value={String(itm.model_id)}
                            />
                          );
                        })}
                      </Picker>
                    ) : (
                      <></>
                    )}
                  </View>
                  {error.model_id ? (
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      {error.model_id}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
                {error.vendor_id ? (
                  <View style={{marginTop: 5}}>
                       <Text
                        style={{
                          fontSize: 10,
                          fontFamily: 'Poppins-Bold',
                          textAlign: 'left',
                          color: theme == 'light' ? 'black' : '#fff',
                          paddingLeft: 18,
                        }}>
                        {strings.VENDOR}
                      </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      <Picker
                        selectedValue={vendorlist}
                        style={{
                          height: 50,
                          width: '60%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleVendor(itemValue);
                        }}>
                        <Picker.Item label={'-Select Vendor-'} value={''} />
                        {vendor.map(itm => {
                          return (
                            <Picker.Item
                              label={itm.firm_name}
                              value={String(itm.vendors_id)}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                      }}>
                      {error.vendor_id}
                    </Text>
                  </View>
                ) : (
                  <>
                  <View style={{alignSelf: 'flex-start'}}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'left',
                      color: theme == 'light' ? 'black' : '#fff',
                      paddingLeft: 18,
                    }}>
                    {strings.VENDOR}
                  </Text>
                </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 1.5,
                      margin: 5,
                    }}>
                      {vendor.length?(
                    <Picker
                      selectedValue={vendorlist}
                      style={{
                        height: 50,
                        width: '60%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleVendor(itemValue);
                      }}>
                      <Picker.Item label={'-Select Vendor-'} value={''} />
                      {vendor.map(itm => {
                        return (
                          <Picker.Item
                            label={itm.firm_name}
                            value={String(itm.vendors_id)}
                          />
                        );
                      })}
                    </Picker>
                      ):(<></>)}
                  </View>
                  </>
                )}
                <Input
                  error={error.costprice}
                  onFocus={() => handleErrors(null, 'costprice')}
                  onChangeText={txt => handleValues(txt, 'costprice')}
                  placeholder={strings.COST_PER_UNIT}
                  value={inputs.costprice}
                  labelTxt={strings.COST_PER_UNIT}
                />
                <Input
                  error={error.color}
                  onFocus={() => handleErrors(null, 'color')}
                  placeholder={strings.COLOR}
                  onChangeText={text => handleValues(text, 'color')}
                  value={inputs.color}
                  labelTxt={strings.COLOR}
                />
                <View style={{alignItems: 'flex-start', width: width * 0.87}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width * 0.87,
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        color: theme == 'light' ? '#2C2C2C' : '#fff',
                      }}>
                     {strings.SUB_ITEMS}
                    </Text>
                    {isSelected ? (
                      <TouchableOpacity onPress={handleAddMore}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            alignItems: 'center',
                            fontSize: 12,
                            color: theme == 'light' ? '#2C2C2C' : '#fff',
                          }}>
                         {strings.ADD_MORE}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    title="Check me"
                  />
                </View>
                <View
                  style={{
                    alignItems: 'flex-start',
                    width: width * 0.9,
                    justifyContent: 'space-between',
                  }}>
                  {isSelected ? (
                    <>
                      {subItemsList.map((item, index) => (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: width * 0.9,
                              marginTop: 15,
                              gap: 4,
                            }}>
                            <TextInput
                              name="Product"
                              placeholder={strings.PRODUCT_NAME}
                              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                              onChangeText={txt =>
                                handleInputChange(index, txt)
                              }
                              style={{
                                width: width * 0.82,
                                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                                borderColor: '#f2f2f2',
                                borderRadius: 10,
                                padding: 10,
                                height: 50,
                              }}
                              value={item.productname}
                            />
                            <TouchableOpacity
                              onPress={() => handleDeleteInput(index)}>
                              <Icon name="delete" size={40} color={ theme == 'light' ? '#2C2C2C' : 'white'} />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: width * 0.9,
                              marginTop: 5,
                              gap: 4,
                            }}>
                            <TextInput
                              name="Cost Price"
                              placeholder={strings.PRICE}
                              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                              onChangeText={txt =>
                                handleCostPriceChange(index, txt)
                              }
                              style={{
                                width: width * 0.4,
                                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                                borderColor: '#f2f2f2',
                                borderRadius: 10,
                                padding: 10,
                                height: 50,
                                color: theme == 'light' ? 'black' : 'white',
                              }}
                              value={String(item.costprice)}
                            />
                            <NumericInput
                              totalWidth={170}
                              totalHeight={50}
                              minValue={1}
                              maxValue={999}
                              onChange={txt => handleQtyChange(index, txt)}
                              value={String(item.quantity)}
                              textColor="#B0228C"
                  iconStyle={{color: 'black'}}
                            />
                          </View>
                        </>
                      ))}
                    </>
                  ) : null}
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name={'camera'}
                  size={50}
                  color="#4171E1"
                  buttonText={'Select File'}
                  bgColor="#95a5a6"
                  btnWidth={0.4}
                  marginTop={20}
                  onPress={() => captureImage('photo')}
                />
                <Text
                  style={{
                    color: '#4171E1',
                    fontSize: 16,
                    marginTop: 20,
                  }}>
                 {strings.TAKE_PICTURE}
                </Text>
              </View>
              <View
                style={{marginTop: 10, alignItems: 'center', marginBottom: 10}}>
                {filePath ? (
                  <Image
                    source={{uri: filePath.uri}}
                    style={{width: 100, height: 100}}
                  />
                ) : (
                  <Image
                    source={{uri: `${ServerURL}/images/${inputs.picture}`}}
                    style={{width: 100, height: 100}}
                  />
                )}
              </View>
              <View style={{alignItems: 'center'}}>
              {hideButton?
              ( <AppButton
                buttonText={strings.EDIT}
                bgColor={COLORS.disable}
              />
              ) :(
                <AppButton
                onPress={handleEdit}
                buttonText={strings.EDIT}
                bgColor={COLORS.btnColor}
              />
              )}
                {/* <AppButton onPress={askDelete} buttonText={strings.DELETE} /> */}
              </View>
              <View style={{marginTop: 10}} />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderColor: COLORS.inputColor,
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
    padding: 8,

    fontFamily: 'Poppins-Medium',
  },
  icon: {
    marginRight: 5,
    color:COLORS.btnColor
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
    fontFamily:'Poppins-Medium'
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily:'Poppins-Medium'
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
