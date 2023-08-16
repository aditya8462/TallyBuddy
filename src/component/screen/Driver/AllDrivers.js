/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
    View,
    Dimensions,
    Text,
    Image,
    FlatList,
    ImageBackground,
    Appearance,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import {useFocusEffect, useIsFocused} from '@react-navigation/native';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import {TouchableOpacity} from 'react-native';
  import {getData, postData} from '../../Connection/FetchServices';
  import {ScrollView} from 'react-native-gesture-handler';
  import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
  import COLORS from '../../helper/Colors';
  import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
  import LinearGradient from 'react-native-linear-gradient';
  import SearchInput from '../../uicomponents/SearchInput';
  import { RefreshControl } from 'react-native';
  import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
  import strings from '../../../changeLanguage/LocalizedString';
  
  const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  
  const {height, width} = Dimensions.get('screen');
  
  export default function AllDrivers({navigation}) {
    const [vendors, setVendors] = useState([]);
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState('');
    const [vendorFilter, setVendorFilter] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const isFocused = useIsFocused();

    const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  
  
    const fetchVendors = async () => {
      setLoader(true);
      var result = await postData('driver/driverlist');
      
      if (result.status) {
        setVendors(result.data.reverse());
        setVendorFilter(result.data);
      }

      setLoader(false);
    };
  
    useEffect(function () {
      fetchVendors();
      selectedLng();
    }, [isFocused]);
  
    useFocusEffect(
      React.useCallback(() => {
        fetchVendors();
      }, []),
    );
  
    const handleFilter = txt => {
      setFilterInput(txt);
      const data = vendorFilter.filter(
        item =>
          item.firm_name.toLowerCase().includes(txt.toLowerCase()) ||
          item.type_of_firm.toLowerCase().includes(txt.toLowerCase()) ||
          item.gstno.toLowerCase().includes(txt.toLowerCase()) ||
          item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
          item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
          item.city.toLowerCase().includes(txt.toLowerCase()) ||
          item.state.toLowerCase().includes(txt.toLowerCase()) ||
          item.address.toLowerCase().includes(txt.toLowerCase()),
      );
      console.log(data);
      setVendors(data);
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
              padding: 5,
              paddingLeft: 8,
              paddingTop: 6,
              flexDirection: 'row',
              borderRadius: 10,
              width: width * 0.9,
            }}>
              <View style={{marginTop: 4, marginLeft: 10, width: width * 0.52}}>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.drivername}
                </Text>
               
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="truck-fast"
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
                    {item.vehicleno}
                  </Text>
                </View>
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
                    {item.drivermobile}
                  </Text>
                </View>
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
              <View style={{marginTop: 4, width: width * 0.3}}>
               
                
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
        fetchVendors();
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
          backgroundColor: theme == 'light' ? '#ffff' : 'black',
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
             <ScrollView  refreshControl={
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
                ) : vendors.length != 0 ?(
                  <View style={{marginBottom: height * 0.24}}>
                  <FlatList
                    data={vendors}
                    renderItem={({item}) =><TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Driver Payment', {
                         id: item.drivermobile,
                      })
                    }>
                        <Boxes item={item}/>
                        </TouchableOpacity>}
                    keyExtractor={item => item.id}
                  />
                  </View>
                ):theme == 'light' ? (
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
  