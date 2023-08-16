/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {postData, getData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';
import {Appearance} from 'react-native';

import {Picker} from '@react-native-picker/picker';
const {height, width} = Dimensions.get('screen');

export default function CreateBrand({navigation}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_name: '',
    discount: 0,
    status: '',
  });
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = React.useState('first');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false)

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
      handleErrors('Please Select Category', 'category_id');
      isValid = false;
    }
    if (!inputs.brand_name) {
      handleErrors('Please Input Name', 'brand_name');
      isValid = false;
    } else if (inputs.brand_name.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.brand_name)) {
        handleErrors('Please Input valid brand name', 'brand_name');
        isValid = false;
      }
      console.log('here');
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

  useEffect(function () {
    fetchActiveCategory();
  }, []);


  const handleSubmit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');
    if (validate()) {
      let body = {
        category_id: categorylist,
        brand_name: inputs.brand_name,
        discount: inputs.discount,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name||employeeAdmin.name||storeAdmin.name,
      };
      setHideButton(true)
      const result = await postData('brand', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.BRAND_CREATED_SUCCESSFULLY,
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
          style: 'success',
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
  const [categorylist,setCategoryList]=useState('')
 const handleCategory=(itemValue)=>{
  setCategoryList(itemValue)
 }

  return (
    <ScrollView>
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
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
              fontFamily:'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              marginTop: 10,
              padding: 5,
            }}>
            {strings.CREATE_BRAND}
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: 5,
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
             </View>
            <Input
              error={error.brand_name}
              onFocus={() => handleErrors(null, 'brand_name')}
              onChangeText={txt => handleValues(txt.trimStart(), 'brand_name')}
              placeholder={strings.BRAND_NAME}
              autoCompleteType="off"
              antDesign="tag"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}

            />
            <Input
              error={error.discount}
              onFocus={() => handleErrors(null, 'discount')}
              onChangeText={txt => handleValues(txt.trimStart(), 'discount')}
              placeholder={strings.DISCOUNT}
              maxLength={2}
              autoCompleteType="off"
              fontAwesome5="percent"
              keyboardType="numeric"
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
         
          <View>
            <Text
              style={{
                marginTop: 10,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                fontSize: 12,
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
              <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff'}}>{strings.YES}</Text>
              <RadioButton
                value="second"
                status={checked === '2' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked('2');
                  handleValues('2', 'status');
                }}
              />
              <Text style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>{strings.NO}</Text>
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
                onPress={handleSubmit}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
          </View>
          <View style={{marginTop: 10}} />
        </View>
      </ScrollView>
    </ImageBackground>
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
