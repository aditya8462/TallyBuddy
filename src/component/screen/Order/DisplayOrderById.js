/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {getData, ServerURL} from '../../Connection/FetchServices';
const {height, width} = Dimensions.get('window');
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';

import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FA from 'react-native-vector-icons/FontAwesome';
import SearchInput from '../../uicomponents/SearchInput';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { Appearance } from 'react-native';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function DisplayOrderById({navigation, route}) {
  const [loader, setLoader] = useState(true);
  const [demandsentemployee, setDemandSentEmployee] = useState([]);
  const[orderFilter,setOrderFilter]=useState([])
  
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const status = {
    0: 'Cancelled',
    1: 'Order Booked',
    2: 'Ready for Delivery',
    3: 'Out for delivery',
    4: 'Delivered',
  };

  const fetchBillByStore = async () => {
    setLoader(true);
    var result = await getData('bill/byStore/' + route.params.id);
    if (result.status) {
      setDemandSentEmployee(result.data);
      setOrderFilter(result.data)
    }
    
    setLoader(false);
    console.log(result);
  };

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = orderFilter.filter(item =>
      item.cname.toLowerCase().includes(txt.toLowerCase()) ||
      item.cmobile.toLowerCase().includes(txt.toLowerCase()) ||
      item.cemail.toLowerCase().includes(txt.toLowerCase()) ||
      item.caddress.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setDemandSentEmployee(data);
  };

  useEffect(
    function () {
      fetchBillByStore();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchBillByStore();
    }, []),
  );

  const Boxes = ({item}) => {
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
            }}>
            <View style={{marginTop: 5, marginLeft: 15, width: width * 0.8}}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.cname}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="call"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 10,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.cmobile}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="email"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.cemail}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="home"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.caddress}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FA
                  name="rupee"
                  size={14}
                  style={{
                    padding: 1,
                    marginLeft: 5,
                    color: theme == 'light' ? COLORS.btnColor : 'white', 
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.total}.00
                </Text>
              </View>
              {item.added_by ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MI
                    name="account-edit"
                    size={12}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: theme == 'light' ? '#000' : 'white',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.added_by}
                  </Text>
                </View>
              ) : null}
            </View>
            {item.status > 0 ? (
              <View
                style={{
                  width: 50,
                  position: 'absolute',
                  right: 120,
                  top: -5,
                }}>
                <View
                  style={{
                    height: 30,
                    marginTop:height *0.007
                  }}>
                  <Tag
                    bgColor={item.status == '4' ? COLORS.green : 'orange'}
                    tagText={status[item.status]}
                    tagWidth={155}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: 50,
                  position: 'absolute',
                  right: 240,
                  top: -5,
                }}>
                <View
                  style={{
                    width: 450,
                    borderBottomEndRadius: 8,
                    borderBottomStartRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 30,
                  }}>
                   <Tag
                  bgColor={'#fff'}
                  tagText={'Cancelled'}
                  txtColor={'red'}
                  tagWidth={155}
              />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchBillByStore();
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
          <View style={{alignItems: 'center'}}>
            <SearchInput
              placeholder={strings.SEARCH}
              simpleLineIcons="magnifier"
              onChangeText={handleFilter}
              height={40}
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
           <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View style={{width: width, marginTop: 10}}>
              {loader ? (
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    overflow: 'hidden',
                    marginVertical: 5,
                    borderWidth: 0.4,
                    borderColor: '#f2f2f2',
                    width: width * 0.95,
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '110%',
                      padding: 10,
                      flexDirection: 'row',
                      backgroundColor: COLORS.cardcolor,
                    }}>
                    <View>
                      <ShimerPlaceHolder
                        style={{
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.9,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                    </View>
                  </View>
                </View>
              ) : demandsentemployee.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={demandsentemployee}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('DisplayBillById', {
                          bill_id: item.bill_id,
                        })
                      }>
                      <Boxes item={item} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
                </View>
              ) : theme == 'light' ? (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/NOData.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
            </ScrollView>
          </View>
        </View>
    </ImageBackground>
  );
}
