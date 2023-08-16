/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Appearance,
} from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import {ScrollView} from 'react-native-gesture-handler';
import AppButton from '../../uicomponents/AppButton';
import {getData, postData} from '../../Connection/FetchServices';
import {Dimensions} from 'react-native';
import COLORS from '../../helper/Colors';
import {getStoreData} from '../../storage/AsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

import {Picker} from '@react-native-picker/picker';
import Input from '../../uicomponents/Input';
const {width, height} = Dimensions.get('window');

export default function RaiseDemand({navigation, route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
    brand_id: '',
    model_id: '',
    product_id: '',
    stock: '',
    colorFields: '',
    isSelected: '',
    comment: '',
    store_id: '',
    quantity:'',

  });
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const isFocused = useIsFocused();
  const [subItemsList, setSubItemsList] = useState([
    {productname: '', qty: '', costprice: ''},
  ]);
  const [error, setError] = useState({});
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [employee, setEmployee] = useState('');
  const [loader, setLoader] = useState(true);

  const fetchEmployee = async () => {
    setLoader(true);
    var result = await getStoreData('EMPLOYEE');
    if (result) {
      setEmployee(result);
    }
    setLoader(false);
  };

  const fetchActiveCategory = async category_id => {
    const result = await getData('category/display/active', {category_id: category_id});
    setCategory(result.data);
  };
  const fetchBrand = async category_id => {
    const result = await getData('brand/byCategory/' + category_id);
    setBrand(result.data);
  };

  const fetchModel = async brand_id => {
    const result = await getData('model/byBrand/' + brand_id);
    setModel(result.data);
  };

  const fetchProduct = async model_id => {
    const result = await getData('product/byModel/' + model_id);
    console.log(result);
    setProduct(result.data);
  };
  const fetchActiveStore = async store_id => {
    const result = await getData('store/display/active', {store_id: store_id});
    setStore(result.data);
  };

  useEffect(function () {
    fetchActiveCategory();
    fetchEmployee();
    fetchActiveStore();
    selectedLng();
  }, [isFocused]);
  


  
  const handleKhali=()=>{
   setInputs('');
  }

  const handleRaiseDemand = async () => {
    const asyncData = await getStoreData('EMPLOYEE');
    if (validate())
    {
    var body = {
      categoryid: categorylist,
      brandid: brandlist,
      modelid: modellist,
      productid: productlist,
      fromstoreid: employee.store_id,
      tostoreid: storelist,
      fromemployeeid: employee.employee_id,
      added_by: asyncData.name, 
      Quantity:inputs.quantity,
      Comment:inputs.comment
    };
    // alert(JSON.stringify(body))
    const result = await postData('demand', body);
    // alert(JSON.stringify(result))
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
      handleKhali()
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

  const validate = () => {
    var isValid = true;
    if (!storelist) {
      handleErrors('Please Select Store Name', 'store_id');
      isValid = false;
      
    }
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
    if (!productlist) {
      handleErrors('Please Select Product Name', 'product_id');
      isValid = false;
     
    }
    if (!inputs.quantity) {
      handleErrors('Please Select Quantity', 'quantity');
      isValid = false;
     
    }
    return isValid;
  };

  const handleValues = (txt, attr) => {
    console.log(txt, attr);
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
  fetchModel(itemValue)
 }
 const [modellist,setModelList]=useState('')
 const handleModel=(itemValue)=>{
  setModelList(itemValue)
  fetchProduct(itemValue)
 }
 const [storelist,setStoreList]=useState('')
 const handleStore=(itemValue)=>{
  setStoreList(itemValue)
 }
 const [productlist,setProductList]=useState('')
 const handleProduct=(itemValue)=>{
  setProductList(itemValue)
  
 }
 
  return (
    <ScrollView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{
          flex: 1,
          zIndex: 9999,
          height,
          width: '100%',
          backgroundColor: theme == 'light' ? '#fff' : 'black',
        }}>
        <View>
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
          {category?.map(itm => {
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
                       {brand?.map(itm => {
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
              {brand?.map(itm => {
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
          {error.model_id ? (
               <View style={{marginTop: 10}}>
               <View
                 style={{
                   flexDirection: 'row',
                   justifyContent: 'center',
                   width: width * 1.5,
                   margin: 5,
                 }}>
                  <Picker
                      selectedValue={modellist}
                       style={{
                         height: 50,
                         width: '60%',
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                         handleModel(itemValue)
                        }}>
                       <Picker.Item label={'-Select Model-'} value={''} />
                       {model?.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.name}
                             value={itm.model_id}
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
                   {error.model_id}
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
               selectedValue={modellist}
              style={{
                height: 50,
                width: '60%',
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleModel(itemValue)
              }}>
              <Picker.Item label={'-Select Model-'} value={''} />
              {model?.map(itm => {
                return (
                  <Picker.Item
                    label={itm.name}
                    value={itm.model_id}
                  />
                );
              })}
            </Picker>
            </View>
              )}
        {error.product_id ? (
              <View style={{marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: width * 1.5,
                  margin: 5,
                }}>
                  <Picker
                      selectedValue={productlist}
                       style={{
                         height: 50,
                         width: '60%',
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                         handleProduct(itemValue)
                        }}>
                       <Picker.Item label={'-Select Product-'} value={''} />
                       {product?.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.product_name}
                             value={itm.product_id}
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
                   {error.product_id}
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
               selectedValue={productlist}
              style={{
                height: 50,
                width: '60%',
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleProduct(itemValue)
              }}>
              <Picker.Item label={'-Select Product-'} value={''} />
              {product?.map(itm => {
                return (
                  <Picker.Item
                    label={itm.product_name}
                    value={itm.product_id}
                  />
                );
              })}
            </Picker>
            </View>
              )}
         {error.store_id ? (
              <View style={{marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: width * 1.5,
                  margin: 5,
                }}>
                  <Picker
                      selectedValue={storelist}
                       style={{
                         height: 50,
                         width: '60%',
                         backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                       }}
                       onValueChange={itemValue => {
                         handleStore(itemValue)
                        }}>
                       <Picker.Item label={'-Select Store-'} value={''} />
                       {store.map(itm => {
                         console.log('===>', itm);
                         return (
                           <Picker.Item
                             label={itm.name}
                             value={itm.store_id}
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
                   {error.store_id}
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
               selectedValue={storelist}
              style={{
                height: 50,
                width: '60%',
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleStore(itemValue)
              }}>
              <Picker.Item label={'-Select Store-'} value={''} />
              {store.map(itm => {
                return (
                  <Picker.Item
                    label={itm.name}
                    value={itm.store_id}
                  />
                );
              })}
            </Picker>
            </View>
              )}
               <Input
                error={error.quantity}
                onFocus={() => handleErrors(null, 'quantity')}
                onChangeText={txt => handleValues(txt.trimStart(), 'quantity')}
                placeholder={strings.QUANTITY}
                keyboardType="numeric"
                autoCompleteType="off"
                materialCommunityIcons="format-list-numbered"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.comment}
                onFocus={() => handleErrors(null, 'comment')}
                onChangeText={txt => handleValues(txt.trimStart(), 'comment')}
                placeholder={strings.COMMENTS}
                autoCompleteType="off"
                fontAwesome="comment"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            <View style={{alignSelf: 'center', marginTop: height * 0.03}}>
              <AppButton onPress={handleRaiseDemand} buttonText={strings.RAISE_DEMAND} />
            </View>
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
