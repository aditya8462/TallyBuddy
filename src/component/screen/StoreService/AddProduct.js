/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Appearance,
} from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
// import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, postDataAxios} from '../../Connection/FetchServices';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import StoreBottom from '../StoreBottomNavigation/StoreBottom';
import ShortInputs from '../../uicomponents/ShortInputs';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import Ion from 'react-native-vector-icons/Ionicons';

import {Picker} from '@react-native-picker/picker';
// import { color } from 'react-native-elements/dist/helpers';

const {height, width} = Dimensions.get('screen');

export default function AddProduct({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    vendors_id: '',
    stock: '',
    colorFields: '',
    isSelected: '',
    mrp: '',
    costprice: '',
    storeid: '',
  });
  const [subItemsList, setSubItemsList] = useState([
    {productname: '', qty: '', costprice: '', mrp: ''},
  ]);
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [vendor, setVendor] = useState([]);
  // const [checked, setChecked] = React.useState('first');
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusCategory, setIsFocusCategory] = useState(false);
  const [isFocusVendor, setIsFocusVendor] = useState(false);
  const [isFocusModel, setIsFocusModel] = useState(false);
  const [colorFields, setColorFields] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [storeId, setStoreId] = useState('4');
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const handleNumInputChange = text => {
    handleValues(text, 'stock');
    let arr = [];
    for (let i = 0; i < text; i++) {
      arr.push({color: '', stock: ''});
    }
    setColorFields([...arr]);
  };

  const validate = () => {
    var isValid = true;
    if (!categorylist) {
      handleErrors('Please Select Category Name', 'category_id');
      isValid = false;
    }
    if (!brandlist) {
      handleErrors('Please Select Brand Name', 'brand_id');
      isValid = false;
    }
    if (!modellist) {
      handleErrors('Please Select Model Name', 'model_id');
      isValid = false;
    }
    if (!vendorlist) {
      handleErrors('Please Select Vendor Name', 'vendor_id');
      isValid = false;
    }
    if (!inputs.stock) {
      handleErrors('Please Input Stock', 'stock');
      isValid = false;
    }
    if (!inputs.mrp) {
      handleErrors('Please input MRP ', 'mrp');
      isValid = false;
    }
    if (!inputs.costprice) {
      handleErrors('Please Input Cost ', 'costprice');
      isValid = false;
    }

    return isValid;
  };
  const fetchCategory = async category_id => {
    const result = await getData('category', {category_id: category_id});
    setCategory(result.data);
    // console.log('Category', result.data);
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

  const fetchActiveVendor = async () => {
    const result = await getData('vendor/display/active');
    console.log(result);
    setVendor(result.data);
    // console.log('Category', result.data);
  };

  useEffect(
    function () {
      fetchCategory();
      fetchActiveVendor();
      selectedLng();
    },
    [isFocused],
  );
  // const handleonChange=(event)=>{
  //  setBrand(event.target.value)
  // }
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

  const handleAddMore = () => {
    const newInputs = [...subItemsList];
    newInputs.push({productname: '', qty: '', costPrice: ''});
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

  const handleQtyChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].qty = text;
    setSubItemsList(newInputs);
  };

  const handleCostPriceChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].costprice = text;
    setSubItemsList(newInputs);
  };
  const handleColorInputChange = (index, txt) => {
    const data = [...colorFields];
    data[index].color = txt;
    setColorFields([...data]);
  };
  const handleStockChange = (index, text) => {
    const data = [...colorFields];
    data[index].stock = text;
    console.log(data);
    setColorFields(data);
  };
  const handleMRPChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].mrp = text;
    setSubItemsList(newInputs);
  };

  const handleKhali = () => {
    // alert('ki')
    setInputs('');
  };

  const handleCreate = async () => {
    const asyncData = await getStoreData('STORE');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('categoryid', categorylist);
      formdata.append('brandid', brandlist);
      formdata.append('modelid', modellist);
      formdata.append('vendorid', vendorlist);
      formdata.append('mrp', inputs.mrp);
      formdata.append('costprice', inputs.costprice);
      formdata.append('storeid', asyncData.store_id);
      formdata.append('stock', inputs.stock);
      formdata.append('color', JSON.stringify(colorFields));
      formdata.append('subitems', isSelected);
      formdata.append('added_by', asyncData.name);
      formdata.append('subitemlist', JSON.stringify(subItemsList));
      formdata.append('picture', {
        ...filePath,
      });
      setHideButton(true);
      console.log('hiiiii', formdata);
      const result = await postDataAxios('product', formdata);
      console.log('-------->', result);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.PRODUCT_CREATED_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
        // navigation.goBack();
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
    }
    setHideButton(false);
  };
  // }

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const [categorylist, setCategoryList] = useState('');
  const handleCategory = itemValue => {
    setCategoryList(itemValue);
    fetchBrand(itemValue);
  };
  const [brandlist, setBrandList] = useState('');
  const handleBrand = itemValue => {
    setBrandList(itemValue);
    fetchModel(itemValue);
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
      <ScrollView style={{flex: 1}}>
        <View>
          <View>
          <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                marginTop: 10,
              }}>
              {strings.CREATE_PRODUCT}
            </Text>
            <View
              style={{
                alignItems: 'center',
              }}>
              {error.category_id ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 0.9,
                        // margin: 5,
                      }}>
                      <Picker
                        selectedValue={categorylist}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleCategory(itemValue);
                        }}>
                        <Picker.Item label={'-Select Category-'} value={''} />
                        {category.map(itm => {
                          // console.log('===>', itm);
                          return (
                            <Picker.Item
                              label={itm.name}
                              value={itm.category_id}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Create Category')}>
                        <Ion
                          name={'add'}
                          size={30}
                          color={theme == 'light' ? '#2C2C2C' : '#fff'}
                          style={{margin: 9, marginRight: width * 0.2}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginRight:width*0.4
                      }}>
                      {error.category_id}
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.9,
                      // margin: 5,
                    }}>
                    <Picker
                      selectedValue={categorylist}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleCategory(itemValue);
                      }}>
                      <Picker.Item label={'-Select Category-'} value={''} />
                      {category.map(itm => {
                        // console.log('===>', itm);
                        return (
                          <Picker.Item
                            label={itm.name}
                            value={itm.category_id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Create Category')}>
                      <Ion
                        name={'add'}
                        size={30}
                        color={theme == 'light' ? '#2C2C2C' : '#fff'}
                        style={{margin: 9, marginRight: width * 0.2}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {error.brand_id ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 0.9,
                        // margin: 5,
                      }}>
                      <Picker
                        selectedValue={brandlist}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleBrand(itemValue);
                        }}>
                        <Picker.Item label={'-Select Brand-'} value={''} />
                        {brand.map(itm => {
                          // console.log('===>', itm);
                          return (
                            <Picker.Item
                              label={itm.brand_name}
                              value={itm.brand_id}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Create Brand')}>
                        <Ion
                          name={'add'}
                          size={30}
                          color={theme == 'light' ? '#2C2C2C' : '#fff'}
                          style={{margin: 9, marginRight: width * 0.2}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginRight:width*0.4
                      }}>
                      {error.brand_id}
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.9,
                      // margin: 5,
                    }}>
                    <Picker
                      selectedValue={brandlist}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleBrand(itemValue);
                      }}>
                      <Picker.Item label={'-Select Brand-'} value={''} />
                      {brand.map(itm => {
                        // console.log('===>', itm);
                        return (
                          <Picker.Item
                            label={itm.brand_name}
                            value={itm.brand_id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Create Brand')}>
                      <Ion
                        name={'add'}
                        size={30}
                        color={theme == 'light' ? '#2C2C2C' : '#fff'}
                        style={{margin: 9, marginRight: width * 0.2}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {error.model_id ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 0.9,
                        margin: 5,
                      }}>
                      <Picker
                        selectedValue={modellist}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleModel(itemValue);
                        }}>
                        <Picker.Item label={'-Select Model-'} value={''} />
                        {model.map(itm => {
                          // console.log('===>', itm);
                          return (
                            <Picker.Item
                              label={itm.name}
                              value={itm.model_id}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Create Model')}>
                      <Ion
                        name={'add'}
                        size={30}
                        color={theme == 'light' ? '#2C2C2C' : '#fff'}
                        style={{margin: 9, marginRight: width * 0.2}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginRight:width*0.4
                      }}>
                      {error.model_id}
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.9,
                      // margin: 5,
                    }}>
                    <Picker
                      selectedValue={modellist}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleModel(itemValue);
                      }}>
                      <Picker.Item label={'-Select Model-'} value={''} />
                      {model.map(itm => {
                        // console.log('===>', itm);
                        return (
                          <Picker.Item label={itm.name} value={itm.model_id} />
                        );
                      })}
                    </Picker>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Create Model')}>
                      <Ion
                        name={'add'}
                        size={30}
                        color={theme == 'light' ? '#2C2C2C' : '#fff'}
                        style={{margin: 9, marginRight: width * 0.2}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {error.vendor_id ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 0.9,
                        // margin: 5,
                      }}>
                      <Picker
                        selectedValue={vendorlist}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleVendor(itemValue);
                        }}>
                        <Picker.Item label={'-Select Vendor-'} value={''} />
                        {vendor.map(itm => {
                          // console.log('===>', itm);
                          return (
                            <Picker.Item
                              label={itm.firm_name}
                              value={itm.vendors_id}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Create Vendor')}>
                        <Ion
                          name={'add'}
                          size={30}
                          color={theme == 'light' ? '#2C2C2C' : '#fff'}
                          style={{margin: 9, marginRight: width * 0.2}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginRight:width*0.4
                      }}>
                      {error.vendor_id}
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.9,
                      // margin: 5,
                    }}>
                    <Picker
                      selectedValue={vendorlist}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleVendor(itemValue);
                      }}>
                      <Picker.Item label={'-Select Vendor-'} value={''} />
                      {vendor.map(itm => {
                        // console.log('===>', itm);
                        return (
                          <Picker.Item
                            label={itm.firm_name}
                            value={itm.vendors_id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Create Vendor')}>
                      <Ion
                        name={'add'}
                        size={30}
                        color={theme == 'light' ? '#2C2C2C' : '#fff'}
                        style={{margin: 9, marginRight: width * 0.2}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Input
                error={error.mrp}
                onFocus={() => handleErrors(null, 'mrp')}
                onChangeText={txt => handleValues(txt, 'mrp')}
                placeholder={strings.MRP}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                value={inputs.mrp}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.costprice}
                onFocus={() => handleErrors(null, 'costprice')}
                onChangeText={txt => handleValues(txt, 'costprice')}
                placeholder={strings.COST_PER_UNIT}
                keyboardType="numeric"
                autoCompleteType="off"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                fontAwesome="rupee"
                value={inputs.costprice}
              />
              <Input
                error={error.stock}
                onFocus={() => handleErrors(null, 'stock')}
                // onChangeText={txt => handleValues(txt, 'stock')}
                placeholder={strings.STOCK}
                autoCompleteType="off"
                keyboardType="numeric"
                fontAwesome="cubes"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                onChangeText={handleNumInputChange}
                value={inputs.stock}
              />

              {colorFields.map((item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: width * 0.9,
                  }}>
                  <Input
                    error={error.color}
                    onFocus={() => handleErrors(null, 'color')}
                    placeholder={strings.COLOR}
                    onChangeText={text => handleColorInputChange(index, text)}
                    value={item.color}
                    // contWidth={width * 0.44}
                    materialIcons="color-lens"
                  />
                </View>
              ))}
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
                      fontWeight: 'bold',
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.SUB_ITEMS}
                  </Text>
                  {isSelected ? (
                    <TouchableOpacity onPress={handleAddMore}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
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
                            justifyContent: 'space-evenly',
                            width: width * 0.8,
                            // marginTop: 15,
                            alignItems: 'center',
                          }}>
                          <Input
                            name="Product"
                            placeholder={strings.PRODUCT_NAME}
                            onChangeText={txt => handleInputChange(index, txt)}
                            contWidth={width * 0.72}
                            entypo="add-to-list"
                          />
                          <TouchableOpacity
                            onPress={() => handleDeleteInput(index)}>
                            <Icon name="delete" size={40} />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            width: width * 0.9,
                          }}>
                          <ShortInputs
                            name="MRP"
                            placeholder={strings.MRP}
                            onChangeText={txt => handleMRPChange(index, txt)}
                            fontAwesome="rupee"
                          />
                          <ShortInputs
                            name="Cost Price"
                            placeholder={strings.OFFER_PRICE}
                            onChangeText={txt =>
                              handleCostPriceChange(index, txt)
                            }
                            fontAwesome="rupee"
                          />
                        </View>
                        <View style={{marginTop: 10}}>
                          <NumericInput
                            totalWidth={170}
                            minValue={1}
                            maxValue={999}
                            totalHeight={50}
                            onChange={txt => handleQtyChange(index, txt)}
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
              ) : null}
            </View>

            <View style={{alignSelf: 'center'}}>
              {hideButton ? (
                <AppButton
                  buttonText={strings.CREATE}
                  bgColor={COLORS.disable}
                  btnWidth={0.8}
                />
              ) : (
                <AppButton
                  onPress={handleCreate}
                  buttonText={strings.CREATE}
                  bgColor={COLORS.btnColor}
                  btnWidth={0.8}
                />
              )}
            </View>
            <View style={{marginTop: 10}} />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    width: width * 0.9,
    borderColor: COLORS.inputColor,
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
    backgroundColor: COLORS.inputColor,
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
