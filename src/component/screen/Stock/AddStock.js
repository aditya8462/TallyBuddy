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
import {getData, postData, postDataAxios} from '../../Connection/FetchServices';
import {Dimensions} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import ShortInputs from '../../uicomponents/ShortInputs';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import Ion from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {all} from 'axios';
import StockAdd from '../../uicomponents/StockAdd';
const {height, width} = Dimensions.get('window');
export default function AddStock({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    product_id: '',
    vendors_id: '',
    stock: '',
    colorFields: '',
    isSelected: '',
    totalamount: '',
    storeid: '',
    billno: '',
  });
  const [subItemsList, setSubItemsList] = useState([
    {productname: '', qty: '', costprice: '', totalamount: ''},
  ]);
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [product, setProduct] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const [colorFields, setColorFields] = useState([]);
  const [filePath, setFilePath] = useState(null);
  const [storeId, setStoreId] = useState('4');
  const [billno, setBillno] = useState('');
  const [stocklist, setStockList] = useState([
    {categoryid: '', brandid: '', modelid: '', totalamount: '', stock: ''},
  ]);
  const isFocused = useIsFocused();
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

    if (!billno) {
      handleErrors('Please Input Bill No.', 'billno');
      isValid = false;
    }
    if (!brandlist) {
      handleErrors('Please Select Brand Name', 'brand_id');
      isValid = false;
    }
    if (!categorylist) {
      handleErrors('Please Select Category Name', 'category_id');
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
    if (!productlist) {
      handleErrors('Please Select Product Name', 'product_id');
      isValid = false;
    }
    if (!inputs.stock) {
      handleErrors('Please Input Stock', 'stock');
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
  const fetchProduct = async model_id => {
    const result = await getData('product/byModel/' + model_id);
    setProduct(result.data);
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

  const handleAddDropDown = () => {
    const newInputs = [...stocklist];
    newInputs.push({
      categoryid: '',
      brandid: '',
      modelid: '',
      productid: '',
      totalamount: '',
      stock: '',
      color: [],
    });
    setStockList(newInputs);
  };

  const handleDeleteDropDown = () => {
    const deletename = [...stocklist];
    deletename.pop();
    setStockList([...deletename]);
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

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');

    var body = {
      billno: inputs.billno,
      vendorid: vendorlist,
      added_by: asyncData
        ? asyncData.name
        : superAdmin.name || employeeAdmin.name || storeAdmin.name,
      itemDetails: stocklist,
      storeid: '',
    };

    setHideButton(true);
    const result = await postData('stock/', body);
    //  alert(JSON.stringify(result));
    //   console.log('-------->', result);
    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.STOCK_ADDED_SUCCESSFULLY,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'success',
        cancellable: true,
      });
      //  navigation.goBack();
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
  const [productlist, setProductList] = useState('');
  const handleProduct = itemValue => {
    setProductList(itemValue);
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
            {strings.ADD_STOCK}
          </Text>
          <View>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                error={error.billno}
                onFocus={() => handleErrors(null, 'billno')}
                onChangeText={txt => handleValues(txt.trimStart(), 'billno')}
                placeholder={strings.BILL_NO}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
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
                        fontSize: 10,
                        fontFamily: 'Poppins-SemiBold',
                        color: 'red',
                        marginRight: width * 0.55,
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
                  {stocklist.length > 1 ? (
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

              {stocklist.map((item, index) => (
                <>
                  <StockAdd
                    stocklist={stocklist}
                    index={index}
                    item={item}
                    setStockList={setStockList}
                    navigation={navigation}
                    error={error}
                  />
                  {/* <View><Text style={{color:'red'}}>{error.brand_id}</Text></View> */}

                  {/* {error.category_id ? (
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
                        selectedValue={item.categoryid}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleCategoryId(itemValue,index);
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
                      selectedValue={item.categoryid}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleCategoryId(itemValue,index);
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
                        selectedValue={item.brandid}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                            handleBrandId(itemValue,index);
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
                      selectedValue={item.brandid}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleBrandId(itemValue,index);
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
                        selectedValue={item.modelid}
                        style={{
                          height: 50,
                          width: '80%',
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                            handleModelId(itemValue,index);
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
                      selectedValue={item.modelid}
                      style={{
                        height: 50,
                        width: '80%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleModelId(itemValue,index);
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
              )} */}

                  {/* <Input
                error={error.mrp}
                onFocus={() => handleErrors(null, 'mrp')}
                onChangeText={txt => handleInputMrp(index, txt)}
                placeholder={strings.MRP}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              /> */}
                </>
              ))}

              {/* <Input
                error={error.mrp}
                onFocus={() => handleErrors(null, 'mrp')}
                onChangeText={txt => handleValues(txt.trimStart(), 'mrp')}
                placeholder={strings.MRP}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              /> */}
              {/* <Input
                error={error.costprice}
                onFocus={() => handleErrors(null, 'costprice')}
                onChangeText={txt => handleValues(txt.trimStart(), 'costprice')}
                placeholder={strings.COST_PER_UNIT}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              /> */}
              {/* <Input
                error={error.stock}
                onFocus={() => handleErrors(null, 'stock')}
                placeholder={strings.STOCK}
                autoCompleteType="off"
                keyboardType="numeric"
                fontAwesome="cubes"
                onChangeText={handleNumInputChange}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              /> */}

              {/* {colorFields.map((item, index) => (
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
              ))} */}
              {/* <View style={{alignItems: 'flex-start', width: width * 0.87}}>
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
              </View> */}
              {/* <View
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
              </View> */}
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
