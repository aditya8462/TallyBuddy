/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  View,
  Dimensions,
  Image,
  Text,
  FlatList,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Appearance,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {getData, ServerURL} from '../../Connection/FetchServices';
const {width, height} = Dimensions.get('window');
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Entypo';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../uicomponents/Input';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {RefreshControl} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function EmployeeAvailable({navigation}) {
  const [employees, setEmployees] = useState([]);
  const [loader, setLoader] = useState(true);
  const refRBSheet = useRef();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);
  const [employeeFilter, setEmployeeFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [store, setStore] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [inputs, setInputs] = useState({
    store_id: '',
  });
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchActiveStore = async store_id => {
    const result = await getData('store/display/active', {store_id: store_id});
    setStore(result.data);
  };

  const DateDiff = (time1, time2) => {
    var Startday = new Date(time1).getTime();
    var Endday = new Date(time2).getTime();
    var diff = Endday - Startday;
    const differenceInMinutes = diff / 1000 / 60;
    let hours = Math.floor(differenceInMinutes / 60);
    if (hours < 0) {
      hours = 24 + hours;
    }
    let minutes = Math.floor(differenceInMinutes % 60);
    if (minutes < 0) {
      minutes = 60 + minutes;
    }
    const hoursAndMinutes = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    return hoursAndMinutes;
  };

  const handleDone = () => {
    refRBSheet.current.close();
    fetchDetail();
  };

  const handleCross = () => {
    refRBSheet.current.close();
  };

  const fetchDetail = async () => {
    var condition = [],
      str = '';
    if (date) {
      condition.push('date=' + new Date(date).toISOString());
    }
    if (storelist) {
      condition.push('storeid=' + storelist);
    }
    if (date || inputs.store_id) {
      str = '?' + condition.join('&');
    }
    
    
    var result = await getData('employeeLoginDetail' + str);

    if (result.status) {
      setEmployees(result.data);
    }
  };

  const fetchEmployees = async () => {
    setLoader(true);
    var result = await getData('employeeLoginDetail');

    if (result.status) {
      setEmployees(result.data);
      setEmployeeFilter(result.data);
    }
    setLoader(false);
    console.log(result);

    console.log(setEmployees);
  };

  useEffect(
    function () {
      fetchEmployees();
      fetchDetail();
      fetchActiveStore();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
      fetchDetail();
      fetchActiveStore();
    }, []),
  );

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  function onDateSelected(event, value) {
    hideDatePicker();
    if (event.type == 'set') {
      setDate(value);
    }
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = employeeFilter.filter(
      item =>
        item.smname?.toLowerCase().includes(txt.toLowerCase()) ||
        item.ename?.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setEmployees(data);
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };
  const [storelist, setStoreList] = useState('');
  const handleStore = itemValue => {
    setStoreList(itemValue);
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
            <View style={{marginTop: 4, marginLeft: 10, width: width * 0.83}}>
              {item.serviceman_id ? (
                <>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: theme == 'light' ? '#000' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {item.smname}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: theme == 'light' ? '#000' : 'white',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {/* {item.ename} */}
                    {item.ename}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MC
                      name="store"
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
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {item.sname}
                    </Text>
                  </View>
                </>
              )}

              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                {item.checkout_date ? (
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MC
                        name="login"
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
                        {moment(item.checkin_date).format('hh:mm A')}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MC
                        name="logout"
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
                          fontSize: 12,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {moment(item.checkout_date).format('hh:mm A')}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MC
                        name="account-clock"
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
                          fontSize: 12,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {item.checkout_date
                          ? DateDiff(item.checkin_date, item.checkout_date)
                          : '--'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MC
                      name="login"
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
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {moment(item.checkin_date).format('hh:mm A')}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View
              style={{
                width: 50,
                marginRight: width * 0.08,
                position: 'absolute',
                right: 20,
                top: 0,
                marginTop:height *0.005
              }}>
              <Tag
                bgColor={item.status == '1' ? '#fff' : COLORS.green}
                txtColor={item.status == '1' ? 'red': '#03753C' }
                tagText={item.current_status}
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
      fetchDetail();
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '95%',
              marginTop: height * 0.02,
            }}>
            <View
              style={{
                width: width * 0.88,
                borderColor: '#f2f2f2',
                borderRadius: 10,
                flexDirection: 'row',
                height: 50,
              }}>
              <SearchInput
                placeholder={strings.SEARCH}
                simpleLineIcons="magnifier"
                onChangeText={handleFilter}
                height={40}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <TouchableOpacity onPress={() => refRBSheet.current.open()}>
              <MCI
                name={'filter'}
                size={22}
                color={theme == 'light' ? '#000' : 'white'}
                style={{marginTop: 15}}
              />
            </TouchableOpacity>
          </View>
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
                    </View>
                  </View>
                </View>
              ) : employees.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                  <FlatList
                    data={employees}
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
        <RBSheet
          ref={refRBSheet}
          height={150}
          openDuration={250}
          closeDuration={80}
          customStyles={{
            container: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
          }}>
          <View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 16,
                backgroundColor: theme == 'light' ? 'white' : 'black',
              }}>
              <TouchableOpacity onPress={handleCross}>
                <Icon name="cross" size={20} color="red" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.SET_FILTERS}
              </Text>
              <TouchableOpacity onPress={handleDone}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.DONE}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />
            <View
              style={{backgroundColor: theme == 'light' ? 'white' : 'black'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    padding: 8,
                    paddingRight: 6,
                  }}>
                  {strings.SORT_BY_DATE_RANGE}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    padding: 8,
                    paddingLeft: width * 0.19,
                  }}>
                  {strings.SEARCH_BY_STORE}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => showDatePicker()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}>
                  <Text
                    label="Date"
                    mode="inlined"
                    editable={false}
                    style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                    {moment(date || new Date()).format('DD-MMM-YYYY')}
                  </Text>
                  <MCI name="calendar" color={COLORS.btnColor} size={14} />
                </TouchableOpacity>
                <View style={{alignSelf:'center'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      width: width * 0.87,
                      height:height*0.02,
                      marginLeft: 5,
                    }}>
                    <Picker
                      selectedValue={storelist}
                      style={{
                        height: 50,
                        width: '60%',
                        backgroundColor:
                          theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      }}
                      onValueChange={itemValue => {
                        handleStore(itemValue);
                      }}>
                      <Picker.Item label={'-Select Store-'} value={''} />
                      {store.map(itm => {
                        return (
                          <Picker.Item label={itm.name} value={itm.store_id} />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </RBSheet>
        {isDatePickerVisible && (
          <DateTimePicker
            maximumDate={new Date()}
            value={date || new Date()}
            mode={'date'}
            display={'default'}
            is24Hour={true}
            onChange={onDateSelected}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    width: width * 0.46,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: '#e7e7e7',
    fontFamily: 'Poppins-Medium',
    paddingLeft: 8,
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
