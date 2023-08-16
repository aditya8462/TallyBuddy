/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Dimensions, ImageBackground} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
import {Divider} from 'react-native-elements';
import MCI from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';

const {width, height} = Dimensions.get('window');

export default function CardDetails() {
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
      <View style={{padding: 10, backgroundColor: '#ffff', flex: 1}}>
        <View
          style={{
            marginTop: height * 0.01,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Foundation
              style={{color: '#000'}}
              name={'dollar-bill'}
              size={24}
            />
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                marginLeft: width * 0.02,
              }}>
              Gross Balance
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 15,
                fontFamily: 'Poppins-Bold',
              }}>
              $4,158.29
            </Text>
          </View>
        </View>

        <View style={{marginTop: height * 0.015}}>
          <Divider orientation="horizontal" color="#d0d0d0" />
        </View>

        <View
          style={{
            padding: 20,
            backgroundColor: '#dfe4ea',
            width: width * 0.5,
            height: height * 0.3,
            marginTop: height * 0.03,
            borderRadius: 15,
            elevation: 5,
            borderColor: '#dfe4ea',
            borderWidth: 0.6,
          }}>
          <View>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Zilla Card
            </Text>
          </View>
          <View style={{marginTop: height * 0.14}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
              }}>
              $4,158.29
            </Text>
          </View>
          <View style={{marginTop: height * 0.01}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 13,
                fontFamily: 'Poppins-Medium',
              }}>
              **** 5722
            </Text>
          </View>
        </View>

        <View style={{padding: 5}}>
          <View style={{marginTop: height * 0.02}}>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
              }}>
              May 2021
            </Text>
          </View>

          <View
            style={{
              marginTop: height * 0.015,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon style={{color: '#000'}} name={'arrow-up'} size={22} />
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                Credit
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                +2,213.22
              </Text>
            </View>
          </View>

          <View style={{marginTop: height * 0.005}}>
            <Divider orientation="horizontal" color="black" />
          </View>

          <View
            style={{
              marginTop: height * 0.015,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon style={{color: '#000'}} name={'arrow-up'} size={22} />
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                Debit
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                -1,821.35
              </Text>
            </View>
          </View>

          <View style={{marginTop: height * 0.005}}>
            <Divider orientation="horizontal" color="black" />
          </View>

          <View
            style={{
              marginTop: height * 0.015,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon style={{color: '#000'}} name={'arrow-up'} size={22} />
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                Balance
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                }}>
                2,213.22
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 8,
            marginTop: height * 0.06,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              padding: 12,
              borderWidth: 0.6,
              backgroundColor: '#fff',
              width: width * 0.4,
              height: height * 0.14,
              borderRadius: 15,
              justifyContent: 'space-between',
              elevation: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#10bcf9',
                width: width * 0.07,
                height: height * 0.04,
                borderRadius: 50,
              }}>
              <MCI name="dollar" style={{color: '#000'}} size={20} />
            </View>
            <View style={{marginTop: height * 0.02}}>
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                }}>
                Payments
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 12,
              borderWidth: 0.6,
              backgroundColor: '#fff',
              width: width * 0.4,
              height: height * 0.14,
              borderRadius: 20,
              justifyContent: 'space-between',
              elevation: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#10bcf9',
                width: width * 0.07,
                height: height * 0.04,
                borderRadius: 50,
              }}>
              <Feather
                name="arrow-up-right"
                style={{color: '#000'}}
                size={20}
              />
            </View>
            <View style={{marginTop: height * 0.02}}>
              <Text
                style={{
                  color: '#2C2C2C',
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                }}>
                Transfers
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
