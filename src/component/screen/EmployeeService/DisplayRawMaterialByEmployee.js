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
  } from 'react-native';
  import MCI from 'react-native-vector-icons/MaterialIcons';
  import {ServerURL, getData} from '../../Connection/FetchServices';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import MI from 'react-native-vector-icons/MaterialCommunityIcons';
  import React, {useState, useEffect} from 'react';
  import {TouchableOpacity} from 'react-native';
  import {useIsFocused} from '@react-navigation/native';
  import COLORS from '../../helper/Colors';
  import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
  import LinearGradient from 'react-native-linear-gradient';
  import SearchInput from '../../uicomponents/SearchInput';
  import strings from '../../../changeLanguage/LocalizedString';
  import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
  import FA from 'react-native-vector-icons/FontAwesome';
  import FA5 from 'react-native-vector-icons/FontAwesome5';
  
  import {RefreshControl} from 'react-native';
  import {Appearance} from 'react-native';
import { getStoreData } from '../../storage/AsyncStorage';
import FastImage from 'react-native-fast-image';
  const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const {height, width} = Dimensions.get('window');
  export default function DisplayRawMaterialByEmployee({navigation}) {
    const [rawmaterial, setRawMaterials] = useState([]);
    const [loader, setLoader] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [productsFilter, setProductsFilter] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const isFocused = useIsFocused();
  
    const handleImagePress = item => {
      navigation.navigate('ImageSelected', {imgp: item});
    };
    const [theme, setTheme] = useState(Appearance.getColorScheme());
  
    Appearance.addChangeListener(scheme => {
      setTheme(scheme.colorScheme);
    });
    const fetchRawmaterial = async () => {
     
      setLoader(true);
      var st = await getStoreData('EMPLOYEE');
      var result = await getData('rawmaterial/byStore/' + st.store_id);
      if (result.status) {
        setRawMaterials(result.data.reverse());
        setProductsFilter(result.data);
      }
      setLoader(false);
    };
  
    useEffect(
      function () {
        fetchRawmaterial();
        selectedLng();
      },
      [],
    );
      
    const handleFilter = txt => {
      setFilterInput(txt);
      const data = productsFilter.filter(
        item =>
          item.product_name.toLowerCase().includes(txt.toLowerCase()) ||
          item.vendor_name?.toLowerCase().includes(txt.toLowerCase()) ||
          item.mobileno?.toLowerCase().includes(txt.toLowerCase()) ||
          item.username?.toLowerCase().includes(txt.toLowerCase()),
      );
      console.log(data);
      setRawMaterials(data);
    };
  
    const Boxes = ({item}) => {
      return (
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
                    resizeMode: 'cover',
                    alignItems: 'center',
                    borderRadius: 8,
                    backgroundColor: theme == 'light' ? '#000' : 'white',
                  }}
                />
              </TouchableOpacity>
  
              <View
                style={{
                  marginTop: 4,
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
                  {item.product_name}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="supervised-user-circle"
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
                      fontSize: 10,
                      color: theme == 'light' ? '#000' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.vendor_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FA
                    name="rupee"
                    size={12}
                    style={{
                      color: theme == 'light' ? COLORS.btnColor : 'white',
                      padding: 1,
                      marginLeft: 3,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: 'red',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                      marginTop: 1,
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}>
                    {item.price}.00
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FA
                    name="rupee"
                    size={12}
                    style={{
                      color: theme == 'light' ? COLORS.btnColor : 'white',
                      marginLeft: 3,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: 'green',
                      fontSize: 10,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.offerprice}.00
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FA5
                    name="boxes"
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
                      marginLeft: 5,
                    }}>
                    {item.quantity}
                  </Text>
                </View>
                {item.added_by ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MI
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
                  navigation.navigate('EditRawMaterialByEmployee', {
                    id: item.rawmaterial_id,
                  })
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
            </View>
          </View>
        </View>
      );
    };
    const [refreshing, setRefreshing] = React.useState(false);
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        fetchRawmaterial();
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
                ) : rawmaterial.length != 0 ? (
                  <View style={{marginBottom: height * 0.24}}>
                    <FlatList
                      data={rawmaterial}
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
  