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
  RefreshControl,
  Appearance,
} from 'react-native';
import {getData, ServerURL} from '../../Connection/FetchServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/FontAwesome5';
import ENT from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import FastImage from 'react-native-fast-image';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const {width, height} = Dimensions.get('window');
export default function AllServiceman({navigation}) {
  const isFocused = useIsFocused();
  const [serviceMans, setServiceMans] = useState([]);
  const [loader, setLoader] = useState(true);
  const [servicemanFilter, setServiceManFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');

  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchServiceManDetails = async () => {
    setLoader(true);
    var result = await getData('serviceman');
    if (result.status) {
      setServiceMans(result.data.reverse());
      setServiceManFilter(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchServiceManDetails();
      selectedLng();
    },
    [],
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = servicemanFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        item.address.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setServiceMans(data);
  };

  const Boxes = ({item}) => {
    return (
      <ScrollView style={{flex: 1}}>
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
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
              <View style={{marginLeft: 10, width: width * 0.8, marginTop: 5}}>
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
                {item.emailid ?( <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                </View>):null}
               
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
                <View style={{flexDirection: 'row',width:width*0.65}}>
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="address-card"
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
                    {item.addhar_no}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <ENT
                    name="location-pin"
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
                    {JSON.parse(item.servicearea)?.join(', ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchServiceManDetails();
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
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
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
          <View style={{width: width, flex: 1}}>
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
                  </View>
                </View>
              </View>
            ) : serviceMans.length != 0 ? (
              <View style={{marginBottom: height * 0.24}}>
              <FlatList
                data={serviceMans}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Serviceman Location', {
                        id: item.serviceman_id,
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
    </ImageBackground>
  );
}
