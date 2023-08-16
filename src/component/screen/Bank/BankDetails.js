/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  Image,
  RefreshControl,
  Appearance,
} from 'react-native';
import {getData} from '../../Connection/FetchServices';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AppButton from '../../uicomponents/AppButton';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function BankDetails({navigation}) {
  const [banks, setBanks] = useState([]);
  const [loader, setLoader] = useState(true);
  const [bankFilter, setBankFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchBankDetails = async () => {
    setLoader(true);
    var result = await getData('banks');
    if (result.status) {
      setBanks(result.data.reverse());
      setBankFilter(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchBankDetails();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchBankDetails();
    }, []),
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = bankFilter.filter(item =>
      item.name.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setBanks(data);
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
            <View style={{marginTop: 5, marginLeft: 10, width: width * 0.8}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="bank"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 14,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 5,
                  }}>
                  {item.name}
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
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="list-status"
                size={14}
                style={{color:  COLORS.btnColor, padding: 1}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color:  item.status == '1' ? 'green' : 'red',
                  fontFamily: 'Poppins-Medium',
                  marginLeft:5
                }}>
                {item.status == '1' ? 'Active' : 'Inactive'}
              </Text>
            </View> */}
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Edit Bank', {id: item.bank_id})
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
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  marginTop:height *0.0035
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
      fetchBankDetails();
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
                    </View>
                  </View>
                </View>
              ) : banks.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={banks}
                  renderItem={({item}) => <Boxes item={item} />}
                  keyExtractor={item => item.id}
                />
                {/* <AppButton
                onPress={()=>navigation.navigate('Cash')}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              /> */}
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
