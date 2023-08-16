/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  Image,
  Appearance,
} from 'react-native';
import {getData} from '../../Connection/FetchServices';
const {height, width} = Dimensions.get('screen');
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/FontAwesome';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import ENT from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import NextButton from '../../uicomponents/NextButton';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function ModelDetails({navigation}) {
  const [models, setModels] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modelFilter, setModelFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [footerLoader, setFooterLoader] = useState(false);

  const [page, setPage] = useState({
    currentPage: 1,
    previousPage: 0,
    nextPage: 2,
  });

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchModels = async p => {
    setLoader(true);
    var result = await getData('model?page='+(p == 'previous'
    ? page.previousPage
    : p == 'next'
    ? page.nextPage
    : page.currentPage));
    if (result.status) {
      if(result.data.length > 0){
      setPage({
        currentPage: result.currentPage,
        previousPage: result.previousPage,
        nextPage: result.nextPage,
      });
      setModels(result.data);
      setModelFilter(result.data);
    }
  }
    setLoader(false);
    setFooterLoader(false);
  };

  useEffect(
    function () {
      fetchModels();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchModels();
    }, []),
  );

  const str = undefined

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = modelFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.model_no.toLowerCase().includes(txt.toLowerCase()) ||
        item.discount.toLowerCase().includes(txt.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(txt.toLowerCase())||
        item.brand_name?.toLowerCase().includes(txt.toLowerCase()),

    );
    console.log(data);
    setModels(data);
  };

  const Boxes = ({item, index}) => {
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
              padding: 5,
              paddingLeft: 8,
              paddingTop: 6,
              flexDirection: 'row',
              borderRadius: 10,
              width: width * 0.9,
            }}>
            <View style={{marginTop: 4, marginLeft: 10, width: width * 0.83}}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: theme == 'light' ? '#000' : 'white',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="cubes"
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
                  {item.model_no}
                </Text>
              </View>
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MC
                name="list-status"
                size={14}
                style={{color:  COLORS.btnColor, padding: 1}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 10,
                  color: '#2C2C2C',
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 5,
                  color: item.status == '1' ? 'green' : 'red'
                }}>
                {item.status == '1' ? 'Active' : 'Inactive' }
              </Text>
            </View> */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="category"
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
                  {item.category_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ENT
                  name="price-tag"
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
                  {item.brand_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MC
                  name="label-percent"
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
                  {item.discount}
                  <MCI name="percent" size={10} />
                </Text>
              </View>
              {item.added_by ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MC
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
                navigation.navigate('Edit Model', {id: item.model_id})
              }
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                margin: 5,
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
      fetchModels();
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
            <View style={{width: width, marginTop: 10}}>
              {loader ? (
                <View style={{alignItems: 'center'}}>
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
                </View>
              ) : models.length != 0 ? (
                <View style={{marginBottom: height * 0.23}}>
                  <FlatList
                    data={models}
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
                                onPress={() => fetchModels('previous')}
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
                              onPress={() => fetchModels('next')}
                              bgColor={COLORS.btnColor}
                            />
                            </View>
                          </View>
                        ) : (
                          <View style={{alignItems: 'flex-end'}}>
                            <View style={{padding: 5}}>
                              <NextButton
                                buttonText={strings.NEXT}
                                onPress={()=>fetchModels('next')}
                                bgColor={COLORS.btnColor}
                              />
                            </View>
                          </View>
                        )}
                      </>
                    }
                    renderItem={({item, index}) => (
                      <Boxes item={item} index={index} />
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
