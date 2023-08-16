/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
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
import {getData} from '../../Connection/FetchServices';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const {height} = Dimensions.get('screen');
export default function StoreDetails({navigation}) {
  const [stores, setStores] = useState([]);
  const [loader, setLoader] = useState(true);
  const [storeFilter, setStoreFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchStoreDetails = async () => {
    setLoader(true);
    var result = await getData('store');
    if (result.status) {
      setStores(result.data.reverse());
      setStoreFilter(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchStoreDetails();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchStoreDetails();
    }, []),
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = storeFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
        item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        item.address.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setStores(data);
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
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="call"
                  size={14}
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
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="home"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 10,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.address}
                </Text>
              </View>
              {item.emailid ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="email"
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
                    {item.emailid}
                  </Text>
                </View>
              ) : null}
              {item.added_by ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
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
                navigation.navigate('Edit Store', {id: item.store_id})
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
                style={{
                  alignSelf: 'center',
                  marginTop: 5,
                  color: theme == 'light' ? '#000' : 'white',
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: 50,
                position: 'absolute',
                right: 100,
                top: -5,
              }}>
              <View
                style={{
                  width: 100,
                  borderBottomEndRadius: 8,
                  borderBottomStartRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  
                marginTop:height *0.0055
                }}>
                <Tag
                  bgColor={item.status == '1' ? COLORS.green : '#fff'}
                  txtColor={item.status == '1' ? '#03753C': 'red' }
                  tagText={item.status == '1' ? 'Active' : 'Inactive'}
                />
              </View>
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
      fetchStoreDetails();
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
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
            <View style={{width: width, marginTop: 5}}>
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
                    </View>
                  </View>
                </View>
              ) : stores.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={stores}
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