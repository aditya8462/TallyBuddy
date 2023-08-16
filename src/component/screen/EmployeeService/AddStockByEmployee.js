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
export default function AddStockByStore({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    product_id:'',
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
  const [product,setProduct]=useState([])
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
    if (!inputs.mrp) {
      handleErrors('Please Input mrp', 'mrp');
      isValid = false;
    } else if (inputs.totalamount.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.mrp)) {
        handleErrors('Please Input valid mrp', 'mrp');
        isValid = false;
      }
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
      productid:'',
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

  const handleCategoryId = (item, index) => {
    const data = [...stocklist];
    data[index].categoryid = item;
    setStockList([...data]);
    fetchBrand(item);
  };

  const handleDeleteInputs = index => {
    const deletename = [...stocklist];
    deletename.splice(index, 1);
    setStockList([...deletename]);
  };

  const handleInputStock = (index, text) => {
    const newInput = [...stocklist];
    newInput[index].stock = text;
    setStockList(newInput);
  };

  const handleInputMrp = (index, text) => {
    const newInput = [...stocklist];
    newInput[index].totalamount = text;
    setStockList(newInput);
  };

  const handleQtyChange = (index, text) => {
    const newInputs = [...subItemsList];
    newInputs[index].qty = text;
    setSubItemsList(newInputs);
  };

  const handleQtyChangeRawmaterial = (index, text) => {
    const newInputs = [...stocklist];
    newInputs[index].quantity = text;
    setStockList(newInputs);
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

  const handleCreate = async () => {

    const asyncData = await getStoreData('EMPLOYEE');
   
    var body = {
      billno: inputs.billno,
      vendorid: vendorlist,
      added_by: asyncData.name,
      itemDetails: stocklist,
      store_id:asyncData.store_id,
    }
    setHideButton(true);
    const result = await postData('stock/', body);
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
                  </>
              ))}
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
        </View>
      </ScrollView>
    </ImageBackground>

  );
}

