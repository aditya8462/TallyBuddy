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
  Appearance,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import {getData, postData, putData, ServerURL} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
const {height, width} = Dimensions.get('window');
import {useState, useEffect,useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getStoreData} from '../../storage/AsyncStorage';
import FA from 'react-native-vector-icons/FontAwesome';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AppButton from '../../uicomponents/AppButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import SweetAlert from 'react-native-sweet-alert';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function TodayDelivery({navigation}) {
    const refRBSheet = useRef();
    const refRBSheet2 = useRef();

    const [theme, setTheme] = useState(Appearance.getColorScheme());

    Appearance.addChangeListener(scheme => {
      setTheme(scheme.colorScheme);
    });

    const [inputs, setInputs] = useState({
        name: '',
        mobileno: '',
        vehicleno:'',
        amount:0,
        
      });
      const [error, setError] = useState({});
  const [hideButton, setHideButton] = useState(false)

      const validate = () => {
        var isValid = true;
        if (!inputs.name) {
          handleErrors('Please Input name', 'name');
          console.log(1);
          isValid = false;
        }
        if (!inputs.mobileno) {
          handleErrors('Please Input mobileno', 'mobileno');
          isValid = false;
          console.log(2);
        }
        if (!inputs.vehicleno) {
          handleErrors('Please Input vehicleno', 'vehicleno');
          isValid = false;
          console.log(4);
        }
        if (!inputs.amount) {
            handleErrors('Please Input amount', 'amount');
            isValid = false;
            console.log(4);
          }

       
        console.log(isValid);
        return isValid;
      };
      const handleValues = (txt, attr) => {
        setInputs(prevStates => ({...prevStates, [attr]: txt}));
      };
    
      const handleErrors = (txt, attr) => {
        setError(prevStates => ({...prevStates, [attr]: txt}));
      };
  const [loader, setLoader] = useState(true);
  const [storebill, setStoreBill] = useState([]);
  const [store, setStore] = useState('');
  const [selected, setSelected] = useState([])
const [driverstatus,setDriverStatus]=useState('')
  const isFocused = useIsFocused();

  const status = {
    0: 'Cancelled',
    1: 'Order Booked',
    2: 'Ready for Delivery',
    3: 'Out for delivery',
    4: 'Delivered',
  };
  

  const handleSubmit=async()=>{
    const asyncData = await getStoreData('EMPLOYEE');
  
    if(driverstatus=='new'){
      var body={name:inputs.name,mobile:inputs.mobileno,vehicleno:inputs.vehicleno,added_by:asyncData.name}
      var results=await postData('driver',body)
    }
    var body={billno:selected,drivername:inputs.name,drivermobile:inputs.mobileno,vehicleno:inputs.vehicleno,amount:inputs.amount}
    console.log("==================>",body);
    setHideButton(true)
    var result=await postData('bill/assigndelivery',body)
    if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.DETAILS_SUBMIT_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
        setSelected([])
       setInputs({
            name: '',
            mobileno: '',
            vehicleno:'',
            amount:0,
            
          });
        navigation.goBack();
        
      } else {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVER_ERROR,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
        });
      }
      setHideButton(false)
  }

  const handleCheckbox = (value) => {
    const index = selected.indexOf(value);
    if (index > -1) {
        var array = [...selected]
        array.splice(index, 1);
        setSelected(array)
    } else {
        setSelected(prev => ([...prev, value]))
    }
}

  
  useEffect(
    function () {
      fetchDetail('Today');
      selectedLng();
    },
    [isFocused],
  );
  useFocusEffect(
    React.useCallback(() => {
      
      fetchDetail('Today')
    }, []),
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchDetail('Today');
      setRefreshing(false);
    }, 2000);
  }, []);
const handleDone = () => {
    refRBSheet2.current.close();
    fetchDetail();
  };

  const handleCross = () => {
    refRBSheet2.current.close();
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
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





const fetchDetail = async (item = '') => {
    var condition = [],
      str = '';
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
    if (condition.length > 0) {
      str = '?' + condition.join('&');
    }

    var emp = await getStoreData('EMPLOYEE');
    var result = await getData('bill/readyfordelivery/' + emp.store_id + str);
    if (result.status) {
      setStoreBill(result.data);

    }
    setLoader(false)

  };
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
            fetchDetail(item.name);
          } else {
            refRBSheet2.current.open();
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
              width: width * 0.9,
            }}>
                <View style={{ backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',}}>
                <CheckBox
                value={selected.includes(item.bill_id)}
                onValueChange={() => handleCheckbox(item.bill_id)}
                color='red'
            />
                </View>
            <View style={{marginTop: 4, width: width * 0.85}}>
         
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 12,
                  color: theme == 'light' ? '#000' : 'white',
                  fontFamily: 'Poppins-Bold',
                }}>
                {item.cname}
              </Text>
              
           
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="call"
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
                  {item.cmobile}
                </Text>
              </View>
              {item.cemail?( <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="email"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.cemail}
                </Text>
              </View>):null}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="home"
                  size={14}
                  style={{color: theme == 'light' ? COLORS.btnColor : 'white',  padding: 1}}
                />
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.caddress}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FA
                  name="rupee"
                  size={14}
                  style={{
                    padding: 1,
                    marginLeft: 5,
                    color: theme == 'light' ? COLORS.btnColor : 'white', 
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
                  {item.total}.00
                </Text>
              </View>
            </View>
            {item.status > 0 ? (
              <View
                style={{
                  width: 50,
                  position: 'absolute',
                  right: 60,
                  top: -5,
                  marginRight:width*0.13
                }}>
                <View
                  style={{
                    height: 30,
                    marginTop:height *0.007,
                  }}>
                  <Tag
                    bgColor={item.status == '4' ? COLORS.green : 'orange'}
                    tagText={status[item.status]}
                    tagWidth={160}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: 50,
                  position: 'absolute',
                  right: 240,
                  top: -5,
                }}>
                <View
                  style={{
                    width: 450,
                    borderBottomEndRadius: 8,
                    borderBottomStartRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 30,
                  }}>
                  <Tag
                  bgColor={'#fff'}
                  tagText={'Cancelled'}
                  txtColor={'red'}
                  tagWidth={155}
              />
                </View>
              </View>
            )}
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
            marginHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 5,
            borderWidth: 0.7,
            borderColor: '#f2f2f2',
            paddingBottom: 3,
            paddingRight: 2,
            backgroundColor: '#f5f6fa',
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
              backgroundColor: '#fff',
            }}>
            <View style={{marginTop: 4, width: width * 0.85}}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 14,
                  color: '#2C2C2C',
                  fontFamily: 'Poppins-Medium',
                }}>
                {items.employee_name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="email"
                  size={14}
                  style={{color: COLORS.primary, padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 12,
                    color: '#2C2C2C',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {items.category_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="price-tag"
                  size={14}
                  style={{color: COLORS.primary, padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: '#2C2C2C',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {items.brand_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="cubes"
                  size={14}
                  style={{color: COLORS.primary, padding: 1}}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: '#2C2C2C',
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {items.model_name}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: 50,
                marginRight: 5,
                position: 'absolute',
                right: 20,
                top: 0,
                marginTop:height *0.0035
              }}>
              <Tag
                bgColor={item.status == '1' ? COLORS.green : '#fff'}
                txtColor={item.status == '1' ? '#03753C': 'red' }
                tagText={items.status == '1' ? 'Active' : 'Inactive'}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  const SearchCustomer = async mob => {
    setLoader(true);
    var result = await postData('driver/searchbymobile?mobile=' + mob);
    if (result.status) {
      handleValues(result.data.name, 'name');
      handleValues(result.data.mobile, 'mobileno');
      handleValues(result.data.vehicleno, 'vehicleno');
      setDriverStatus('')
    } else {
      SweetAlert.showAlertWithOptions({
        title: result.message,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
      setDriverStatus('new')
    }
    setLoader(false);
  };
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
       <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
        <View style={{alignItems: 'center'}}>
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
            ) : storebill.length !=0?(
              <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={storebill}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('BillView', {
                          bill_id: item.bill_id,
                        })
                      }>
                      <Boxes item={item} />
                    </TouchableOpacity>
                  )}
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
        </View>
      </ScrollView>
      {selected.length > 0 && (<TouchableOpacity  style={{
            width: '100%',
            height: 50,
            backgroundColor: COLORS.btnColor,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0
        }}  onPress={() => refRBSheet.current.open()}>

            <Text style={{
                color: '#fff',
                fontSize: 22
            }}>Delivery</Text>

        </TouchableOpacity>)}
        <RBSheet
        ref={refRBSheet}
        height={350}
        openDuration={250}
        closeDuration={80}
        customStyles={{
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: theme == 'light' ? 'white' : 'black',
          },
        }}>
        <View>
          <View style = {{  borderWidth: 0.5,
        borderColor:'#dcdcdc',
        }} />
          <View>
        
          <Input
              error={error.name}
              onFocus={() => handleErrors(null, 'name')}
              onChangeText={txt => handleValues(txt, 'name')}
              placeholderTextColor= {theme== 'light'? "black":'white'}
              placeholder={strings.NAME}
              autoCompleteType="off"
              simpleLineIcons="user"
              value={inputs.name}
            />
            <Input
              error={error.mobileno}
              onFocus={() => handleErrors(null, 'mobileno')}
              placeholderTextColor= {theme== 'light'? "black":'white'}
              placeholder={strings.MOBILE}
              maxLength={10}
              autoCompleteType="off"
              simpleLineIcons="phone"
              onChangeText={txt => {
                handleValues(txt, 'mobileno');
                if (txt.length == 10) SearchCustomer(txt);
              }}
              keyboardType="phone-pad"
              value={String(inputs.mobileno)}
            />
            <Input
              error={error.vehicleno}
              onFocus={() => handleErrors(null, 'vehicleno')}
              onChangeText={txt => handleValues(txt, 'vehicleno')}
              placeholder={strings.VEHICLENO}
              placeholderTextColor= {theme== 'light'? "black":'white'}
              autoCompleteType="off"
              materialCommunityIcons="truck-fast"
              value={inputs.vehicleno}
           
            />
            <Input
              error={error.amount}
              onFocus={() => handleErrors(null, 'amount')}
              onChangeText={txt => handleValues(txt, 'amount')}
              placeholder={strings.AMOUNT}
              placeholderTextColor= {theme== 'light'? "black":'white'}
              autoCompleteType="off"
              fontAwesome="rupee"
              keyboardType="phone-pad"
            />
          </View>
          <View style={{alignItems: 'center'}}>
          {hideButton?
              ( <AppButton
                buttonText={strings.SUBMIT}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleSubmit}
                buttonText={strings.SUBMIT}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
          </View>
          
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheet2}
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
              backgroundColor: theme == 'light' ? 'white' : 'black',
            }}>
            <TouchableOpacity onPress={handleCross}>
              <EntypoIcon name="cross" size={20} color="red" />
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
          <View style = {{  borderWidth: 0.5,
        borderColor:'#dcdcdc',
        }} />

          <View style={{backgroundColor: theme == 'light' ? 'white' : 'black',}}>
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
                  justifyContent:'space-between',
                  backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker()}>
                <Text label="Date" mode="outlined" editable={false} style={{color: theme == 'light' ? '#2C2C2C' : '#fff',}}>
                  {moment(startDate || new Date()).format('DD-MMMM-YYYY')}
                </Text>
                <FA name="calendar" size={16} color={COLORS.btnColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                 justifyContent:'space-between',
                 backgroundColor: theme == 'light' ? '#e7e7e7' : '#2C2C2C',
                  padding: 10,
                  width: '45%',
                  borderRadius: 6,
                }}
                onPress={() => showDatePicker2()}>
                 
                <Text label="Date" mode="outlined" editable={false} style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                  {moment(endDate || new Date()).format('DD-MMMM-YYYY')}
                </Text>
                <FA name="calendar" size={16} color={COLORS.btnColor} />
               
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

    </ImageBackground>
  );
}
