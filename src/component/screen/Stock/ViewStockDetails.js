/* eslint-disable eqeqeq */
/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  Appearance,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {ServerURL, getData} from '../../Connection/FetchServices';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/FontAwesome';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import M from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../helper/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';

import ENT from 'react-native-vector-icons/Entypo';
import moment from 'moment';
const {height, width} = Dimensions.get('window');

export default function ViewStockDetails({navigation, route}) {
  const [bills, setBills] = useState({});
  const [loader, setLoader] = useState(true);
  const [detail, setDetails] = useState([]);
  const isFocused = useIsFocused();
  const [billdetails, setBillDetails] = useState([]);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchBillDetails = async () => {
    setLoader(true);
    var result = await getData('stock/' + route.params.id);
    // alert(JSON.stringify(result))
    if (result.status) {
      setBillDetails(result.data);
      setBills(result.billDetails);
    }
    setLoader(false);
  };

  const fetchBankDetails = async () => {
    setLoader(true);
    var result = await getData('bank');
    if (result.status) {
      setEmployees(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  useEffect(
    function () {
      fetchBankDetails();
      fetchBillDetails();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchBankDetails();
      fetchBillDetails();
    }, []),
  );

  const Boxes = ({item}) => {
    return (
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
                Bill No
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.billno}
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
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.vendor_name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                Date
              </Text>
              <Text
                numberOfLines={3}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#57606f',
                  fontFamily: 'Poppins-Medium',
                }}>
                Added_by
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2f3542',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.added_by}
              </Text>
              {item.store_name > 1 && (
                <>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#57606f',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {strings.STORE}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.store_name}
                  </Text>
                </>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const Box = ({item}) => {
    return (
      <View
        style={{
          //   flex: 1,
          marginHorizontal: 10,
          borderRadius: 10,
          overflow: 'hidden',
          marginVertical: 5,
          borderWidth: 0.7,
          borderColor: '#f2f2f2',
          paddingBottom: 3,
          paddingRight: 2,
          width: width * 0.9,
          justifyContent: 'space-between',
          backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
          width: width * 0.9,
          shadowColor: '#000000',
          alignItems: 'center',
          shadowOpacity: 0.8,
          shadowRadius: 2,
          width: '95%',
          shadowOffset: {
            height: 1,
            width: 1,
          },
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'column',
            paddingHorizontal: 20,
            // paddingVertical: 10,
            backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
          }}>
          <View
            style={{
              // marginTop: 4,
              marginLeft: 10,
              width: width * 0.9,
              flexDirection: 'row',
            }}>
            <View style={{width: width * 0.52}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <ENT
                  name="price-tag"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Category:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  {item.category_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <ENT
                  name="price-tag"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Brand:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                  }}>
                  {item.brand_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // paddingLeft: 2,
                }}>
                {/* <MCI
                  name="cubes"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Model:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.model_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <Icon
                  name="date-range"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 0.5,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: 'green',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Stock:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: 'green',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.stock}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <Icon
                  name="date-range"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 0.5,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: 'red',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Remaining Stock:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: 'red',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.remainingstock}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <MCI
                  name="rupee"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 0.5,
                  }}
                /> */}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Amount:
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.totalamount}
                </Text>
              </View>
            </View>
            <View style={{marginTop: 26, width: width * 0.3}}>
              {item.remainingstock > 0 && (
                <View style={{}}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                      alignSelf: 'center',
                    }}>
                    Not Distributed Yet
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Distribute Stock', {item: item})
                    }
                    style={{
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                      backgroundColor: COLORS.inputColor,
                      borderRadius: 5,
                      alignItems: 'center',
                      marginLeft: width * 0.005,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        padding: 5,
                        fontSize: 10,
                        color: '#000',
                      }}>
                      Distribute Now
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchBankDetails();
      fetchVendorDetails();
      setRefreshing(false);
    }, 2000);
  }, []);
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
              <Boxes item={bills} />

              <View style={{padding: 5, paddingLeft: 15}}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 16,
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                    textDecorationColor: 'white',
                    fontFamily: 'Poppins-Bold',
                  }}>
                  {strings.PRODUCT_DETAILS}
                </Text>
              </View>

              <View style={{height: height * 0.58}}>
                <FlatList
                  data={billdetails}
                  renderItem={({item}) => <Box item={item} />}
                  keyExtractor={item => item.id}
                />
              </View>
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: height * 0.02,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      fontSize: 14,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {strings.QUANTITY} {bills.stock}
                  </Text>
                  <Text
                    style={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      fontSize: 14,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {strings.AMOUNT} {bills.totalamount}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
