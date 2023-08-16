/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Button,
  Appearance,
  TextInput,
  ScrollView,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import {getData, ServerURL} from '../component/Connection/FetchServices';
import React, {useState, useEffect} from 'react';
import AppButton from '../component/uicomponents/AppButton';
import NumericInput from 'react-native-numeric-input';
import {useDispatch} from 'react-redux';
import COLORS from '../component/helper/Colors';
import MCI from 'react-native-vector-icons/FontAwesome';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../changeLanguage/ChangeLanguage';
import strings from '../changeLanguage/LocalizedString';

const {width, height} = Dimensions.get('window');

export default function BarcodeDetails({navigation, route}) {
  const [subData, setSubData] = useState('');
  const [inputs, setInputs] = useState('');
  const [subItemList, setSubItemsList] = useState([]);
  const isFocused = useIsFocused();
  const [quantity, setQuantity] = useState(1);
  const [qt, setQt] = useState('');

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const dispatch = useDispatch();

  const finalPrice = subItemList.reduce(
    (acc, item) => {
      acc.mrp += Number(quantity) * Number(item.quantity);
      return acc;
    },
    {mrp: 0},
  );

  const handleQtyChange = (index, text) => {
    const newInputs = [...subItemList];
    newInputs[index].qty = text;
    setSubItemsList([...newInputs]);
  };

  const handleQuantityChange = text => {
    setQuantity(text);
    const newInputs = [...subItemList];
    setSubItemsList(
      newInputs.map(item => ({...item, qty: item.quantity * text})),
    );
  };

  const handleSubData = () => {
    setSubData(false);
  };

  const [cpp, setCpp] = useState('');
  const [scpp, setScpp] = useState('');

  const fetchProducts = async () => {
    var result = await getData('product/' + route.params.id);
    if (result.status) {
      setInputs(result.data);
      setCpp(result.data.costprice);
      setScpp(result.data.subitemlist[0].costprice);
      const list = result.data?.subitemlist?.map(item => ({
        ...item,
        qty: item.quantity * quantity,
      }));
      setSubItemsList([...list]);
    }
  };
  useEffect(
    function () {
      fetchProducts();
      handleSubData();
      selectedLng();
    },
    [isFocused],
  );
  const handleAddToCart = () => {
    navigation.navigate('Cart');
    dispatch({
      type: 'ADD_TO_CART',
      payload: [
        inputs.product_id,
        {...inputs, quantity: quantity, subItemList, costprice: cpp,subItemList:subItemList.map((subitem) => {
          if (subitem.subitemsid) {
            return {
              ...subitem,
              costprice:scpp,
            };
          }
          return subitem;
        }),},
      ],
    });
  };

  return (
    <ImageBackground
      source={require('../../src/component/assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
            marginLeft: 20,
          }}>
          {strings.DETAILS}
        </Text>
        <MC
          name="menu"
          size={24}
          style={{color: COLORS.btnColor, padding: 5}}
        />
      </View>
      <ScrollView>
      <View
        style={{
          marginTop: height * 0.04,
          width: '60%',
          alignSelf: 'center',
          margin: 5,
        }}>
        <Image
          source={{uri: `${ServerURL}/images/${inputs.picture}`}}
          style={{
            width: 150,
            height: height * 0.19,
            resizeMode: 'cover',
            alignSelf: 'center',
            borderRadius: 5,
          }}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 5,
            borderWidth: 0.7,
            borderColor: '#f2f2f2',
            paddingBottom: 3,
            paddingRight: 2,
            backgroundColor: theme == 'light' ? 'white' : '#2C2C2C',
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1,
            },
          }}>
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: theme == 'light' ? 'white' : '#2C2C2C',
            }}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.CATEGORY}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 1,
                    marginLeft: 5,
                  }}>
                  {inputs.category_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.STOCK}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                    marginTop: 1,
                  }}>
                  {inputs.stock}
                </Text>
              </View>
            </View>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.BRAND}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 1,
                    marginLeft: 5,
                  }}>
                  {inputs.brand_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: 'red',
                  }}>
                  {strings.BOOKED}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: 'red',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                    marginTop: 1,
                  }}>
                  {inputs.booked || '0'}
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.MODEL}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                    marginTop: 1,
                  }}>
                  {inputs.model_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', padding: 5}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: 'green',
                  }}>
                  {strings.AVAILABLE}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                    marginTop: 1,
                    color: 'green',
                  }}>
                  {inputs.stock - inputs.booked}
                </Text>
              </View>
            </View>
            {!inputs.color ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    alignItems: 'center',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.COLOR}:
                </Text>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                    marginTop: 1,
                  }}>
                  {inputs.color}
                </Text>
              </View>
            )}

            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  alignItems: 'center',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.MRP}:
              </Text>
              <MCI
                name="rupee"
                size={12}
                style={{
                  color: theme == 'light' ? '#2C2C2C' : 'red',
                  padding: 1,
                  marginLeft: 5,
                }}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: 'red',
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  marginTop: 1,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}>
                {inputs.mrp}.00
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  alignItems: 'center',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.OFFER_PRICE}:
              </Text>
              <MCI
                name="rupee"
                size={12}
                style={{
                  color: theme == 'light' ? '#2C2C2C' : 'green',
                  padding: 1,
                  marginLeft: 5,
                }}
              />
              <TextInput
                keyboardType="numeric"
                defaultValue={String(cpp)}
                onChangeText={txt => {
                  const parsedValue = parseFloat(txt);
                  if (!isNaN(parsedValue)) {
                    setCpp(parsedValue);
                  } else {
                    setCpp(0);
                  }
                }}
                editable
                style={{
                  fontSize: 12,
                  color: 'green',
                  fontFamily: 'Poppins-Medium',
                  height: 40,
                  // borderWidth:0.5,
                  // borderTopWidth:0,
                  // borderLeftWidth:0,
                  // borderRightWidth:0,
                  marginBottom: -15,
                  marginTop: -13,
                  borderBottomColor: 'red',
                }}
              />
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  alignItems: 'center',
                  fontSize: 12,
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.QUANTITY}:
              </Text>

              <View style={{marginLeft: 5}}>
                <NumericInput
                  totalWidth={120}
                  minValue={1}
                  maxValue={999}
                  totalHeight={35}
                  onChange={txt => handleQuantityChange(txt)}
                  value={Number(quantity)}
                  valueType="real"
                  rounded
                  textColor="#B0228C"
                  iconStyle={{color: 'black'}}
                />
              </View>
            </View>
            <View>
              {subItemList?.map((item, index) => {
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Medium',
                          alignItems: 'center',
                          fontSize: 12,
                          color: theme == 'light' ? '#2C2C2C' : '#fff',
                        }}>
                        {strings.SUB_PRODUCT_NAME}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#2C2C2C',
                          fontFamily: 'Poppins-Medium',
                          marginLeft: 5,
                          marginTop: 1,
                          color: theme == 'light' ? '#2C2C2C' : '#fff',
                        }}>
                        {item.productname}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <View>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Medium',
                              alignItems: 'center',
                              fontSize: 12,
                              color: theme == 'light' ? '#2C2C2C' : '#fff',
                            }}>
                            {strings.SUB_ITEMS_QUANTITY}
                          </Text>
                        </View>
                        <View style={{marginLeft: 7}}>
                          <NumericInput
                            totalWidth={120}
                            totalHeight={35}
                            minValue={1}
                            maxValue={999}
                            onChange={txt => handleQtyChange(index, txt)}
                            value={item.qty}
                            initValue={item.qty}
                            rounded
                            textColor="#B0228C"
                            iconStyle={{color: 'black'}}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            alignItems: 'center',
                            fontSize: 12,
                            color: theme == 'light' ? '#2C2C2C' : '#fff',
                          }}>
                          {strings.SUB_ITEMS_PRICE}:
                        </Text>
                        <MCI
                          name="rupee"
                          size={12}
                          style={{
                            color: theme == 'light' ? '#2C2C2C' : 'green',
                            padding: 1,
                            marginLeft: 5,
                          }}
                        />
                        <TextInput
                          keyboardType="numeric"
                          defaultValue={String(scpp)}
                          onChangeText={txt => {
                            const parsedValue = parseFloat(txt);
                            if (!isNaN(parsedValue)) {
                              setScpp(parsedValue);
                            } else {
                              setScpp(0);
                            }
                          }}
                          editable
                          style={{
                            fontSize: 12,
                            color: 'green',
                            fontFamily: 'Poppins-Medium',
                            height: 40,
                            marginBottom: -15,
                            marginTop: -13,
                            borderBottomColor: 'red',
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={{alignItems: 'center', marginTop: height * 0.02}}>
              <AppButton
                onPress={handleAddToCart}
                buttonText={strings.ADD_TO_CART}
              />
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </ImageBackground>
  );
}
