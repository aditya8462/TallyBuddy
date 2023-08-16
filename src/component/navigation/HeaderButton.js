import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HeaderButton(props) {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate(props.route)}>
        <Icon name={props.icon || 'add'} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
