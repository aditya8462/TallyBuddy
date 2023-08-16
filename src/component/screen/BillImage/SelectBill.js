import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import Anttt from 'react-native-vector-icons/AntDesign';
import {ServerURL} from '../../Connection/FetchServices';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
export default function SelectBill({route, navigation}) {
  const {height, width} = Dimensions.get('screen');
  const toggleModal = () => {
    navigation.goBack();
  };
  return (
    <View>
      <View
        style={{
          alignSelf: 'center',
          marginTop: height * 0.1,
        }}>
        <TouchableOpacity style={{alignSelf: 'flex-end'}}>
          <Anttt onPress={toggleModal} name="close" size={30} color={'#000'} />
        </TouchableOpacity>

        <FastImage
          style={{
            width: width * 0.8,
            height: height * 0.7,
          }}
          source={{uri: `${ServerURL}/images/${route.params.imgp}`,priority: FastImage.priority.normal}}
        />
      </View>
    </View>
  );
}
