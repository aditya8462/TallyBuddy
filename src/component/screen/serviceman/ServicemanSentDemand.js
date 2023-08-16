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
import {
  getData,
  postData,
  putData,
  ServerURL,
} from '../../Connection/FetchServices';
import FA from 'react-native-vector-icons/FontAwesome';

import Input from '../../uicomponents/Input';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getStoreData, removeStoreData} from '../../storage/AsyncStorage';
import AppButtons from '../../uicomponents/AppButtons';
import AppButton from '../../uicomponents/AppButton';
import SearchInput from '../../uicomponents/SearchInput';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const Boxes = ({item,handleReceivedDemand,handleValues,handleErrors,theme,error,inputs}) => {
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
            width: width * 0.93,
          }}>
        <View style={{marginTop: 5, marginLeft: 15, width: width * 0.85}}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              fontSize: 12,
              color: theme == 'light' ? '#2C2C2C' : 'white',
              fontFamily: 'Poppins-Medium',
            }}>
            {item.from_serviceman_name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MCI
              name="category"
              size={14}
              style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: theme == 'light' ? '#2C2C2C' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              {item.category_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo
              name="price-tag"
              size={14}
              style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: theme == 'light' ? '#2C2C2C' : 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
              }}>
              {item.brand_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="cubes"
              size={14}
              style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: theme == 'light' ? '#2C2C2C' : 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
              }}>
              {item.model_name} - {item.model_no} - {item.color}
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
                color: theme == 'light' ? '#2C2C2C' : 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
              }}>
              {item.tostore}
            </Text>
          </View>
          {item.quantity ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MI
                name="format-list-numbered"
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
                {item.quantity}
              </Text>
            </View>
          ) : null}
          {item.comment ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FA
                name="comment"
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
                {item.comment}
              </Text>
            </View>
          ) : null}
          {item.added_by ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MI
                name="account-edit"
                size={12}
                style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: theme == 'light' ? '#2C2C2C' : 'white',
                  fontSize: 10,
                  fontFamily: 'Poppins-Medium',
                }}>
                {item.added_by}
              </Text>
            </View>
          ) : null}
          {item.status == 'Out For Delivery' ? <View
              style={{
                justifyContent: 'center',
                paddingLeft: 10,
                marginTop: -15,
              }}>
              <Input
                error={error.comment}
                 onFocus={() => handleErrors(null, 'comment')}
                 onChangeText={txt => handleValues(txt, 'comment')}
                placeholder={strings.COMMENTS}
                height={40}
                octicons="comment"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View> : null}
          {item.status == 'Out For Delivery' && (
            <View>
              <AppButtons
                buttonText={'Received'}
                onPress={() =>
                  handleReceivedDemand(
                    item.demand_id,
                    item.productid,
                    item.fromstoreid,
                    item.fromservicemanid,
                    item.tostoreid,
                    item.quantity
                  )
                }
              />
            </View>
          )}
        </View>
        {/* <View style={{width: '30%',marginTop: 4}}>
          <View style={{flexDirection: 'row'}}>
            <MCI
              name="store"
              size={14}
              style={{color: theme == 'light' ? COLORS.btnColor : 'white', padding: 1}}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: theme == 'light' ? '#2C2C2C' : 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
              }}>
              {item.store_name}
            </Text>
          </View>
        </View> */}
        {item.status == 'Raised' && (
          <TouchableOpacity
            onPress={() => handleCancelDemand(item.demand_id)}
            style={{
              backgroundColor: 'white',
              width: 30,
              height: 30,
              borderRadius: 50,
              // margin: 10,
              position: 'absolute',
              right: 0,
              top: 0,
            }}>
            <Entypo
              name={'cross'}
              size={20}
              style={{alignSelf: 'center', marginTop: 5, color: '#2C2C2C'}}
            />
          </TouchableOpacity>
        )}
        <View
          style={{
            width: 50,
            position: 'absolute',
            right: 80,
            top: -5,
          }}>
          <View
            style={{
              width: 100,
              borderBottomEndRadius: 8,
              borderBottomStartRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              marginTop:height *0.0055

              // backgroundColor:'red'
            }}>
            <Tag
              bgColor={
                item.status == 'Cancel' || item.status == 'Rejected'
                  ? '#ffff'
                  : COLORS.green
              }
              // tagText={'Active'}
             
              txtColor={item.status == 'Rejected' || item.status=='Cancel' ? 'red':'#03753C'}
              tagText={item.status}
            />
          </View>
        </View>
      </View>
    </View>
    </View>
  );
};

export default function ServicemanSentDemand({navigation}) {
  const [loader, setLoader] = useState(true);
  const [demandsentemployee, setDemandSentEmployee] = useState([]);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [inputs, setInputs] = useState({
    comment: '',
  });
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchSentDemand = async () => {
    setLoader(true);
    var asyncData = await getStoreData('SERVICEMAN');
    var result = await getData(
      'demand/demandsent_serviceman/' + asyncData.serviceman_id,
    );
    console.log('=============>', result);
    if (result.status) {
      setDemandSentEmployee(result.data);
    }
    setLoader(false);
    console.log(result);
  };

  useEffect(
    function () {
      fetchSentDemand();
      selectedLng();
    },
    [navigation, isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchSentDemand();
    }, [navigation]),
  );

  //   const handleFilter = txt => {
  //     setFilterInput(txt);
  //     const data = attendanceFilter.filter(
  //       item =>
  //         item.name.toLowerCase().includes(txt.toLowerCase()) ||
  //         item.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
  //         item.emailid.toLowerCase().includes(txt.toLowerCase()) ||
  //         item.address.toLowerCase().includes(txt.toLowerCase()),
  //     );
  //     console.log(data);
  //     setEmployees(data);
  //   };
  //   const handleFilters = txt => {
  //     setFilterInput(txt);
  //     const data = attendancesFilter.filter(
  //       items =>
  //         items.name.toLowerCase().includes(txt.toLowerCase()) ||
  //         items.mobileno.toLowerCase().includes(txt.toLowerCase()) ||
  //         items.emailid.toLowerCase().includes(txt.toLowerCase()) ||
  //         items.servicearea.toLowerCase().includes(txt.toLowerCase()),
  //     );
  //     console.log(data);
  //     setServiceMan(data);
  //   };
  const handleCancelDemand = async item => {
    const body = {
      status: 'Cancel',
    };
    const result = await putData('demand/' + item, body);
    if (result.status) {
      fetchSentDemand();
    }
  };
  const handleReceivedDemand = async (item, pid, fsid, fsmid,tsid,qty) => {
    var ser = await getStoreData('SERVICEMAN');
    const body = {
      status: 'Received',
      productid: pid,
      tostoreid:tsid,
      fromservicemanid: fsmid,
      demand_id: item,
      added_by: ser.name,
      quantity:qty,
      ...(inputs.comment &&{comment:inputs.comment})
    };
    // alert(JSON.stringify(body))
    const result = await postData('demand/received', body);
    if (result.status) {
      fetchSentDemand();
    }
  };

  

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchSentDemand();
      setRefreshing(false);
    }, 2000);
  }, []);
  const [error, setError] = useState({});
  
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (error, attr) => {
    setError(prevStates => ({...prevStates, [attr]: error}));
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
              placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              //   onChangeText={txt => {
              //     handleFilter(txt);
              //     handleFilters(txt);
              //   }}
            />

            <View style={{width: width, marginTop: 10}}>
              <Text
                 style={{
                  fontSize: 16,
                  fontFamily:'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  paddingTop: 10,
                }}>
                {strings.DEMAND_SENT}
              </Text>
              <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
              ) : demandsentemployee.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                  <FlatList
                    data={demandsentemployee}
                    renderItem={({item}) => <Boxes item={item}  handleReceivedDemand={handleReceivedDemand} handleValues={handleValues} handleErrors={handleErrors} theme={theme} error={error} inputs={inputs}/>}
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
              </ScrollView>
              {/* <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'left',

                  color: '#000',
                  paddingTop: 10,
                  paddingLeft: 20,
                }}>
                {strings.DEMAND_Received}
              </Text> */}

              {/* {loader ? (
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
              ) : demandrecieveemployee.length != 0 ? (
                <>
                  <FlatList
                    data={demandrecieveemployee}
                    renderItem={({item}) => <Box items={item} />}
                    keyExtractor={item => item.id}
                  />
                </>
              ) : (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    // height: height * 0.7,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
              )} */}
            </View>
          </View>
        </View>
    </ImageBackground>
  );
}
