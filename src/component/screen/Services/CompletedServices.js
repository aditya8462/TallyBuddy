import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  ScrollView,
  Alert,
  Touchable,
} from 'react-native';
import COLORS from '../../helper/Colors';
import {postData} from '../../Connection/FetchServices';
import {useFocusEffect} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

export default function CompletedServices({navigation}) {
  const [filterList, setFilterList] = useState([]);
  const fetchServicesFilterList = async () => {
    // setLoader(true);
    var result = await postData('services/filterlist');

    if (result.status) {
      setFilterList(result.data);
    }
    // setLoader(false);
  };

  useEffect(function () {
    fetchServicesFilterList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchServicesFilterList();
    }, []),
  );

  const Boxes = ({item}) => {
    return (
    
      <TouchableOpacity

        style={{
          width: width * 0.22,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          borderColor: '#d0d0d0',
          borderWidth:0.5,
          alignItems: 'center',
          justifyContent: 'center',
          height: height * 0.045,
          marginLeft: width * 0.05,
          marginTop: height * 0.01,
        }}>
        <Text
          style={{
            color: '#000',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={{
          flex: 1,
          zIndex: 9999,
          height,
          width: '100%',
        }}>
           <View style={{marginBottom: height * 0.24}}>
        <FlatList
          data={filterList}
          renderItem={({item}) => <Boxes item={item} />}
          keyExtractor={item => item.id}
          horizontal
        />
        </View>
      </ImageBackground>
    </View>
  );
}
