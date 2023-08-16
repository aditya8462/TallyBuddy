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
  RefreshControl,
  Appearance,
} from 'react-native';
import {getData, ServerURL} from '../../Connection/FetchServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import MCI from 'react-native-vector-icons/FontAwesome';
import ENT from 'react-native-vector-icons/Entypo';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getStoreData} from '../../storage/AsyncStorage';
import SearchInput from '../../uicomponents/SearchInput';
import strings from '../../../changeLanguage/LocalizedString';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import FastImage from 'react-native-fast-image';
import NextButton from '../../uicomponents/NextButton';
import Tag from '../../uicomponents/Tag';

import debounce from 'lodash/debounce';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const {height, width} = Dimensions.get('screen');

export default function DisplayProductByEmployee({navigation}) {
  const [loader, setLoader] = useState(true);
  const [store, setStore] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [productsFilter, setProductsFilter] = useState([]);
  const [footerLoader, setFooterLoader] = useState(false);

  const [page, setPage] = useState({
    currentPage: 1,
    previousPage: 0,
    nextPage: 2,
  });
  const handleFilter = txt => {
    setFilterInput(txt);
    const data = productsFilter.filter(
      item =>
        item.category_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.brand_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.model_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.vendor_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.color?.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setStore(data);
  };

  const fetchProductsByStore = async (p, txt = undefined)  => {
    setLoader(true);
    var st = await getStoreData('EMPLOYEE');
    var result = await getData('product/byStore/' + st.store_id+'?page='+ 
    (p == 'previous'
    ? page.previousPage
    : p == 'next'
    ? page.nextPage
    : txt || filterInput 
    ? 1
    : page.currentPage)+
    (txt || filterInput ? '&filter=' + txt || filterInput : ''),
    );
    if (result.status) {
      if(result.data.length > 0){
      setPage({
        currentPage: result.currentPage,
        previousPage: result.previousPage,
        nextPage: result.nextPage,
      });
      setStore(result.data);
      setProductsFilter(result.data);
    }
    }
    setLoader(false);
    setFooterLoader(false);
    console.log(result);
  };

  useEffect(function () {
    fetchProductsByStore();
    selectedLng();
  }, []);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchProductsByStore();
      setRefreshing(false);
    }, 2000);
  }, []);
  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };
  const Boxes = ({item}) => (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          flex: 1,
          height: 130,
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
            padding: 5,
            paddingLeft: 8,
            paddingTop: 6,
            flexDirection: 'row',
            borderRadius: 10,
            width: width * 0.9,
          }}>
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <FastImage
              source={{uri: `${ServerURL}/images/${item.picture}`,priority: FastImage.priority.normal}}
              style={{
                width: 100,
                height: '100%',
                resizeMode: 'contain',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: theme == 'light' ? '#000' : 'white',
              }}
            />
          </TouchableOpacity>

          <View style={{marginTop: 4, marginLeft: 10, width: width * 0.7}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="category"
                size={14}
                style={{
                  color: theme == 'light' ? COLORS.btnColor : 'white',
                  padding: 1,
                }}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.category_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ENT
                name="price-tag"
                size={14}
                style={{
                  color: theme == 'light' ? COLORS.btnColor : 'white',
                  padding: 1,
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
                {item.brand_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="cubes"
                size={14}
                style={{
                  color: theme == 'light' ? COLORS.btnColor : 'white',
                  padding: 1,
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
                {item.model_name}
              </Text>
            </View>
            {item.added_by ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MC
                  name="account-edit"
                  size={12}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
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
                  {item.added_by}
                </Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditProductByEmployee', {id: item.product_id})
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
                color: theme == 'light' ? '#2C2C2C' : 'white',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
            style={{
              width: 50,
              position: 'absolute',
              right: 100,
              top: -5,
            }}>
            <View
              style={{
                width: 120,
                position: 'absolute',
                height: 30,
              marginTop:height *0.0035,
              marginRight: width * 0.08,
              }}>
              <Tag
                bgColor={item.manufacturing == '1' ? COLORS.green :  COLORS.cardcolor}
                tagText={item.manufacturing == '1' ? 'ManuFactured' : null}
              />
            </View>
          </View>
      </View>
    </View>
  );
  const debounceOnChange = debounce((txt) => {
    fetchProductsByStore(undefined, txt);
  }, 500);

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
            onChangeText={debounceOnChange}
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
                    <ShimerPlaceHolder
                      style={{
                        width: 85,
                        resizeMode: 'cover',
                        alignItems: 'center',
                        borderRadius: 8,
                        height: '100%',
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
              ) : Object.keys(store).length != 0 ? (
                <View style={{marginBottom: height * 0.1}}>
                  <FlatList
                    data={store}
                    ListFooterComponent={
                      <>
                        {page.previousPage != 0 ? (
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                            }}>
                            <View
                              style={{padding: 5, marginLeft: width * 0.06}}>
                              <NextButton
                                buttonText={strings.PREV}
                                onPress={() => fetchProductsByStore('previous')}
                                bgColor={COLORS.btnColor}
                              />
                            </View>
                             <View
                            style={{
                              padding: 5,
                              marginRight: width * 0.06,
                              justifyContent: 'flex-end',
                            }}>
                            <NextButton
                              buttonText={strings.NEXT}
                              onPress={() => fetchProductsByStore('next')}
                              bgColor={COLORS.btnColor}
                            />
                            </View>
                          </View>
                        ) : (
                          <View style={{alignItems: 'flex-end'}}>
                            <View style={{padding: 5}}>
                              <NextButton
                                buttonText={strings.NEXT}
                                onPress={()=>fetchProductsByStore('next')}
                                bgColor={COLORS.btnColor}
                              />
                            </View>
                          </View>
                        )}
                      </>
                    }
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Store Product Detail', {
                            id: item.product_id,
                            manufacturing:item.manufacturing
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
