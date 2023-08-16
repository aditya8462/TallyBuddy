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
} from 'react-native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import Ant from 'react-native-vector-icons/Entypo';
import {getData, ServerURL} from '../../Connection/FetchServices';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { Appearance } from 'react-native';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function StoreByEmployee({navigation,route}) {
  const [employees, setEmployees] = useState([]);
  const [loader, setLoader] = useState(true);
  const [employeeFilter, setEmployeeFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchEmployeeByStore = async () => {
    setLoader(true);
    var result = await getData('employee/byStore/'+route.params.id);

    if (result.status) {
      setEmployees(result.data.reverse());
      setEmployeeFilter(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  useEffect(function () {
    fetchEmployeeByStore();
    selectedLng();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchEmployeeByStore();
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = employeeFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
        item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        item.address.toLowerCase().includes(txt.toLowerCase()) ||
        item.addhar_no.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setEmployees(data);
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
         

          <View
            style={{
              marginTop: 4,
              marginLeft: 10,
              width: width * 0.7,
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="store"
                size={16}
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
                {item.store_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="call"
                size={16}
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
            {item.emailid ? (<View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="email"
                size={16}
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
              <Ant
                name="v-card"
                size={16}
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
                {item.addhar_no}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI
                name="home"
                size={16}
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
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
            />
             <ScrollView refreshControl={
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
                        height: "100%",
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
              ) : employees.length !=0 ?(
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={employees}
                  renderItem={({item}) =>  <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EmployeeReportSettlementDetails', {
                       id: item.employee_id,
                    })
                  }>
                  <Boxes item={item} />
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
