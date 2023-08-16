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
  ScrollView,
} from 'react-native';
import M from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import {Appearance} from 'react-native';
import SweetAlert from 'react-native-sweet-alert';
import {ServerURL, getData, postData, putData} from '../../Connection/FetchServices';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import AppButton from '../../uicomponents/AppButton';
import COLORS from '../../helper/Colors';
import FA from 'react-native-vector-icons/FontAwesome';
import strings from '../../../changeLanguage/LocalizedString';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {RadioButton} from 'react-native-paper';
import Input from '../../uicomponents/Input';

const {height, width} = Dimensions.get('window');

export default function DistributeStock({navigation, route}) {
  const refRBSheet = useRef();
  const [product, setProducts] = useState({});
  const [loader, setLoader] = useState(false);
  const [store, setStore] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [error, setError] = useState({});
  const [checked, setChecked] = React.useState('first');
  const [inputs, setInputs] = useState({
    store_id: '',
    quantity:''
  });
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());
 
  // const fetchProducts = async () => {
  //   setLoader(true);
  //   var result = await getData('product/' + route.params.id);
  //   if (result.status) {
  //     setProducts(result.data);
  //   }
  //   setLoader(false);
  //   console.log(result);
  // };
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  useEffect(
    function () {
      // fetchProducts();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      // fetchProducts();
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
      handleErrors('Please Input Store Name', 'store_id');
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
//  alert(JSON.stringify(route.params.item))

  const handleCreate = async () => {
    if (validate()) {
      var body = {
        store_id: storelist,
        stock_id:route.params.item.stock_id,
        product_id:route.params.item.productid,
        added_by:route.params.item.added_by,
        quantity: checked=="1"? inputs.quantity:route.params.item.remainingstock

      };

      setHideButton(true);
    //  alert(JSON.stringify(body))
        const result = await postData(
         'stock/distribute/',
         body,
       );
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
      setHideButton(false);
    }
  };

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
        style={{width: width * 1}}>
        <View
          style={{
            width: width * 1,
            padding: 12,
            flexDirection: 'row',
          }}>
          <View style={{width: '48%'}}>
            <Text
              style={{
                fontSize: 10,
                color: '#57606f',
                fontFamily: 'Poppins-Medium',
              }}>
              Bill No.
            </Text>
            <Text
              numberOfLines={3}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: '#2f3542',
                fontFamily: 'Poppins-Medium',
              }}>
              {route.params.item.billno}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#57606f',
                fontFamily: 'Poppins-Medium',
              }}>
              Vendor Name
            </Text>
            <Text
              numberOfLines={3}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: '#2f3542',
                fontFamily: 'Poppins-Medium',
              }}>
              {route.params.item.vendor_name}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#57606f',
                fontFamily: 'Poppins-Medium',
              }}>
              Amount
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: '#2f3542',
                fontFamily: 'Poppins-Medium',
              }}>
              <FA name="rupee" size={12} style={{color: '#000', padding: 1}} />
              { route.params.item.totalamount}
            </Text>
          </View>
          <View style={{width: '51%'}}>
            <Text
              style={{
                fontSize: 10,
                color: '#57606f',
                fontFamily: 'Poppins-Medium',
              }}>
              Added_by
            </Text>
            <Text
              numberOfLines={3}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: '#2f3542',
                fontFamily: 'Poppins-Medium',
              }}>
              {route.params.item.added_by}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#57606f',
                fontFamily: 'Poppins-Medium',
              }}>
              Store
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: '#2f3542',
                fontFamily: 'Poppins-Medium',
              }}>
              {route.params.item.store_name}
            </Text>
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
        backgroundColor: theme == 'light' ? '#fff' : 'black',
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
              <View
                style={{
                  marginTop: height * 0.01,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <Boxes item={product} />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 5,
                  paddingHorizontal: 10,
                  marginTop: height * 0.015,
                }}>
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
                          backgroundColor:
                            theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                        }}
                        onValueChange={itemValue => {
                          handleStore(itemValue);
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
                        marginLeft: width * 0.32,
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
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleStore(itemValue);
                      }}>
                      <Picker.Item label={'-Select Store-'} value={''} />
                      {store.map(itm => {
                        return (
                          <Picker.Item label={itm.name} value={itm.store_id} />
                        );
                      })}
                    </Picker>
                  </View>
                )}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    marginRight: width * 0.3,
                  }}>
                  <RadioButton
                    value="1"
                    status={checked === '1' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('1');
                      handleValues('1', 'status');
                    }}
                  />
                  <Text
                    style={{
                      marginRight: width*0.1,
                      color: theme == 'light' ? '#2c2c2c' : '#ffff',
                    }}>
                    Manual
                  </Text>
                  <RadioButton
                    value="2"
                    status={checked === '2' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('2');
                      handleValues('2', 'status');
                    }}
                  />
                  <Text style={{color: theme == 'light' ? '#2c2c2c' : '#ffff'}}>
                    Completed
                  </Text>
                </View>
                {checked == 1 ? (
                  <View>
                    <Input
                      placeholder="Quantity"
                      autoCompleteType="off"
                      fontAwesome5="file"
                      onChangeText={txt => handleValues(txt.trimStart(), 'quantity')}
                      placeholderTextColor={
                        theme == 'light' ? 'black' : 'white'
                      }
                    />
                  </View>
                ) : null}
                <View style={{alignItems: 'center'}}>
                  {hideButton ? (
                    <AppButton
                      buttonText={strings.DISTRIBUTE}
                      bgColor={COLORS.disable}
                      btnWidth={0.8}
                    />
                  ) : (
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
    color: COLORS.btnColor,
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
