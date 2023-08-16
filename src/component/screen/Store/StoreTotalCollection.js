/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Dimensions,
    Text,
    FlatList,
    ScrollView,
    Image,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Appearance,
  } from 'react-native';
  import {getData, postData, putData} from '../../Connection/FetchServices';
  const {width, height} = Dimensions.get('window');
  import React, {useState, useEffect, useRef} from 'react';
  import {TouchableOpacity} from 'react-native';
  import {useFocusEffect, useIsFocused} from '@react-navigation/native';
  import MCI from 'react-native-vector-icons/FontAwesome';
  import COLORS from '../../helper/Colors';
  import {getStoreData} from '../../storage/AsyncStorage';
  import RBSheet from 'react-native-raw-bottom-sheet';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import EntypoIcon from 'react-native-vector-icons/Entypo';
  import moment from 'moment';
  import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
  import strings from '../../../changeLanguage/LocalizedString';
  
  export default function StoreTotalCollection({navigation, route}) {
    const refRBSheet = useRef();
    const isFocused = useIsFocused();
  
    const handleDone = () => {
      refRBSheet.current.close();
      fetchTotalCollection();
    };
  
    const handleCross = () => {
      refRBSheet.current.close();
    };
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showFilterDate, setShowFilterDate] = useState(false);
    const [services, setServices] = useState([]);
    const [theme, setTheme] = useState(Appearance.getColorScheme());

    Appearance.addChangeListener(scheme => {
      setTheme(scheme.colorScheme);
    });
  const [completeservice,setCompleteService]=useState([])
 
    const Item = ({item}) => (
      <>
        <View
          style={{
            marginTop: height * 0.03,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            alignSelf: 'center',
            width: '95%',
          }}>
          <View style={{width: '25%'}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                textAlign:'left'
              }}>
              {moment(item.updated_at).format("hh:mm A")}
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                textAlign:'center'
              }}>
              {item.customername}
            </Text>
          </View>
          <View style={{width: '20%'}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
                textAlign:'right',
              }}>
              &#x20b9;{item.amount}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            opacity: 1,
            width: '90%',
            alignSelf: 'center',
            borderBottomColor: '#d0d0d0',
          }}
        />
      </>
    );
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const showDatePicker2 = () => {
      setDatePickerVisibility2(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const hideDatePicker2 = () => {
      setDatePickerVisibility2(false);
    };
  
    function onDateSelected(event, value) {
      hideDatePicker();
      if (event.type == 'set') {
        setStartDate(value);
      }
    }
  
    function onDateSelected2(event, value) {
      hideDatePicker2();
      if (event.type == 'set') {
        setEndDate(value);
      }
    }
  
    const fetchTotalCollection = async (item = '') => {
      var condition = [],
        str = '';
       
    const store = await getStoreData('STORE');
    
      var dateObj = new Date();
      if (item == 'Today') {
        condition.push('startdate=' + moment(dateObj).format());
        condition.push('enddate=' + moment(dateObj).format());
      }
      if (item == 'Yesterday') {
        dateObj.setDate(dateObj.getDate() - 1);
        condition.push('startdate=' + moment(dateObj).format());
        condition.push('enddate=' + moment(dateObj).format());
      }
      if (startDate) {
        condition.push('startdate=' + moment(startDate).format());
      }
      if (endDate) {
        condition.push('enddate=' + moment(endDate).format());
      }
      condition.push('storeid=' + store.store_id);
      if (condition.length > 0) {
        str = '?' + condition.join('&');
      }
    
      var result = await getData(
        'report/todayallcollection'+ str
      );
      if (result.status) {
        
          setServices(result.data);
          
       
    };
}
  
   
    const FilterDates = ({item}) => {
      return (
        <TouchableOpacity
        style={{
          width: width * 0.22,
          backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
          borderRadius: 8,
          borderColor: '#d0d0d0',
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          height: height * 0.045,
          marginLeft: width * 0.02,
          marginTop: height * 0.01,
          elevation: 1.5,
        }}
        onPress={() => {
          if (item.name != 'Custom') {
            fetchTotalCollection(item.name);
          } else {
            refRBSheet.current.open();
          }
        }}>
        <Text
          style={{
            color: theme == 'light' ? '#000' : 'white',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.key}
        </Text>
      </TouchableOpacity>
      );
    };
    useEffect(() => {
      fetchTotalCollection('Today');
      selectedLng();
    }, [isFocused]);
    
    return (
      <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? 'white' : 'black',
      }}>
      <ScrollView>
        <View style={{flex: 1}}>
          <View style={{flex: 1, alignSelf: 'flex-start'}}>
            <FlatList
              data={[
                {key: strings.TODAY, name: 'Today'},
                {key: strings.YESTERDAY, name: 'Yesterday'},
                {key: strings.CUSTOM, name: 'Custom'},
              ]}
              renderItem={({item}) => <FilterDates item={item} />}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
          <View
          style={{
            backgroundColor: theme == 'light' ? COLORS.inputColor : 'black',
            margin: 10,
          }}>
         
        </View>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            margin: 10,
            padding: 10,
            borderColor: '#d0d0d0',
          }}>
          <View
            style={{
              backgroundColor: theme == 'light' ? 'white' : 'black',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: theme == 'light' ? COLORS.btnColor : '#fff',
              }}>
              Collection Summary
            </Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? 'green' : '#fff',
              }}>
              {strings.TOTAL}
              </Text>
              <View style={{marginLeft:3}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? 'green' : '#fff',
                }}>
                : {services?.total || '---'}
              </Text>
              </View>
              </View>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 15}}>
            <View style={{width: width * 0.5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.CASH}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                &#x20b9;{services?.cash || '--'}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.5,
                borderLeftColor: '#d0d0d0',
                borderLeftWidth: 1,
                paddingLeft: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                {strings.UPI}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                &#x20b9;{services?.upi || '--'}
              </Text>
            </View>
          </View>


          <View style={{flexDirection: 'row', paddingTop: 15}}>
            <View style={{width: width * 0.5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                {strings.CHEQUE}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                }}>
                &#x20b9;{services?.chequeamount || '--'}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.5,
                borderLeftColor: '#d0d0d0',
                borderLeftWidth: 1,
                paddingLeft: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                {strings.FINANCE}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: theme == 'light' ? COLORS.primary : '#fff',
                }}>
                &#x20b9;{services?.financeamount || '--'}
              </Text>
            </View>
          </View>
        </View>
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
                padding: 12,
              }}>
              <TouchableOpacity onPress={handleCross}>
                <EntypoIcon name="cross" size={20} color="red" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                }}>
                {strings.SET_FILTERS}
              </Text>
              <TouchableOpacity onPress={handleDone}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Medium',
                    color: 'black',
                  }}>
                  {strings.DONE}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{borderWidth: 0.5, borderColor: '#dcdcdc'}} />
  
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                  padding: 8,
                }}>
                {strings.SORT_BY_DATE_RANGE}
              </Text>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  paddingLeft: 3,
                  paddingRight: 3,
                  width: '99%',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#e7e7e7',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: '#000'}}>
                    {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                  </Text>
                  <MCI name="calendar" size={16} color="#6a5acd" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#e7e7e7',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker2()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: '#000'}}>
                    {moment(endDate || new Date()).format('DD-MMMM-YYYY')}
                  </Text>
                  <MCI name="calendar" size={16} color="#6a5acd" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>
        {isDatePickerVisible && (
          <DateTimePicker
            value={startDate || new Date()}
            mode={'date'}
            display={'default'}
            maximumDate={new Date()}
            is24Hour={true}
            onChange={onDateSelected}
            textColor="black"
          />
        )}
        {isDatePickerVisible2 && (
          <DateTimePicker
            value={endDate || new Date()}
            maximumDate={new Date()}
            mode={'date'}
            display={'default'}
            is24Hour={true}
            onChange={onDateSelected2}
          />
        )}
      </ScrollView>
    </ImageBackground>
     
    );
  }
  