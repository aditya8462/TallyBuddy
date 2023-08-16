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
} from 'react-native';
import {getData} from '../../Connection/FetchServices';
import React, {useState, useEffect} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import COLORS from '../../helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {RefreshControl} from 'react-native';
import strings from '../../../changeLanguage/LocalizedString';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {Appearance} from 'react-native';
import Tag from '../../uicomponents/Tag';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const {width, height} = Dimensions.get('window');
export default function ActivityCard() {
  const [activity, setActivity] = useState([]);
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchActivity = async () => {
    setLoader(true);
    var result = await getData('report/activitylog');

    if (result.status) {
      setActivity(result.data.reverse());
    }
    setLoader(false);
    console.log(result);

    console.log(setActivity);
  };

  useEffect(
    function () {
      fetchActivity();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchActivity();
    }, []),
  );

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

  const Boxes = ({item, index}) => {
    return (
      <View
        style={{
          marginHorizontal: 4,
          borderRadius: 10,
          overflow: 'hidden',
          marginVertical: 5,
          borderWidth: 0.4,
          borderColor: '#f2f2f2',
          flexDirection: 'row',
          backgroundColor: theme == 'light' ? COLORS.cardcolor : '#2C2C2C',
          width: width * 0.98,
          marginTop: 20,
        }}>
        <View
          style={{
            width: width * 0.035,
            backgroundColor: theme == 'light' ? COLORS.btnColor : '#2C2C2C',
            borderBottomEndRadius: 2,
            borderTopEndRadius: 2,
          }}
        />
        <View
          style={{
            marginTop: 2,
            marginLeft: width * 0.022,
            width: width * 0.9,
            padding: 10,
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={{
              color: theme == 'light' ? '#000' : 'white',
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
            }}>
            Bill {item.bill_id} was cancelled
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              by {item.employee_name} at {item.store_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              for {item.cancellationreason}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 12,
                color: theme == 'light' ? '#000' : 'white',
                fontFamily: 'Poppins-Medium',
              }}>
              on {moment(item.updated_at).format('DD-MMM-YYYY hh:mm A')}
            </Text>
          </View>
        </View>
        {index == 0 ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}>
            <View
              style={{
                width: width * 0.2,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                height: height * 0.05,
              }}>
            <Tag
                  bgColor={'#fff'}
                  tagText={'Cancelled'}
                  txtColor={'red'}
                  tagWidth={155}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchActivity();
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
                        height: 80,
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
                    </View>
                  </View>
                </View>
              ) : activity.length != 0 ? (
                <View style={{marginBottom: height * 0.24}}>
                <FlatList
                  data={activity}
                  renderItem={({item, index}) => (
                    <Boxes item={item} index={index} />
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
