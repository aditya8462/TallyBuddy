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
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, postDataAxios} from '../../Connection/FetchServices';
import {Dimensions} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import ShortInputs from '../../uicomponents/ShortInputs';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

import Ion from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

const {height, width} = Dimensions.get('window');

export default function CreateManufacturing({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    vendors_id: '',
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
  const [rawMaterial, setRawMaterial] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusCategory, setIsFocusCategory] = useState(false);
  const [isFocusVendor, setIsFocusVendor] = useState(false);
  const [isFocusRawmaterial, setIsFocusRawmaterial] = useState(false);

  const [isFocusModel, setIsFocusModel] = useState(false);
  const [colorFields, setColorFields] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [storeId, setStoreId] = useState('4');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const handleNumInputChange = text => {
    handleValues(text, 'stock');
    let arr = [];
    for (let i = 0; i < text; i++) {
      arr.push({color: ''});
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
      handleErrors('Please Input mrp', 'mrp');
      isValid = false;
    } else if (inputs.mrp.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.mrp)) {
        handleErrors('Please Input valid mrp', 'mrp');
        isValid = false;
      }
    }
    if (!inputs.costprice) {
      handleErrors('Please Input costprice', 'costprice');
      isValid = false;
    } else if (inputs.costprice.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.costprice)) {
        handleErrors('Please Input valid costprice', 'costprice');
        isValid = false;
      }
    }
    if (!rawmateriallist.length) {
      handleErrors('Please Input Cost ', 'rawmaterial');
      isValid = false;
    } else if (rawmateriallist.length && !rawmateriallist[0].rawmaterialid) {
      handleErrors('Please Select rawmaterial ', 'rawmaterial');
      isValid = false;
    }

    return isValid;
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

  const fetchActiveVendor = async () => {
    const result = await getData('vendor/display/active');
    console.log(result);
    setVendor(result.data);
  };
  const fetchRawmaterial = async () => {
    const result = await getData('rawmaterial');
    console.log(result);
    setRawMaterial(result.data);
  };
  const [rawmateriallist, setRawmaterialList] = useState([
    {rawmaterialid: '', quantity: 0},
  ]);

  const handleAddDropDown = () => {
    const newInputs = [...rawmateriallist];
    newInputs.push({rawmaterialid: '', quantity: 0});
    setRawmaterialList(newInputs);
  };

  const handleDeleteDropDown = () => {
    const deletename = [...rawmateriallist];
    deletename.pop();
    setRawmaterialList([...deletename]);
  };

  useEffect(
    function () {
      fetchCategory();
      fetchActiveVendor();
      fetchRawmaterial();
      selectedLng();
    },
    [isFocused],
  );
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

  const handleAddInputs = () => {
    const newInputs = [...rawMaterialList];
    newInputs.push({rawmaterialname: '', qty: ''});
    setRawmaterialList(newInputs);
  };

  const productChange = (index, text) => {
    const newInputs = [...rawMaterialList];
    newInputs[index] = text;
    setRawmaterialList(newInputs);
  };
  const handleRawmaterialId = (item, index) => {
    const data = [...rawmateriallist];
    data[index].rawmaterialid = item;
    setRawmaterialList([...data]);
  };

  const handleDeleteInputs = index => {
    const deletename = [...rawMaterialList];
    deletename.splice(index, 1);
    setRawmaterialList([...deletename]);
  };

  const handleQtyChanges = (index, text) => {
    const newInputs = [...rawMaterialList];
    newInputs[index].qty = text;
    setRawMaterial(newInputs);
  };

  const handleAddInput = () => {
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

  const handleQtyChangeRawmaterial = (index, text) => {
    const newInputs = [...rawmateriallist];
    newInputs[index].quantity = text;
    setRawmaterialList(newInputs);
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

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('categoryid', categorylist);
      formdata.append('brandid', brandlist);
      formdata.append('modelid', modellist);
      formdata.append('vendorid', vendorlist);
      formdata.append('mrp', inputs.mrp);
      formdata.append('costprice', inputs.costprice);
      // formdata.append('stock', inputs.stock);
      formdata.append('color', JSON.stringify(colorFields));
      formdata.append('subitems', isSelected);
      formdata.append(
        'added_by',
        asyncData
          ? asyncData.name
          : superAdmin.name || employeeAdmin.name || storeAdmin.name,
      );
      formdata.append('subitemlist', JSON.stringify(subItemsList));
      formdata.append('rawmaterial', JSON.stringify(rawmateriallist));
      formdata.append('picture', {
        ...filePath,
      });
      setHideButton(true);
      const result = await postDataAxios('manufacturing', formdata);
      console.log('-------->', result);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.MANUFACTURING_CREATED_SUCCESSFULLY,
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
    setHideButton(false);
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
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              paddingTop: 10,
              paddingLeft: 5,
            }}>
            {strings.CREATE_MANUFACTURING}
          </Text>
          <View>
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
                        marginRight: width * 0.4,
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
                        marginRight: width * 0.4,
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
                        marginRight: width * 0.4,
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
                          return (
                            <Picker.Item
                              label={itm.firm_name}
                              value={String(itm.vendors_id)}
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
                        marginRight: width * 0.4,
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
              <View style={{width: width}}>
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
                        fontFamily: 'Poppins-Bold',
                        color: theme == 'light' ? '#2C2C2C' : '#fff',
                        paddingLeft: width * 0.04,
                      }}>
                      {strings.ADD_MORE}
                    </Text>
                  </TouchableOpacity>
                  {rawmateriallist.length > 1 ? (
                    <TouchableOpacity onPress={() => handleDeleteDropDown()}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins-Bold',
                          color: theme == 'light' ? '#2C2C2C' : '#fff',
                          paddingRight: width * 0.05,
                        }}>
                        {strings.DELETE}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {rawmateriallist.map((item, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width * 0.9,
                    margin: 5,
                  }}>
                  <Picker
                    selectedValue={item.rawmaterialid}
                    style={{
                      height: 50,
                      width: '60%',
                      backgroundColor:
                        theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                    }}
                    onValueChange={itemValue => {
                      handleRawmaterialId(itemValue, index);
                    }}>
                    <Picker.Item label={'-Select RawMaterial-'} value={''} />
                    {rawMaterial.map(itm => {
                      console.log('===>', itm);
                      return (
                        <Picker.Item
                          label={itm.product_name}
                          value={itm.rawmaterial_id}
                        />
                      );
                    })}
                  </Picker>
                  <NumericInput
                    totalWidth={120}
                    minValue={1}
                    maxValue={999}
                    totalHeight={50}
                    textColor="#B0228C"
                    iconStyle={{color: 'black'}}
                    value={item.quantity}
                    onChange={txt => handleQtyChangeRawmaterial(index, txt)}
                  />
                </View>
              ))}
              <View style={{marginRight: width * 0.4}}>
                <Text style={{color: 'red', marginLeft: 6}}>
                  {error.rawmaterial}
                </Text>
              </View>

              <Input
                error={error.mrp}
                onFocus={() => handleErrors(null, 'mrp')}
                onChangeText={txt => handleValues(txt.trimStart(), 'mrp')}
                placeholder={strings.MRP}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.costprice}
                onFocus={() => handleErrors(null, 'costprice')}
                onChangeText={txt => handleValues(txt.trimStart(), 'costprice')}
                placeholder={strings.COST_PER_UNIT}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.stock}
                onFocus={() => handleErrors(null, 'stock')}
                placeholder={strings.STOCK}
                autoCompleteType="off"
                keyboardType="numeric"
                fontAwesome="cubes"
                onChangeText={handleNumInputChange}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
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
                      fontFamily: 'Poppins-Bold',
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.SUB_ITEMS}
                  </Text>
                  {isSelected ? (
                    <TouchableOpacity onPress={handleAddInput}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Poppins-Bold',
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
                            totalHeight={50}
                            minValue={1}
                            maxValue={999}
                            textColor="#B0228C"
                            iconStyle={{color: 'black'}}
                            onChange={txt => handleQtyChange(index, txt)}
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
