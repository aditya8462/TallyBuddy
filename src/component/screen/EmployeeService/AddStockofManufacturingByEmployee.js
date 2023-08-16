/* eslint-disable eqeqeq */

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import { Appearance } from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import {ServerURL, getData, postData, putData,} from '../../Connection/FetchServices';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import AppButton from '../../uicomponents/AppButton';
import COLORS from '../../helper/Colors';
import FA from 'react-native-vector-icons/FontAwesome';
import strings from '../../../changeLanguage/LocalizedString';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import Input from '../../uicomponents/Input';
import { getStoreData } from '../../storage/AsyncStorage';

const {height, width} = Dimensions.get('window');

export default function AddStockofManufacturingByEmployee({navigation, route}) {
  const refRBSheet = useRef();
  const [product, setProducts] = useState({});
  const [loader, setLoader] = useState(true);
  const [store, setStore] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [hideButton,setHideButton]=useState(false)
  const [error, setError] = useState({});
  const [inputs, setInputs] = useState({
    quantity: '',
    store_id: '',
  });
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

 

  const fetchProducts = async () => {
    setLoader(true);
    var result = await getData('product/' + route.params.id);
    if (result.status) {
      setProducts(result.data);
    }
    setLoader(false);
    console.log(result);
  };
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  useEffect(function () {
    fetchProducts();
    selectedLng();
  }, [isFocused])

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, []),
  );

  const fetchStore = async store_id => {
    const result = await getData('store', {store_id: store_id});
    setStore(result.data);
  };

  useEffect(function () {
    fetchStore();
  }, []);

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const validate = () => {
    var isValid = true;
    if (!storelist) {
      handleErrors('Please Input Store name', 'store_id');
      isValid = false;
    }
    if (!inputs.quantity) {
        handleErrors('Please Input Quanntity', 'quantity');
        isValid = false;
      }
    console.log(isValid);
    return isValid;
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

const handleCreate = async () => {
    const storeAdmin = await getStoreData('EMPLOYEE');
  { 
    var body ={
    manufacturedquantity:inputs.quantity,
    added_by:storeAdmin.name,
    productid:route.params.id,
    storeid: storeAdmin.store_id
   };

   setHideButton(true)
  const result = await postData('storestock/' , body);
  // console.log("===============>",result);
  if (result.status) {
     SweetAlert.showAlertWithOptions({
       title: strings.DISTRIBUTE_SUCCESSFULLY,
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
  setHideButton(false)
 };
    }
 

  const Boxes = ({item}) => (
      <View
          style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              overflow: 'hidden',
              borderColor: '#f2f2f2',
              elevation: 5,
          }}>
          <ImageBackground
              source={require('../../assets/Backgrounds.png')}
              style={{ width: width * 1 }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                      source={{ uri: `${ServerURL}/images/${item.picture}` }}
                      style={{
                          width: 120,
                          height: height * 0.12,
                          resizeMode: 'cover',
                          alignItems: 'center',
                          borderRadius: 8,
                          marginTop: height * 0.02,
                      }} />
              </View>
              <View
                  style={{
                      width: width * 1,
                      padding: 12,
                      flexDirection: 'row',
                  }}>
                  <View style={{ width: '48%' }}>
                      <Text
                          style={{
                              fontSize: 10,
                              color: '#57606f',
                              fontFamily: 'Poppins-Medium',
                          }}>
                         {strings.CATEGORY}
                      </Text>
                      <Text
                          numberOfLines={3}
                          adjustsFontSizeToFit
                          style={{
                              fontSize: 12,
                              color: '#2f3542',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {item.category_name}
                      </Text>
                      <Text
                          style={{
                              fontSize: 10,
                              color: '#57606f',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {strings.BRAND}
                      </Text>
                      <Text
                          numberOfLines={3}
                          adjustsFontSizeToFit
                          style={{
                              fontSize: 12,
                              color: '#2f3542',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {item.brand_name}
                      </Text>
                      <Text
                          style={{
                              fontSize: 10,
                              color: '#57606f',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {strings.OFFER_PRICE}
                      </Text>
                      <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                              fontSize: 12,
                              color: '#2f3542',
                              fontFamily: 'Poppins-Medium',
                          }}>
                             <FA
                        name="rupee"
                        size={12}
                        style={{color: '#000', padding: 1}}
                      />
                          {item.costprice}
                      </Text>
                  </View>
                  <View style={{ width: '51%' }}>
                      <Text
                          style={{
                              fontSize: 10,
                              color: '#57606f',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {strings.MODEL}
                      </Text>
                      <Text
                          numberOfLines={3}
                          adjustsFontSizeToFit
                          style={{
                              fontSize: 12,
                              color: '#2f3542',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {item.model_name}
                      </Text>
                      <Text
                          style={{
                              fontSize: 10,
                              color: '#57606f',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {strings.MRP}
                      </Text>
                      <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                              fontSize: 12,
                              color: '#2f3542',
                              fontFamily: 'Poppins-Medium',
                          }}>
                          {item.mrp}
                           </Text>
                           {item?.subitemlist?.map(item => {
                return (
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          alignItems: 'center',
                          fontSize: 12,
                        }}>
                        {strings.SUB_ITEMS_NAME}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          color: '#2f3542',
                          fontSize: 12,
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 2,
                        }}>
                        {item.productname}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          alignItems: 'center',
                          fontSize: 12,
                        }}>
                        {strings.QUANTITY}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          fontSize: 12,
                          color: '#2f3542',
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 2,
                          alignItems: 'center',
                        }}>
                        {item.quantity}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          alignItems: 'center',
                          fontSize: 12,
                        }}>
                        {strings.SUB_ITEMS_PRICE}
                      </Text>
                      <FA
                        name="rupee"
                        size={12}
                        style={{color: '#2f3542', padding: 1, marginLeft: 5}}
                      />
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          fontSize: 12,
                          color: '#2f3542',
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 2,
                          alignItems: 'center',
                        }}>
                        {item.costprice}.00
                      </Text>
                    </View>
                  </>
                );
              })}
                  </View>
              </View>
          </ImageBackground>
      </View>
  );

  const [storelist, setStoreList] = useState('');
  const handleStore = itemValue => {
    setStoreList(itemValue);
  };
  return (
    <ImageBackground
          source={require('../../assets/background.png')}
          style={{
             flex: 1,
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: '#fff',
          }}>
    <View style={{flex: 1}}>
      <View style={{width: width}}>
        {loader ? (
          <AnimatedLottieView
            source={require('../../assets/TallyBudy Loader.json')}
            autoPlay
            loop
            style={{height: 100, alignSelf: 'center', display: 'flex'}}
          />
        ) : (
          <>
            <Boxes item={product} />
            <View
              style={{
                alignItems: 'center',
                paddingTop: 5,
                paddingHorizontal: 10,
              }}>
            
            <Input
                error={error.quantity}
                onFocus={() => handleErrors(null, 'quantity')}
                onChangeText={txt => handleValues(txt.trimStart(), 'quantity')}
                placeholder={strings.QUANTITY}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
               <View style={{alignItems: 'center'}}>
               {hideButton?
              ( <AppButton
                buttonText={strings.DISTRIBUTE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleCreate}
                buttonText={strings.DISTRIBUTE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
        </View>
            </View>
          </>
        )}
      </View>
    </View>
    </ImageBackground>
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
      fontSize: 12,
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
