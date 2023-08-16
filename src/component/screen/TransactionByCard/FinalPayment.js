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
  StyleSheet,
} from 'react-native';
import {getData, ServerURL} from '../component/Connection/FetchServices';
import {DonutChart} from 'react-native-circular-chart';
const {height, width} = Dimensions.get('window');
const PADDING = 8;
import {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import COLORS from '../component/helper/Colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ent from 'react-native-vector-icons/Entypo';
import AppButton from '../component/uicomponents/AppButton';

const ShimerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function FinalPayment({navigation, route}) {
  const [loader, setLoader] = useState(true);
  const [viewbill, setViewBill] = useState([]);
  const [getLineitems, setLineitems] = useState([]);
  const [index, setIndex] = useState(0);

  const fetchBill = async () => {
    setLoader(true);
    var result = await getData('bill/byBill/' + route.params.bill_id);
    if (result.status) {
      setViewBill(result.data);
      setLineitems(result.data.lineitems);
    }
    setLoader(false);
    console.log(result);
  };

  useEffect(function () {
    fetchBill();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBill();
    }, []),
  );

  const DATA = [
    {name: 'Red', value: 250, color: '#faf3e0'},
    {name: 'Green', value: 250, color: '#f30'},
    {name: 'blue', value: 250, color: '#faf3'},
    {name: 'Yellow', value: 250, color: '#faf'},
  ];

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: '#fff',
      }}>
      <ScrollView>
        <View style={{flex: 1}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Poppins-Bold',
                  color: COLORS.btnColor,
                  marginTop: 5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                Debit
              </Text>
              <Ent
                name="file"
                size={20}
                style={{padding: 5, color: COLORS.btnColor}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: height * 0.03,
              }}>
              <View>
                <Text style={{backgroundColor: 'grey', borderRadius: 10}}>
                  This weak
                </Text>
              </View>
              <View>
                <Text style={{backgroundColor: 'grey', borderRadius: 10}}>
                  Last Month
                </Text>
              </View>
              <View>
                <Text style={{backgroundColor: 'grey', borderRadius: 10}}>
                  6 Months
                </Text>
              </View>
              <View>
                <Text style={{backgroundColor: 'grey', borderRadius: 10}}>
                  12 Months
                </Text>
              </View>
            </View>
            <View style={styles.sectionWrapper}>
              <DonutChart
                data={DATA}
                strokeWidth={15}
                radius={90}
                containerWidth={width - PADDING * 2}
                containerHeight={105 * 2}
                type="round"
                startAngle={0}
                endAngle={360}
                animationType="slide"
              />
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                marginTop: height * 0.02,
                borderTopColor: '#d0d0d0',
              }}>
              <View style={{flexDirection: 'row', padding: 10}}>
                <View style={{width: '70%'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Foods
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Health Care
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Supplies
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Bills
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Other
                  </Text>
                </View>
                <View style={{width: '30%'}}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                      fontWeight: '600',
                    }}>
                    $25.35
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    $125.35
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    $250.35
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    $18.35
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    $11.35
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 0.5,
                marginTop: height * 0.01,
                borderTopColor: '#d0d0d0',
              }}>
              <View style={{flexDirection: 'row', padding: 10}}>
                <View style={{width: '70%'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Total
                  </Text>
                </View>
                <View style={{width: '30%'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#2f3542',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    16000
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: height * 0.04,
                }}>
                <AppButton buttonText={'TRANSACTIONS'} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: '#ffffff',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop: height * 0.1,
  },
});
