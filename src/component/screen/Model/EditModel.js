/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Dimensions,StyleSheet,ImageBackground, Appearance} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import AnimatedLottieView from 'lottie-react-native';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';

import {Picker} from '@react-native-picker/picker';
const {width,height} = Dimensions.get('window');

export default function EditModel({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    name: '',
    model_no: '',
    discount: '',
    status: '',
  });

  
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [checked, setChecked] = React.useState('first');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusBrand, setIsFocusBrand] = useState(false);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

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

  const fetchBrand = async category_id => {
    const result = await getData('brand/byCategory/' + category_id);
    setBrand(result.data);
    console.log('Brand', result.data);
  };
 

  const fetchCategory = async category_id => {
    const result = await getData('category/display/active', {category_id: category_id});
    setCategory(result.data);
  };
 

  const handleDelete = async () => {
    const result = await deleteData('model/' + route.params.id);
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
  }

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

  const fetchModels = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('model/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        
        name: result.data.name,
        model_no: result.data.model_no,
        discount: result.data.discount,
        status: result.data.status,
      });
      fetchBrand(result.data.category_id)
      setCategoryList(String(result.data.category_id))
      setBrandList(String(result.data.brand_id))
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchModels();
    fetchCategory();
    selectedLng();
  }, [isFocused]);

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        category_id: categorylist,
        brand_id: brandlist,
        name: inputs.name,
        model_no: inputs.model_no,
        discount: inputs.discount,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
    setHideButton(true)
      const result = await putData('model/' + route.params.id, body);
      console.log(result)
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.MODEL_EDITED_SUCCESSFULLY,
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
    }

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
  const [brandlist,setBrandList]=useState('')
  const handleBrand=(itemValue)=>{
   setBrandList(itemValue)
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
      <>
        {loader ? (
          <AnimatedLottieView
            source={require('../../assets/TallyBudy Loader.json')}
            autoPlay
            loop
            style={{height: 100, alignSelf: 'center', display: 'flex',justifyContent:'center'}}
          />
        ) : (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                paddingTop:10,
                paddingLeft:5
              }}>
              {strings.EDIT_MODEL_DETAILS}
            </Text>
            <View
              style={{
                alignItems: 'center',
              }}>
                {error.category_id ? (
                  <View style={{marginTop: 5}}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: 'Poppins-Bold',
                        textAlign: 'left',
                        color: theme == 'light' ? 'black' : '#fff',
                        paddingLeft: width * 0.31,
                      }}>
                      {strings.CATEGORY}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: width * 1.5,
                        margin: 5,
                      }}>
                      {category.length ? (
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
                      ) : (
                        <></>
                      )}
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins-Medium',
                        fontSize: 11,
                        marginLeft: width * 0.33,
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
                      {category.length ? (
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
                      ) : (
                        <></>
                      )}
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
                        marginLeft: width * 0.33,
                      }}>
                      {error.brand_id}
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
              <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder={strings.MODEL_NAME}
                value={inputs.name}
                labelTxt={strings.MODEL_NAME}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.model_no}
                onFocus={() => handleErrors(null, 'model_no')}
                onChangeText={txt => handleValues(txt, 'model_no')}
                placeholder={strings.MODEL_NUMBER}
                value={inputs.model_no}
                labelTxt={strings.MODEL_NUMBER}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.discount}
                onFocus={() => handleErrors(null, 'discount')}
                onChangeText={txt => handleValues(txt.trimStart(), 'discount')}
                placeholder={strings.DISCOUNT}
                value={inputs.discount}
                labelTxt={strings.DISCOUNT}
                maxLength={2}
              keyboardType="numeric"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                  fontSize: 16,
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
                  value="1"
                  status={
                    checked == '1' || inputs.status == '1'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => {
                    setChecked('1');
                    handleValues('1', 'status');
                  }}
                />
                <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
                <RadioButton
                  value="2"
                  status={
                    checked == '2' || inputs.status == '2'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => {
                    setChecked('2');
                    handleValues('2', 'status');
                  }}
                />
                <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
              </View>
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
              <AppButton onPress={askDelete} buttonText={strings.DELETE} />
            </View>
            <View style={{marginTop: 10}} />
          </View>
        )}
      </>
    </ScrollView>
    </ImageBackground>
    </ScrollView>
  );
}


