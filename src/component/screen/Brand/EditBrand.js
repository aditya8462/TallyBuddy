/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Dimensions, StyleSheet, ToastAndroid, ImageBackground, Appearance} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import AnimatedLottieView from 'lottie-react-native';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';

import {Picker} from '@react-native-picker/picker';
const {width,height} = Dimensions.get('window')

export default function EditBrand({navigation, route, props}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_name: '',
    discount: '',
    status: '',
  });

  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = React.useState('first');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });


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


  const handleDelete = async () => {
    const result = await deleteData('brand/' + route.params.id);
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

  const fetchCategory = async category_id => {
    const result = await getData('category', {category_id: category_id});
    setCategory(result.data);
  };


  const fetchBrandDetails = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('brand/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        status: result.data.status,
        brand_name: result.data.brand_name,
        discount: result.data.discount,
      });
      setCategoryList(String(result.data.category_id))
    
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchBrandDetails();
    fetchCategory();
    selectedLng();
  }, [isFocused]);

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        category_id: categorylist,
        brand_name: inputs.brand_name,
        discount: inputs.discount,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
    setHideButton(true)
      const result = await putData('brand/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.BRAND_EDITED_SUCCESSFULLY,
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
      <>
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
                paddingTop:10,
                paddingLeft:5
              }}>
              {strings.EDIT_BRAND_DETAILS}
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

              <Input
                error={error.brand_name}
                onFocus={() => handleErrors(null, 'brand_name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'brand_name')}
                placeholder={strings.BRAND_NAME}
                value={inputs.brand_name}
                labelTxt={strings.BRAND_NAME}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.discount}
                onFocus={() => handleErrors(null, 'discount')}
                onChangeText={txt => handleValues(txt.trimStart(), 'discount')}
                placeholder={strings.DISCOUNT}
                value={inputs.discount}
                labelTxt={strings.DISCOUNT}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              keyboardType="numeric"
              />
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'Poppins-Bold',
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

