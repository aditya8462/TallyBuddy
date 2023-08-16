/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import ENT from 'react-native-vector-icons/Entypo';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import MCI from 'react-native-vector-icons/FontAwesome';
import M from 'react-native-vector-icons/MaterialIcons';

import DateTimePicker from '@react-native-community/datetimepicker';

import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../../uicomponents/SearchInput';
import {useIsFocused} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import FastImage from 'react-native-fast-image';
import NextButton from '../../uicomponents/NextButton';
import Tag from '../../uicomponents/Tag';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import { getStoreData } from '../../storage/AsyncStorage';



const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const {height, width} = Dimensions.get('screen');

export default function StockDetailsByStore({navigation})  {
  const isFocused = useIsFocused();
  const refRBSheet = useRef();

  const [bills, setBills] = useState([]);
  const [loader, setLoader] = useState(true);
  const [productsFilter, setProductsFilter] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [footerLoader, setFooterLoader] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
const [billsFilter,setBillsFilter]=useState({})
  const [page, setPage] = useState({
    currentPage: 1,
    previousPage: 0,
    nextPage: 2,
  });
  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
//    const fetchBills = async p => {
//      setLoader(true);

//      const handleDone = () => {
//        refRBSheet.current.close();
//      };
   
//      const handleCancel = () => {
//        refRBSheet.current.close();
//      };


//      var result = await getData(
//        'product?page=' +
//          (p == 'previous'
//            ? page.previousPage
//            : p == 'next'
//            ? page.nextPage
//            : page.currentPage),
//      );
//      if (result.status) {
//        if(result.data.length > 0){
//        setPage({
//          currentPage: result.currentPage,
//          previousPage: result.previousPage,
//          nextPage: result.nextPage,
//        });
//        setBills(result.data);
//       //  setProductsFilter(result.data);
//      }
//    }
//      setLoader(false);
//      setFooterLoader(false);
  
//  };
 const fetchBill = async () => {
    const store=await getStoreData('STORE')
   setLoader(true);
   var condition = [],
   str = '';
 if (startDate) {
   condition.push('startdate=' + new Date(startDate).toISOString());
 }
 if (endDate) {
   condition.push('enddate=' + new Date(endDate).toISOString());
 }
 if (startDate || endDate) {
   str = '?' + condition.join('&');
 }
   var result = await getData('stock/byStore/'+store.store_id+str);
// alert(JSON.stringify(result))
console.log("==========",result)
   if (result.status) {
     setBills(result.data.reverse());
     setBillsFilter(result.data)
   }
   setLoader(false);
   console.log(result)
 };
 const handleDone = () => {
          refRBSheet.current.close();
          fetchBill()
        };
     
        const handleCancel = () => {
         refRBSheet.current.close();
        };
  
  useEffect(
    function () {
      fetchBill('Today');
      selectedLng();
    },
    [],
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

  const handleFilter = txt => {
    setFilterInput(txt);
    const data = billsFilter.filter(
      item =>
       item.billno?.toLowerCase().includes(txt.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.brand_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.model_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.vendor_name?.toLowerCase().includes(txt.toLowerCase()) ||
        item.color?.toLowerCase().includes(txt.toLowerCase()),
    );
    console.log(data);
    setBills(data);
  };

  const Boxes = ({item}) => (
    <View style={{alignItems: 'center'}}>
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
        marginLeft:10,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 5,
        borderWidth: 0.7,
        borderColor: '#f2f2f2',
        paddingBottom: 3,
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
            {item.billno}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <M
              name="supervised-user-circle"
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
              {item.vendor_name}
            </Text>
          </View>
           <View style={{flexDirection: 'row', alignItems: 'center',paddingLeft:2}}>
            <MCI
              name="rupee"
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
              {item.totalamount}
            </Text>
          </View>
         
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="date-range"
              size={14}
              style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 0.5}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: theme == 'light' ? '#000' : 'white',
                fontSize: 10,
                fontFamily: 'Poppins-Medium',
              }}>
              
              {moment(item.created_at).format('DD-MMM-yyyy') }
            </Text>
          </View>
            
        </View>
        <View style={{marginTop: height*0.026, width: width * 0.31}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MI
              name="account-edit"
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
              {item.added_by}
            </Text>
          </View>     
        </View>
       
      </View>
    </View>
  </View>
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchBill();
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
              ) : bills.length != 0 ? (
                <View style={{marginBottom: height * 0.1}}>
                  <FlatList
                    data={bills}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Stock Details', {
                            id: item.billno,
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
        <RBSheet
          ref={refRBSheet}
          height={127}
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
                backgroundColor: theme == 'light' ? 'white' : 'black',
              }}>
              <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                <ENT name="cross" size={20} color="red" />
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
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
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
                    backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                    {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                  </Text>
                  <MCI name="calendar" size={16} color="#6a5acd" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                    padding: 10,
                    width: '45%',
                    borderRadius: 6,
                  }}
                  onPress={() => showDatePicker2()}>
                  <Text
                    label="Date"
                    mode="outlined"
                    editable={false}
                    style={{color: theme == 'light' ? '#2C2C2C' : '#ffff'}}>
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
      </View>
    </ImageBackground>
  );
}
