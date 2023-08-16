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
} from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
// import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, postData, postDataAxios} from '../../Connection/FetchServices';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dimensions} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../../helper/Colors';

import {getStoreData} from '../../storage/AsyncStorage';
import strings from '../../../changeLanguage/LocalizedString';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';
// import { color } from 'react-native-elements/dist/helpers';

const {width, height} = Dimensions.get('window');

export default function RaiseServices({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    product_id: '',
    stock: '',
    colorFields: '',
    isSelected: '',
    costprice: '',
    store_id: '',
  });

  const [subItemsList, setSubItemsList] = useState([
    {productname: '', qty: '', costprice: ''},
  ]);
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  // const [checked, setChecked] = React.useState('first');
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusStore, setIsFocusStore] = useState(false);
  const [isFocusCategory, setIsFocusCategory] = useState(false);
  const [isFocusProduct, setIsFocusProduct] = useState(false);
  const [isFocusModel, setIsFocusModel] = useState(false);
  const [colorFields, setColorFields] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [checked, setChecked] = React.useState('first');
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false)
  const [employee, setEmployee] = useState('');
  const [loader, setLoader] = useState(true);

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
    if (!inputs.product_id) {
      handleErrors('Please Select Product Name', 'product_id');
      isValid = false;
    }
    if (!inputs.store_id) {
      handleErrors('Please Select Store Name', 'store_id');
      isValid = false;
    } 
    return isValid;
  };

  const fetchEmployee = async () => {
    setLoader(true);
    var result = await getStoreData('EMPLOYEE');
    if (result) {
      setEmployee(result);
    }
    setLoader(false);
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

  const fetchProduct = async model_id => {
    const result = await getData('product/byModel/' + model_id);
    console.log(result);
    setProduct(result.data);
    console.log('product', result.data);
  };
  const fetchStore = async store_id => {
    const result = await getData('store', {store_id: store_id});
    setStore(result.data);
  };

  useEffect(function () {
    fetchCategory();
    fetchEmployee();
    fetchStore();
    selectedLng()
  }, [isFocused]);
  // const handleonChange=(event)=>{
  //  setBrand(event.target.value)
  // }

  const BrandDropdownComponent = brand_id => {
    return (
      <View>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily:'Poppins-Medium',fontSize:14}}
          containerStyle={{flex: 1, backgroundColor: "#ecf0f1",borderRadius:20,marginTop:-60,padding:10,fontFamily:'Poppins-Medium',}}
          data={brand}
          // search
          maxHeight={200}
          labelField="brand_name"
          valueField="brand_id"
          placeholder={!isFocus ? strings.SELECT_BRAND : '...'}
          // searchPlaceholder="Search..."
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
        <Dropdown
          style={[styles.dropdown, isFocusModel && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily:'Poppins-Medium',fontSize:14}}
          containerStyle={{flex: 1, backgroundColor: "#ecf0f1",borderRadius:20,marginTop:-60,padding:10,fontFamily:'Poppins-Medium',}}
          data={model}
          // search
          maxHeight={200}
          labelField="name"
          valueField="model_id"
          placeholder={!isFocusModel ? strings.SELECT_MODEL : '...'}
          // searchPlaceholder="Search..."
          value={inputs.model_id}
          onFocus={() => setIsFocusModel(true)}
          onBlur={() => setIsFocusModel(false)}
          onChange={item => {
            fetchProduct(item.model_id);
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

  const DropdownComponent = category_id => {
    // const renderLabel = () => {
    //   if (value || isFocus) {
    //     return (
    //       <Text style={[styles.label, isFocus && {color: 'blue'}]}>
    //         Dropdown label
    //       </Text>
    //     );
    //   }
    //   return null;
    // };
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={[styles.dropdown, isFocusCategory && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily:'Poppins-Medium',fontSize:14}}
          containerStyle={{flex: 1, backgroundColor: "#ecf0f1",borderRadius:20,marginTop:-60,padding:10,fontFamily:'Poppins-Medium',}}
          data={category}
          // search
          maxHeight={200}
          labelField="name"
          valueField="category_id"
          placeholder={!isFocusCategory ? strings.SELECT_CATEGORY : '...'}
          // searchPlaceholder="Search..."
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

  const ProductDropdownComponent = product_id => {
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={[styles.dropdown, isFocusProduct && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily:'Poppins-Medium',fontSize:14}}
          containerStyle={{flex: 1, backgroundColor: "#ecf0f1",borderRadius:20,marginTop:-60,padding:10,fontFamily:'Poppins-Medium',}}
          data={product}
          // search
          maxHeight={200}
          labelField="product_name"
          valueField="product_id"
          placeholder={!isFocusProduct ? strings.SELECT_PRODUCT : '...'}
          // searchPlaceholder="Search..."
          value={inputs.product_id}
          onFocus={() => setIsFocusProduct(true)}
          onBlur={() => setIsFocusProduct(false)}
          onChange={item => {
            handleValues(item.product_id, 'product_id');
            setIsFocusProduct(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusProduct}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const StoreDropdownComponent = store_id => {
    // const renderLabel = () => {
    //   if (value || isFocus) {
    //     return (
    //       <Text style={[styles.label, isFocus && {color: 'blue'}]}>
    //         Dropdown label
    //       </Text>
    //     );
    //   }
    //   return null;
    // };
    return (
      <View>
        {/* {renderLabel()} */}
        <Dropdown
          style={[styles.dropdown, isFocusStore && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{fontFamily:'Poppins-Medium',fontSize:14}}
          containerStyle={{flex: 1, backgroundColor: "#ecf0f1",borderRadius:20,marginTop:-60,padding:10,fontFamily:'Poppins-Medium',}}
          data={store}
          // search
          maxHeight={300}
          labelField="name"
          valueField="store_id"
          placeholder={!isFocusStore ? strings.SELECT_STORE : '...'}
          // searchPlaceholder="Search..."
          value={inputs.store_id}
          onFocus={() => setIsFocusStore(true)}
          onBlur={() => setIsFocusStore(false)}
          onChange={item => {
            handleValues(item.store_id, 'store_id');
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusStore}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const handleSubmit = async () => {
    if(validate()) {
    var body = {
      categoryid: inputs.category_id,
      brandid: inputs.brand_id,
      modelid: inputs.model_id,
      productid: inputs.product_id,
      fromstoreid: employee.store_id,
      tostoreid: inputs.store_id,
      employeeid: employee.employee_id,
      //   demand_id, categoryid, brandid, modelid, productid, fromstoreid, tostoreid, employeeid, status, created_at, updated_at
    };
    // console.log('hiiiii',formdata);
    console.log(body)
    const result = await postData('demand', body);
    console.log('-------->', result);

    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.RAISE_DEMAND_SUCCESSFULLY,
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
  };
  // }

  const handleValues = (txt, attr) => {
    console.log(txt, attr);
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleColorInputChange = (index, txt) => {
    const data = [...colorFields];
    data[index] = txt;
    setColorFields([...data]);
  };

  return (
    <ScrollView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{
          flex: 1,
          zIndex: 9999,
          height,
          width: '100%',
          backgroundColor: '#fff',
        }}>
        <View>
          
          <View
            style={{
              alignItems: 'center',
            }}>
            {error.category_id ? (<View style={{marginTop: 10}}>{DropdownComponent()}
          <Text style={{color:"red",fontFamily:'Poppins-Medium',fontSize:11}}>{error.category_id}</Text>
          </View>):(<View style={{marginTop: 10}}>{DropdownComponent()}
          </View>)}
          {error.brand_id ? (<View style={{marginTop: 10}}>{BrandDropdownComponent()}
          <Text style={{color:"red",fontFamily:'Poppins-Medium',fontSize:11}}>{error.brand_id}</Text>
          </View>):(<View style={{marginTop: 10}}>{BrandDropdownComponent()}
          </View>)}
          {error.model_id ? (<View style={{marginTop: 10}}>{ModelDropdownComponent()}
          <Text style={{color:"red",fontFamily:'Poppins-Medium',fontSize:11}}>{error.model_id}</Text>
          </View>):(<View style={{marginTop: 10}}>{ModelDropdownComponent()}
          </View>)}
          {error.product_id ? (<View style={{marginTop: 10}}>{ProductDropdownComponent()}
          <Text style={{color:"red",fontFamily:'Poppins-Medium',fontSize:11}}>{error.product_id}</Text>
          </View>):(<View style={{marginTop: 10}}>{ProductDropdownComponent()}
          </View>)}
          {error.store_id ? (<View style={{marginTop: 10}}>{StoreDropdownComponent()}
          <Text style={{color:"red",fontFamily:'Poppins-Medium',fontSize:11}}>{error.store_id}</Text>
          </View>):(<View style={{marginTop: 10}}>{StoreDropdownComponent()}
          </View>)}
            <View style={{alignSelf: 'center', marginTop: height * 0.05}}>
              <AppButton onPress={handleSubmit} buttonText={strings.RAISE_DEMAND} />
            </View>
            {/* <View style={{ marginTop: 10 }} /> */}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
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
    // color: '#2C2C2C', textAlign: 'left',fontSize:14,fontFamily:'Poppins-Medium'
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
