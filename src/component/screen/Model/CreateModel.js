/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  Appearance,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {postData, getData} from '../../Connection/FetchServices';
import {Dimensions} from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';

import {Picker} from '@react-native-picker/picker';
const {height, width} = Dimensions.get('window');

export default function CreateModel({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    name: '',
    model_no: '',
    discount: '',
    status: '',
  });
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [checked, setChecked] = React.useState('first');
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusCategory, setIsFocusCategory] = useState(false);
  const [value, setValue] = useState(null);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)


  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

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
    if (!inputs.name) {
      handleErrors('Please Input Name', 'name');
      isValid = false;
    } 
    if (!inputs.model_no) {
      handleErrors('Please Input model no.', 'model_no');
      isValid = false;
    } 
    if (!inputs.discount) {
      handleErrors('Please Input Discount', 'discount');
      isValid = false;
    } else if (inputs.discount.length) {
      if (isNaN(inputs.discount.length)) {
        handleErrors('Please Input valid Discount', 'discount');
        isValid = false;
      }
    }
    return isValid;
  };
  const fetchActiveCategory = async category_id => {
    const result = await getData('category/display/active', {
      category_id: category_id,
    });
    setCategory(result.data);
  };

  const fetchBrand = async category_id => {
    const result = await getData('brand/byCategory/' + category_id);
    setBrand(result.data);
  };

  useEffect(function () {
    fetchActiveCategory();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchActiveCategory();
    }, []),
  );


 

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');
    if (validate()) {
      let body = {
        category_id: categorylist,
        brand_id: brandlist,
        name: inputs.name,
        model_no: inputs.model_no,
        discount: inputs.discount,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name||employeeAdmin.name||storeAdmin.name,
      };
      setHideButton(true)
      const result = await postData('model', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.MODEL_CREATED_SUCCESSFULLY,
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
  // }

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const [categorylist,setCategoryList]=useState('')
  const handleCategory=(itemValue)=>{
   setCategoryList(itemValue)
   
   fetchBrand(itemValue)
  }
  const [brandlist,setBrandList]=useState('')
 const handleBrand=(itemValue)=>{
  setBrandList(itemValue)
 }
  return (
    <ScrollView style={{flex: 1}}>
      <View>
        <ImageBackground
          source={require('../../assets/background.png')}
          style={{
            // flex: 1,
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                marginTop: 10,
              }}>
              {strings.CREATE_MODEL}
            </Text>
            <View
              style={{
                alignItems: 'center',
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
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                         handleCategory(itemValue)
                        //  alert(itemValue);
                        }}>
                       <Picker.Item label={'-Select Category-'} value={''} />
                       {category.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.name}
                             value={itm.category_id}
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
                        marginLeft:width*0.32
                      }}>
                      {error.category_id}
                    </Text>
                 </View>
              ) : (
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
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleCategory(itemValue)
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
              )}
              {error.brand_id ? (
               <View style={{marginTop: 10}}>
               <View
                 style={{
                   flexDirection: 'row',
                   justifyContent: 'center',
                   width: width * 1.5,
                   margin: 5,
                 }}>
                  <Picker
                      selectedValue={brandlist}
                       style={{
                         height: 50,
                         width: '60%',
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                         handleBrand(itemValue)
                        }}>
                       <Picker.Item label={'-Select Brand-'} value={''} />
                       {brand.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.brand_name}
                             value={itm.brand_id}
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
                        marginLeft:width*0.32
                      }}>
                      {error.brand_id}
                    </Text>
                 </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: width * 1.5,
                    margin: 5,
                  }}>
                
                <Picker
               selectedValue={brandlist}
              style={{
                height: 50,
                width: '60%',
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleBrand(itemValue)
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
              )}
              <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder={strings.MODEL_NAME}
                autoCompleteType="off"
                simpleLineIcons="user"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />


<Input
                error={error.model_no}
                onFocus={() => handleErrors(null, 'model_no')}
                onChangeText={txt => handleValues(txt.trimStart(), 'model_no')}
                placeholder={strings.MODEL_NUMBER}
                autoCompleteType="off"
                simpleLineIcons="user"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.discount}
                onFocus={() => handleErrors(null, 'discount')}
                onChangeText={txt => handleValues(txt.trimStart(), 'discount')}
                placeholder={strings.DISCOUNT}
                autoCompleteType="off"
                fontAwesome="percent"
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily:'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 14,
                  marginLeft: 20,
                }}>
               {strings.STATUS}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginLeft: 20,
                }}>
                <RadioButton
                  value="first"
                  status={checked === '1' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('1');
                    handleValues('1', 'status');
                  }}
                />
                <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
                <RadioButton
                  value="second"
                  status={checked === '2' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('2');
                    handleValues('2', 'status');
                  }}
                />
                <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
              </View>
            </View>
            <View style={{alignSelf: 'center'}}>
            {hideButton?
              ( <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
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
        </ImageBackground>
      </View>
    </ScrollView>
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
