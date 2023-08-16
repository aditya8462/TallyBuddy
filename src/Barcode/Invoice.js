/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Appearance,
} from 'react-native';
import {Divider} from 'react-native-elements';
import AppButton from '../component/uicomponents/AppButton';
import {useSelector} from 'react-redux';
import {ServerURL} from '../component/Connection/FetchServices';
import FA from 'react-native-vector-icons/FontAwesome';
import {selectedLng} from '../changeLanguage/ChangeLanguage';
import strings from '../changeLanguage/LocalizedString';

const {height, width} = Dimensions.get('window');

export default function Invoice({navigation}) {
  const product = useSelector(state => state.cart);
  const productDetails = Object.values(product);
  const [error, setError] = useState({});
  const [inputs, setInputs] = useState({
    bank_id: '',
  });

  const [theme, setTheme] = useState(Appearance.getColorScheme())

  Appearance.addChangeListener((scheme)=>{
   setTheme(scheme.colorScheme);
  })

  const handleContinue = () => {
    navigation.navigate('Customer');
  };

  const validate = () => {
    var isValid = true;
    if (!inputs.bank_id) {
      handleErrors('Please Input Category Id', 'categoryid');
      isValid = false;
    }

    const handleErrors = (txt, attr) => {
      setError(prevStates => ({...prevStates, [attr]: txt}));
    };

    const handleValues = (txt, attr) => {
      setInputs(prevStates => ({...prevStates, [attr]: txt}));
    };
  };
  const finalPrice = productDetails.reduce(
    (acc, item) => {
      acc.mrp += Number(item.costprice) * Number(item?.quantity ?? 1);
      acc.productcost += Number(item.costprice) * Number(item?.quantity ?? 1);
      item.subItemList.map(sitem => {
        acc.mrp += Number(sitem.costprice) * Number(sitem?.qty);
        acc.subitemcost += Number(sitem.costprice) * Number(sitem?.qty);
      });
      return acc;
    },
    {mrp: 0, productcost: 0, subitemcost: 0},
  );

  useEffect(
    function () {
      selectedLng();
    },
    [],
  );

  const DataInCart = ({item}) => {
    return (
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
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={{uri: `${ServerURL}/images/${item.picture}`}}
              style={{
                width: 85,
                height: '90%',
                resizeMode: 'contain',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: theme == 'light' ? '#000' : 'white',
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12,color: theme == 'light' ? '#000' : 'white',}}>
                {strings.PRODUCT_ID}:
              </Text>
              <Text
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 2,
                }}>
                {item.product_id}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12,color: theme == 'light' ? '#000' : 'white',}}>
                {strings.CATEGORY}:
              </Text>
              <Text
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 2,
                }}>
                {item.category_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  alignItems: 'center',
                }}>
                {strings.PRICE}
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{color: '#000', padding: 1, marginLeft: 5}}
              />
              <Text
                style={{
                  color: '#000',
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.costprice}.00
              </Text> */}
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12,color: theme == 'light' ? '#000' : 'white',}}>
                {strings.QUANTITY}:
              </Text>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 3,
                }}>
                {item.quantity}
              </Text>
              {item.color ? (<><Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  marginLeft: width * 0.03,
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.COLOR}:
              </Text>
              <Text
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 2,
                }}>
                {item.color}
              </Text></>):null}
              
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
                {strings.MRP}:
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{color: theme == 'light' ? '#000' : 'red', padding: 1, marginLeft: 5}}
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
                {strings.OFFER_PRICE}:
              </Text>
              <FA
                name="rupee"
                size={12}
                style={{color: theme == 'light' ? '#000' : 'green', padding: 1, marginLeft: 5}}
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
                {item.costprice * item.quantity}
              </Text>
            </View>
           
            {item?.subItemList?.map(item => {
              return (
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        alignItems: 'center',
                        fontSize: 12,
                        color: theme == 'light' ? '#000' : 'white',
                      }}>
                      {strings.SUB_ITEMS}:
                    </Text>
                    <Text
                      style={{
                        color: theme == 'light' ? '#000' : 'white',
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 3,
                      }}>
                      {item.productname}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* <Text>Quantity: {item.quantity}</Text> */}
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        alignItems: 'center',
                        fontSize: 12,
                        color: theme == 'light' ? '#000' : 'white',
                      }}>
                      {strings.SUB_ITEMS_PRICE}:
                    </Text>
                    <FA
                      name="rupee"
                      size={12}
                      style={{color: theme == 'light' ? '#000' : 'white', padding: 1, marginLeft: 5}}
                    />
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        color: theme == 'light' ? '#000' : 'white',
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 2,
                      }}>
                      {item.costprice*item.qty}.00
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* <Text>Quantity: {item.quantity}</Text> */}
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
                        color: theme == 'light' ? '#000' : 'white',
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                        marginLeft: 2,
                      }}>
                      {item.qty}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      </View>
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
          <ScrollView>
            <FlatList
              data={productDetails}
              renderItem={({item}) => <DataInCart item={item} />}
              keyExtractor={item => item.id}
            />
          </ScrollView>
        </View>
        <Divider style={{marginTop: 5}} />
        
        <View style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                alignItems: 'center',
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
              }}>
              {strings.PRODUCT_PRICE}:
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FA
                name="rupee"
                size={14}
                style={{color: theme == 'light' ? '#000' : 'white', padding: 1, marginLeft: 5}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 2,
                }}>
                {finalPrice.productcost}.00
              </Text>
            </View>
          </View>
          {productDetails?.[0]?.subitemlist ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  alignItems: 'center',
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.SUB_ITEMS_PRICE}:
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FA
                  name="rupee"
                  size={14}
                  style={{color: theme == 'light' ? '#000' : 'white', padding: 1, marginLeft: 5}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 2,
                  }}>
                  {finalPrice.subitemcost}.00
                </Text>
              </View>
            </View>
          ) : null}

          
        </View>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              alignItems: 'center',
              fontSize: 14,
              color: theme == 'light' ? '#000' : 'white',
            }}>
            {strings.TOTAL}:
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FA
              name="rupee"
              size={14}
              style={{color: theme == 'light' ? '#000' : 'white', padding: 1, marginLeft: 5}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                marginLeft: 2,
              }}>
              {finalPrice.mrp}.00
            </Text>
          </View>
        </View>
        <View style={{margin: 20, alignItems: 'center'}}>
          <AppButton buttonText={strings.CONTINUE} onPress={handleContinue} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}


