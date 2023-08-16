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
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import MCI from 'react-native-vector-icons/MaterialIcons';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import FA from 'react-native-vector-icons/FontAwesome';

import Entypo from 'react-native-vector-icons/Entypo';
import COLORS from '../../helper/Colors';
import Tag from '../../uicomponents/Tag';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {getStoreData, removeStoreData} from '../../storage/AsyncStorage';
import AppButtons from '../../uicomponents/AppButtons';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

import Icons from 'react-native-vector-icons/MaterialIcons';
import Inputs from '../../uicomponents/Inputs';
import Input from '../../uicomponents/Input';
const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const Box = ({
  items,
  handleButton,
  handleValues,
  handleErrors,
  theme,
  error,
  inputs,
}) => {
  return (
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
          width: width * 0.99,
        }}>
        <View style={{marginTop: 5, marginLeft: 15, width: width * 0.85}}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              fontSize: 14,
              color: theme == 'light' ? '#000' : 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            {items.from_serviceman_name
              ? items.from_serviceman_name
              : items.from_employee_name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icons
              name="category"
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
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              {items.category_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo
              name="price-tag"
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
              {items.brand_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="cubes"
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
              {items.model_name} - {items.model_no} - {items.color}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MCI
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
              {items.fromstore ? items.fromstore : 'By Serviceman'}
            </Text>
          </View>
          {items.quantity ? (
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
                {items.quantity}
              </Text>
            </View>
          ) : null}
          {items.comment ? (
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
                {items.comment}
              </Text>
            </View>
          ) : null}
          {items.added_by ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MI
                name="account-edit"
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
                {items.added_by}
              </Text>
            </View>
          ) : null}
          {items.status == 'Received' ? null : (
            <View
              style={{
                justifyContent: 'center',
                paddingLeft: 15,
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
            </View>
          )}
          {items.status == 'Raised' && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppButtons
                buttonText={strings.ACCEPT}
                entypo="check"
                color="red"
                size={16}
                bgColor={'green'}
                onPress={() => handleButton(items.demand_id, 'Accepted')}
              />
              <AppButtons
                buttonText={strings.REJECT}
                bgColor="red"
                entypo="cross"
                color="red"
                size={16}
                onPress={() => handleButton(items.demand_id, 'Rejected')}
              />
            </View>
          )}

          {items.status == 'Accepted' && (
            <>
              <View style={{justifyContent: 'flex-start'}}>
                <AppButtons
                  buttonText={'Ready For Delivery'}
                  onPress={() =>
                    handleButton(items.demand_id, 'Ready For Delivery')
                  }
                />
              </View>
            </>
          )}
          {items.status == 'Ready For Delivery' && (
            <>
              <View style={{justifyContent: 'flex-end'}}>
                <AppButtons
                  buttonText={'Out For Delivery'}
                  onPress={() =>
                    handleButton(items.demand_id, 'Out For Delivery')
                  }
                />
              </View>
            </>
          )}
        </View>

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
              marginTop: height * 0.0035,
              marginRight: 100,
            }}>
            <Tag
              bgColor={items.status == 'Rejected' ? '#FFFF' : COLORS.green}
              txtColor={items.status == 'Rejected' ? 'red' : '#03753C'}
              tagText={items.status}
              tagWidth={120}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const Boxes = ({
  item,
  handleReceivedDemand,
  handleValues,
  handleErrors,
  theme,
  error,
  inputs,
}) => {
  return (
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
          width: width * 0.99,
        }}>
        <View style={{marginTop: 5, marginLeft: 15, width: width * 0.85}}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              fontSize: 14,
              color: theme == 'light' ? '#000' : 'white',
              fontFamily: 'Poppins-SemiBold',
            }}>
            {item.from_employee_name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icons
              name="category"
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
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              {item.category_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo
              name="price-tag"
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
              {item.brand_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="cubes"
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
              {item.model_name} - {item.model_no} - {item.color}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MCI
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
              {item.fromstore}
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
                {item.added_by}
              </Text>
            </View>
          ) : null}
          {item.status == 'Received' ? null : (
            <View
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
            </View>
          )}
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
                    item.quantity,
                    item.tostoreid,
                  )
                }
              />
            </View>
          )}
        </View>
        {item.status == 'Raised' && (
          <TouchableOpacity
            onPress={() => handleCancelDemand(item.demand_id)}
            style={{
              backgroundColor: 'white',
              width: 30,
              height: 30,
              borderRadius: 50,
              position: 'absolute',
              right: 10,
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
            right: 100,
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
              marginTop: height * 0.0035,
            }}>
            <Tag
              bgColor={
                item.status == 'Cancel' || item.status == 'Rejected'
                  ? '#ffff'
                  : COLORS.green
              }
              txtColor={
                item.status == 'Rejected' || item.status == 'Cancel'
                  ? 'red'
                  : '#03753C'
              }
              tagText={item.status}
              tagWidth={120}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default function SentDemand({navigation}) {
  const [loader, setLoader] = useState(true);
  const [demandsentemployee, setDemandSentEmployee] = useState([]);
  const [demandrecieveemployee, setDemandRecieveEmployee] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState([]);
  const [error, setError] = useState({});

  const isFocused = useIsFocused();
  const [employee, setEmployee] = useState('');

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [inputs, setInputs] = useState({
    comment: '',
  });
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchSentDemand = async () => {
    setLoader(true);
    var emp = await getStoreData('EMPLOYEE');
    var result = await getData('demand/demandsent/' + emp.store_id);
    console.log('=============>', result);
    if (result.status) {
      setDemandSentEmployee(result.data);
      setEmployeeFilter(result.data);
    }
    setLoader(false);
  };
  const fetchReceivedDemand = async () => {
    setLoader(true);
    var emp = await getStoreData('EMPLOYEE');
    var result = await getData('demand/demandreceived/' + emp.store_id);
    if (result.status) {
      setDemandRecieveEmployee(result.data);
    }
    setLoader(false);
    console.log(result);
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (error, attr) => {
    setError(prevStates => ({...prevStates, [attr]: error}));
  };

  useEffect(
    function () {
      fetchReceivedDemand();
      fetchSentDemand();
      selectedLng();
    },
    [navigation, isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchSentDemand();
      fetchReceivedDemand();
    }, [navigation]),
  );

  const handleCancelDemand = async item => {
    const body = {
      status: 'Cancel',
    };
    const result = await putData('demand/' + item, body);
    if (result.status) {
      fetchSentDemand();
    }
  };
  const handleReceivedDemand = async (item, pid, fsid, fsmid, qty, tsid) => {
    var emp = await getStoreData('EMPLOYEE');
    var ser = await getStoreData('SERVICEMAN');
    const body = {
      status: 'Received',
      productid: pid,
      fromstoreid: fsid,
      fromservicemanid: fsmid,
      demand_id: item,
      quantity: qty,
      tostoreid: tsid,
      added_by: emp.name ?? ser.name,
      ...(inputs.comment && {comment: inputs.comment}),
    };
    
    const result = await postData('demand/received', body);
    if (result.status) {
      fetchSentDemand();
    }
  };
  const handleButton = async (items, status) => {
    const emp = await getStoreData('EMPLOYEE');

    let body = {
      status: status,
      toemployeeid: emp.employee_id,
      ...(inputs.comment && {comment: inputs.comment}),
    };
    
    const result = await putData('demand/' + items, body);

    if (result.status) {
      fetchReceivedDemand();
    }
  };


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchSentDemand();
      fetchReceivedDemand();
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{width: width, marginTop: 10}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'left',
                  paddingLeft: 20,
                  paddingTop: 10,
                  color: theme == 'light' ? '#000' : 'white',
                }}>
                {strings.DEMAND_SENT}
              </Text>
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
                <View style={{marginBottom: height * 0.15}}>
                  <FlatList
                    data={demandsentemployee}
                    renderItem={({item}) => (
                      <Boxes
                        item={item}
                        handleReceivedDemand={handleReceivedDemand}
                        handleValues={handleValues}
                        handleErrors={handleErrors}
                        theme={theme}
                        error={error}
                        inputs={inputs}
                      />
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
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'left',
                  color: theme == 'light' ? '#000' : 'white',
                  paddingTop: 10,
                  paddingLeft: 20,
                }}>
                {strings.DEMAND_Received}
              </Text>

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
              ) : demandrecieveemployee.length != 0 ? (
                <View style={{marginBottom: height * 0.15}}>
                  <FlatList
                    data={demandrecieveemployee}
                    renderItem={({item}) => (
                      <Box
                        items={item}
                        handleButton={handleButton}
                        handleValues={handleValues}
                        handleErrors={handleErrors}
                        theme={theme}
                        error={error}
                        inputs={inputs}
                      />
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
      </View>
    </ImageBackground>
  );
}
