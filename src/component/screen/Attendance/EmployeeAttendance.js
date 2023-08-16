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
  Appearance,
} from 'react-native';
import {getData, ServerURL} from '../../Connection/FetchServices';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function EmployeeAttendance({navigation}) {
  const [employees, setEmployees] = useState([]);
  const [loader, setLoader] = useState(true);
  const [serviceman, setServiceMan] = useState({});
  const [attendanceFilter, setAttendanceFilter] = useState([]);
  const [attendancesFilter, setAttendancesFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchEmployees = async () => {
    setLoader(true);
    var result = await getData('employee/');
    if (result.status) {
      setEmployees(result.data);
      setAttendanceFilter(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  const fetchServiceman = async () => {
    setLoader(true);
    var result = await getData('serviceman/');
    if (result.status) {
      setServiceMan(result.data);
      setAttendancesFilter(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  useEffect(
    function () {
      fetchEmployees();
      fetchServiceman();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
      fetchServiceman();
    }, []),
  );

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = attendanceFilter.filter(
      item =>
        item.name.toLowerCase().includes(txt.toLowerCase()) ||
        item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
        item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        item.address.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setEmployees(data);
  };
  const handleFilters = txt => {
    setFilterInput(txt);
    const data = attendancesFilter.filter(
      items =>
        items.name.toLowerCase().includes(txt.toLowerCase()) ||
        items.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
        items.emailid.toLowerCase().includes(txt.toLowerCase()) ||
        items.servicearea.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setServiceMan(data);
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
              backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
              width: width * 0.9,
            }}>
            <View style={{marginTop: 4, width: width * 0.85}}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.name}
              </Text>
              {item.emailid ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="email"
                    size={14}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
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
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="home"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.address}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="store"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
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
            </View>
            <View
              style={{
                width: 50,
                marginRight: width * 0.08,
                position: 'absolute',
                right: 20,
                top: 0,
                height: 30,
                marginTop:height *0.005
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
    );
  };

  const Box = ({items}) => {
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
              backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
              width: width * 0.9,
            }}>
            <View style={{marginTop: 4, width: width * 0.85}}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Medium',
                }}>
                {items.name}
              </Text>
              {items.emailid ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCI
                    name="email"
                    size={14}
                    style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 10,
                      color: theme == 'light' ? '#000' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {items.emailid}
                  </Text>
                </View>
              ) : null}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="call"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {items.mobileno}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="home"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {items.address}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="location-pin"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
                />
                <Text
                  numberOfLines={4}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {JSON.parse(items.servicearea).join(', ')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: 50,
                marginRight: width * 0.08,
                position: 'absolute',
                right: 20,
                top: 0,
              }}>
              <Tag
                bgColor={items.status == '1' ? COLORS.green : 'red'}
                tagText={items.status == '1' ? 'Active' : 'Inactive'}
              />
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
      fetchEmployees();
      fetchServiceman();
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
            onChangeText={txt => {
              handleFilter(txt);
              handleFilters(txt);
            }}
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
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-SemiBold',
                      paddingLeft: width*0.05,
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.TEAM}
                  </Text>
                  <FlatList
                    data={employees}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Attendance Detail', {
                            id: item.employee_id,
                          })
                        }>
                        <Boxes item={item} />
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-SemiBold',
                      textAlign: 'left',
                      paddingLeft: width*0.05,
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.SERVICE_MAN}
                  </Text>
                  <View style={{marginBottom: height * 0.24}}>
                  <FlatList
                    data={serviceman}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Attendance Serviceman', {
                            id: item.serviceman_id,
                          })
                        }>
                        <Box items={item} />
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                  />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
