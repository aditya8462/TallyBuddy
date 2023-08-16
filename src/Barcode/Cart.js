/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Appearance,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import AppButton from '../component/uicomponents/AppButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {ServerURL} from '../component/Connection/FetchServices';
import {useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import COLORS from '../component/helper/Colors';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FA from 'react-native-vector-icons/FontAwesome';
import {selectedLng} from '../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../changeLanguage/LocalizedString';

const {width, height} = Dimensions.get('screen');
export default function Cart({navigation}) {
  const product = useSelector(state => state.cart);
  

  const productDetails = Object.values(product);
  console.log(productDetails)
  const [refresh, setRefresh] = useState('');
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  // const handleAddProduct = () => {
    
  //   navigation.navigate('Employeescan');
  // };

  const handlePlaceOrder = () => {
    
    navigation.navigate('Invoice');
  };

  const handleDelete = item => {
    dispatch({type: 'Delete_Cart_Items', payload: item.product_id});
    setRefresh(!refresh);
  };

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(
    function () {
      selectedLng();
    },
    [isFocused],
  );

  const DataInCart = ({item}) => {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              borderRadius: 10,
              overflow: 'hidden',
              marginVertical: 5,
              borderWidth: 0.7,
              borderColor: '#f2f2f2',
              paddingBottom: 3,
              paddingRight: 2,
              backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
              shadowColor: '#000000',
              alignItems: 'center',
              shadowOpacity: 0.8,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1,
              },
            }}>
            <View
              style={{
                height: '100%',
                padding: 10,
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
                width: width * 0.9,
              }}>
              <FastImage
                source={{
                  uri: `${ServerURL}/images/${item.picture}`,
                  priority: FastImage.priority.normal,
                }}
                style={{
                  width: 85,
                  height: '90%',
                  resizeMode: 'contain',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: theme == 'light' ? '#000' : 'white',
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              

              <View
                style={{
                  marginLeft: 10,
                  width: width * 0.7,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      color: theme == 'light' ? '#000' : 'white',
                    }}>
                    {strings.PRODUCT_ID}:
                  </Text>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 3,
                    }}>
                    {item.product_id}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                    }}>
                    {strings.CATEGORY}:
                  </Text>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 3,
                    }}>
                    {item.category_name}
                  </Text>
                </View>
                {item.color ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 12,
                        color: theme == 'light' ? '#2C2C2C' : 'white',
                      }}>
                      {strings.COLOR}:
                    </Text>
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        color: theme == 'light' ? '#2C2C2C' : 'white',
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 3,
                      }}>
                      {item.color}
                    </Text>
                  </View>
                ) : null}

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                    }}>
                    {strings.QUANTITY}:
                  </Text>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      marginLeft: 3,
                    }}>
                    {item.quantity}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      alignItems: 'center',
                      color: theme == 'light' ? '#2C2C2C' : 'white',
                    }}>
                    {strings.MRP}:
                  </Text>
                  <FA
                    name="rupee"
                    size={12}
                    style={{
                      color: theme == 'light' ? 'black' : 'red',
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
                    {item.mrp * item.quantity}.00
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 12,
                      alignItems: 'center',
                      color: theme == 'light' ? '#000' : 'white',
                    }}>
                    {strings.OFFER_PRICE}
                  </Text>
                  <FA
                    name="rupee"
                    size={12}
                    style={{
                      color: theme == 'light' ? '#000' : 'green',
                      padding: 1,
                      marginLeft: 5,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: 'green',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      marginTop: 1,
                    }}>
                    {/* {item.costprice}*{item.quantity}
                     */}
                    {item.costprice * item.quantity}
                  </Text>
                </View>

                {item?.subItemList?.map(item => {
                  return (
                    <>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            alignItems: 'center',
                            fontSize: 12,
                            color: theme == 'light' ? '#000' : 'white',
                          }}>
                          {strings.SUB_ITEMS_NAME}
                        </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            color: theme == 'light' ? '#000' : 'white',
                            fontSize: 14,
                            fontFamily: 'Poppins-Medium',
                            marginLeft: 2,
                          }}>
                          {item.productname}
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            alignItems: 'center',
                            fontSize: 12,
                            color: theme == 'light' ? '#000' : 'white',
                          }}>
                          {strings.SUB_ITEMS_PRICE}
                        </Text>
                        <FA
                          name="rupee"
                          size={14}
                          style={{
                            color: theme == 'light' ? '#000' : 'white',
                            padding: 1,
                            marginLeft: 5,
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: theme == 'light' ? '#000' : 'white',
                            fontFamily: 'Poppins-Medium',
                            marginLeft: 2,
                            alignItems: 'center',
                          }}>
                          {item.costprice * item.qty}.00
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Medium',
                            alignItems: 'center',
                            fontSize: 12,
                            color: theme == 'light' ? '#000' : 'white',
                          }}>
                          {strings.SUB_ITEMS_QUANTITY}:
                        </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: theme == 'light' ? '#000' : 'white',
                            fontFamily: 'Poppins-Medium',
                            marginLeft: 2,
                            alignItems: 'center',
                          }}>
                          {item.qty}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={{
                  width: 30,
                  height: 30,
                  margin: 10,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}>
                <Icon
                  name={'delete'}
                  size={20}
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    color: theme == 'light' ? '#000' : 'white',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <ImageBackground
      source={require('../component/assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <ScrollView>
        <View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  paddingTop: 10,
                  marginBottom: 10,
                }}>
                {strings.CART}
              </Text>
              <MCI
                name="cart"
                size={24}
                style={{color: COLORS.btnColor, padding: 5}}
              />
            </View>
            <View style={{marginBottom: height * 0.1}}>
              <FlatList
                data={productDetails}
                renderItem={({item}) => <DataInCart item={item} />}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <AppButton
              onPress={()=>navigation.navigate('BarcodeScanner')}
              buttonText={strings.ADD_MORE_PRODUCT}
            />
            <AppButton
              onPress={handlePlaceOrder}
              buttonText={strings.PLACE_ORDER}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
