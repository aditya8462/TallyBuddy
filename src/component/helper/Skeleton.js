/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const skeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 60, height: 60, borderRadius: 50}} />
        <View style={{marginLeft: 20}}>
          <Image
            style={{width: 120, height: 20}}
            src={require('../assets/bank.png')}
          />
          <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18}}>
            Hello world
          </Text>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default skeleton;
