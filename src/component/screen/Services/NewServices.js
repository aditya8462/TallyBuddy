/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Dimensions,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  Appearance,
} from 'react-native';
import {getData, postData, putData} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getStoreData} from '../../storage/AsyncStorage';
import AppButtons from '../../uicomponents/AppButtons';
import SearchInput from '../../uicomponents/SearchInput';
import {Image} from 'react-native-elements';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function NewServices({navigation}) {
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [bankFilter, setBankFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchServicesByArea = async () => {
    setLoader(true);
    const ser = await getStoreData('SERVICEMAN');
   
    var result = await getData('services/byArea/' + ser.servicearea);
  //  alert(JSON.stringify(result.data))
    if (result.status) {
      setServices(result.data.reverse());
      setBankFilter(result.data)
      fetchSeenViewer(result.data.map(item => item.service_id));
    }
    setLoader(false);
  };
  const fetchSeenViewer = async services => {
    setLoader(true);
    const ser = await getStoreData('SERVICEMAN');
    body = {services: services, servicemanid: ser.serviceman_id};
    var result = await postData('serviceman/seenService', body);
    if (result.status) {
    }
    setLoader(false);
  };
  useEffect(
    function () {
      fetchServicesByArea();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchServicesByArea();
    }, []),
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = bankFilter.filter(item =>
      item.customername?.toLowerCase().includes(txt.toLowerCase())||
      item.address?.toLowerCase().includes(txt.toLowerCase())||
      item.added_by?.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setServices(data);
  };
  const handleButton = async (id, service_id) => {
    const ser = await getStoreData('SERVICEMAN');

    let body = {
      status: id == 1 ? 'Accepted' : 'Rejected',
      serviceman_id: ser.serviceman_id,
    };
    const result = await putData('services/' + service_id, body);
    if (result.status) {
      fetchServicesByArea();
    }
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
          // width: width * 0.9,
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
            // alignItems: 'center',
            // backgroundColor: COLORS.cardcolor,
            width: width * 0.9,
          }}>
          <View style={{marginLeft: 15, width: width * 0.8}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 2,
                  }}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: theme == 'light' ? '#000' : 'white',
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.tname}
                  </Text>
                </View>
<View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="supervised-user-circle"
                    size={16}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: theme == 'light' ? '#000' : 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.customername}
                  </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="home"
                    size={16}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                  />
                  <Text
                    numberOfLines={4}
                    adjustsFontSizeToFit
                    style={{
                      color: theme == 'light' ? '#000' : 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.address}
                  </Text>
                </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="call"
                    size={16}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      color: theme == 'light' ? '#000' : 'white',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.mobileno}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
               
              </View>
            </View>
            <View style={{width: width * 0.86}}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="description"
                  size={16}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: theme == 'light' ? '#000' : 'white',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.description}
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
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppButtons
                buttonText={strings.ACCEPT}
                entypo="check"
                color="white"
                size={16}
                bgColor={'green'}
                onPress={() => handleButton(1, item.service_id)}
              />
              <AppButtons
                buttonText={strings.REJECT}
                bgColor="red"
                entypo="cross"
                color="red"
                size={16}
                onPress={() => handleButton(2, item.service_id)}
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
      fetchServicesByArea();
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
              placeholderTextColor= {theme== 'light'? "black":'white'}
              height={40}
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
              ) : Object.keys(services).length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={services}
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
                    marginLeft:width*0.3
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
                    marginLeft:width*0.3
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
