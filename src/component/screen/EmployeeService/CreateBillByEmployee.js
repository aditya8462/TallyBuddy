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
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import StoreBottom from '../StoreBottomNavigation/StoreBottom';
import ShortInputs from '../../uicomponents/ShortInputs';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { useDispatch, useSelector } from 'react-redux';

const {height, width} = Dimensions.get('window');

export default function CreateBillByEmployee({navigation, route}) {
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
    {productname: '', qty: '', costprice: '',mrp:''},
  ]);
  const [error, setError] = useState({});
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [category, setCategory] = useState([]);
  const [isFocusCategory, setIsFocusCategory] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusVendor, setIsFocusVendor] = useState(false);
  const [isFocusModel, setIsFocusModel] = useState(false);
  const [colorFields, setColorFields] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [storeId, setStoreId] = useState('4');
  const isFocused = useIsFocused();
  const product = useSelector(state => state.cart);
  const productDetails = Object.values(product);
  const [quantity, setQuantity] = useState(1);
  const [hideButton,setHideButton]=useState(false)


  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const dispatch = useDispatch();


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
    if (!inputs.category_id) {
      handleErrors('Please Select Category Name', 'category_id');
      isValid = false;
    }
    if (!inputs.brand_id) {
      handleErrors('Please Select Brand Name', 'brand_id');
      isValid = false;
    }
    if (!inputs.model_id) {
      handleErrors('Please Select Model Name', 'model_id');
      isValid = false;
    }
    if (!inputs.vendors_id) {
      handleErrors('Please Select Vendor Name', 'vendor_id');
      isValid = false;
    }
    if (!inputs.stock) {
      handleErrors('Please Input Stock', 'stock');
      isValid = false;
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
      }}
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
      }}
   
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

  useEffect(function () {
    fetchActiveVendor();
    fetchCategory();
    selectedLng();
  }, [isFocused]);
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

  const CategoryDropdownComponent = category_id => {
    
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={{
            height: 50,
            width: width * 0.9,
            borderColor: 'white',
            borderRadius: 8,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            padding: 8,
          }}
          placeholderStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          selectedTextStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          iconStyle={styles.iconStyle}
          itemTextStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          containerStyle={{
            flex: 1,
            backgroundColor: theme == 'light' ? '#ecf0f1' : '#2C2C2C',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={category}
          maxHeight={200}
          labelField="name"
          valueField="category_id"
          placeholder={!isFocusCategory ? strings.SELECT_CATEGORY : '...'}
          searchPlaceholder="Search..."
          value={inputs.category_id}
          onFocus={() => setIsFocusCategory(true)}
          onBlur={() => setIsFocusCategory(false)}
          onChange={item => {
            fetchBrand(item.category_id);
            handleValues(item.category_id, 'category_id');
            setIsFocusCategory(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusCategory}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };


 

  const BrandDropdownComponent = brand_id => {
   
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={{
            height: 50,
            width: width * 0.9,
            borderColor: 'white',
            borderRadius: 8,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            padding: 8,
          }}
          placeholderStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          selectedTextStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          iconStyle={styles.iconStyle}
          itemTextStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          containerStyle={{
            flex: 1,
            backgroundColor: theme == 'light' ? '#ecf0f1' : '#2C2C2C',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={brand}
          maxHeight={200}
          labelField="brand_name"
          valueField="brand_id"
          placeholder={!isFocus ? strings.SELECT_BRAND : '...'}
          searchPlaceholder="Search..."
          value={inputs.brand_id}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            fetchModel(item.brand_id);
            handleValues(item.brand_id, 'brand_id');
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const ModelDropdownComponent = model_id => {
    
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={{
            height: 50,
            width: width * 0.9,
            borderColor: 'white',
            borderRadius: 8,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            padding: 8,
          }}
          placeholderStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          selectedTextStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          iconStyle={styles.iconStyle}
          itemTextStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          containerStyle={{
            flex: 1,
            backgroundColor: theme == 'light' ? '#ecf0f1' : '#2C2C2C',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={model}
          maxHeight={200}
          labelField="name"
          valueField="model_id"
          placeholder={!isFocus ? strings.SELECT_MODEL : '...'}
          searchPlaceholder="Search..."
          value={inputs.model_id}
          onFocus={() => setIsFocusModel(true)}
          onBlur={() => setIsFocusModel(false)}
          onChange={item => {
            handleValues(item.model_id, 'model_id');
            setIsFocusModel(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusModel}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const handleQuantityChange = text => {
    setQuantity(text);
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

  const VendorDropdownComponent = vendors_id => {
   
    return (
      <View>
      
        <Dropdown
          style={[styles.dropdown, isFocusVendor && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily: 'Poppins-Medium', fontSize: 14}}
          containerStyle={{
            flex: 1,
            backgroundColor: '#ecf0f1',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={vendor}
          maxHeight={200}
          labelField="firm_name"
          valueField="vendors_id"
          placeholder={!isFocusVendor ? strings.SELECT_VENDOR : '...'}
          searchPlaceholder="Search..."
          value={inputs.vendors_id}
          onFocus={() => setIsFocusVendor(true)}
          onBlur={() => setIsFocusVendor(false)}
          onChange={item => {
            handleValues(item.vendors_id, 'vendors_id');
            setIsFocusVendor(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusVendor}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const handleCreate = async () => {
    const asyncData = await getStoreData('EMPLOYEE');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('categoryid', inputs.category_id);
      formdata.append('added_by', asyncData.name)
      formdata.append('brandid', inputs.brand_id);
      formdata.append('modelid', inputs.model_id);
      formdata.append('vendorid', inputs.vendors_id);
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
      console.log('hiiiii', formdata);
      setHideButton(true)
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

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
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
            <View
              style={{
                alignItems: 'center',
                marginTop:20
              }}>
                 {error.category_id ? (
                <View>
                  {CategoryDropdownComponent()}
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
                <View>{CategoryDropdownComponent()}</View>
              )}
              {error.brand_id ? (
                <View style={{marginTop: 10}}>
                  {BrandDropdownComponent()}
                  <Text
                    style={{
                      color: 'red',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 11,
                    }}>
                    {error.brand_id}
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 10}}>{BrandDropdownComponent()}</View>
              )}
              {error.model_id ? (
                <View style={{marginTop: 10}}>
                  {ModelDropdownComponent()}
                  <Text
                    style={{
                      color: 'red',
                      fontFamily: 'Poppins-Medium',
                      fontSize: 11,
                    }}>
                    {error.model_id}
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 10}}>{ModelDropdownComponent()}</View>
              )}
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
                placeholder={strings.OFFER_PRICE}
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
              />
              <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 15,marginRight:width*0.58}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  alignItems: 'center',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 14,
                  marginLeft:width * 0.07
                }}>
                {strings.QUANTITY}:
              </Text>

              <View style={{marginLeft: 5}}>
                <NumericInput
                  totalWidth={110}
                  minValue={1}
                  maxValue={999}
                  totalHeight={35}
                  onChange={txt => handleQuantityChange(txt)}
                  value={quantity}
                  valueType="real"
                  rounded
                  textColor="#B0228C"
                  iconStyle={{color: 'black'}}
                />
              </View>
            </View>

              {colorFields.map((item, index) => (
                <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: width * 0.9,
                }}>
                <ShortInputs
                  error={error.color}
                  onFocus={() => handleErrors(null, 'color')}
                  placeholder={strings.COLOR}
                  onChangeText={text => handleColorInputChange(index, text)}
                  value={item.color}
                  contWidth={width * 0.44}
                  materialIcons="color-lens"
                />
                <ShortInputs
                  error={error.stock}
                  onFocus={() => handleErrors(null, 'stock')}
                  placeholder={strings.STOCK}
                  onChangeText={text => handleStockChange(index, text)}
                  value={item.stock}
                  contWidth={width * 0.44}
                  fontAwesome="cubes"
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
                    fontFamily:'Poppins-Bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    marginBottom: 5,
                  }}>
                    {strings.SUB_ITEMS}
                  </Text>
                  {isSelected ? (
                    <TouchableOpacity onPress={handleAddInput}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily:'Poppins-Bold',
                          color: theme == 'light' ? '#2C2C2C' : '#fff',
                          marginBottom: 5,
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
                            <Icon name="delete" size={40}  color= {theme == 'light' ? '#2C2C2C' : '#fff'} />
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
            {hideButton?
              ( <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
              />
              ) :(
                <AppButton
                onPress={handleCreate}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
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
    color:COLORS.btnColor
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
