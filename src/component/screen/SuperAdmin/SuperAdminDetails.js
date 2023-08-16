/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  Appearance,
} from 'react-native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import {getData} from '../../Connection/FetchServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import strings from '../../../changeLanguage/LocalizedString';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';

import {RefreshControl} from 'react-native';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const {height, width} = Dimensions.get('window');
export default function SuperAdminDetails({navigation}) {
  const [admins, setAdmins] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [productsFilter, setProductsFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = React.useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchSuperAdminDetails();
      setRefreshing(false);
    }, 2000);
  }, []);
  const fetchSuperAdminDetails = async () => {
    setLoader(true);
    var result = await getData('superadmin');
    if (result.status) {
      setAdmins(result.data.reverse());
      setProductsFilter(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchSuperAdminDetails();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchSuperAdminDetails();
    }, []),
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = productsFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
        item.username.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setAdmins(data);
  };

  const Boxes = ({item}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
            height:110,
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
              backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
              width: width * 0.9,
            }}>
            <Image
              source={require('../../assets/user.png')}
              style={{
                width: 85,
                height: '90%',
                resizeMode: 'contain',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: 'white',
              }}
            />
            <View
              style={{
                marginLeft: 10,
                width: width * 0.55,
              }}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              {item.emailid ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="email"
                    size={12}
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
                    {item.emailid}
                  </Text>
                </View>
              ) : null}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="call"
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
                  {item.mobileno}
                </Text>
              </View>
              {item.username ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="supervised-user-circle"
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
                    {item.username}
                  </Text>
                </View>
              ) : null}
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Edit Super Admin', {id: item.id})
              }
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                position: 'absolute',
                right: 0,
                top: 0,
              }}>
              <Icon
                name={'edit'}
                size={20}
                style={{alignSelf: 'center', marginTop: 5, color: theme == 'light' ? '#000' : 'white',}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
          <View style={{alignItems: 'center'}}>
            <SearchInput
              placeholder={strings.SEARCH}
              simpleLineIcons="magnifier"
              onChangeText={handleFilter}
              height={40}
              placeholderTextColor= {theme== 'light'? "black":'white'}
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
                    <ShimerPlaceHolder
                      style={{
                        width: 85,
                        resizeMode: 'contain',
                        alignItems: 'center',
                        borderRadius: 8,
                        height: 80,
                      }}
                      shimmerColors={['#FFF', '#F2F3F4', '#E5E7E9']}
                    />
                    <View>
                      <ShimerPlaceHolder
                        style={{
                          marginLeft: 10,
                          width: width * 0.6,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.6,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.6,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                      <ShimerPlaceHolder
                        style={{
                          marginTop: 4,
                          marginLeft: 10,
                          width: width * 0.6,
                          height: 16.5,
                          borderRadius: 3,
                        }}
                        shimmerColors={['#FFF', '#EEEEEE', '#E5E7E9']}
                      />
                    </View>
                  </View>
                </View>
              ) : admins.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={admins}
                  renderItem={({item}) => <Boxes item={item} />}
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
