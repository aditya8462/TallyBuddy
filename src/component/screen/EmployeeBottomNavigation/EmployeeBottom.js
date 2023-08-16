/* eslint-disable react/no-unstable-nested-components */

import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FA from 'react-native-vector-icons/Foundation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import COLORS from '../../helper/Colors';
import EmployeeSetting from '../EmployeeService/EmployeeSetting';
import BarcodeScanner from '../../../Barcode/BarcodeScanner';
import SentDemand from '../Demand/SentDemand';
import RaiseDemand from '../EmployeeService/RaiseDemand';
import BillByStore from '../EmployeeService/BillByStore';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const Tab = createBottomTabNavigator();

const EmployeeBottom = ({navigation}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    selectedLng();
  }, [isFocused]);
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 105,
          borderTopWidth: 10,
          elevation: 10,
         
        },
        labelStyle:{
      fontFamily:'Poppins-Medium',
      fontSize:9,
      color:'#000',
        },
       
        showLabel: true,
        activeTintColor: COLORS.primary,
      }}
      screenOptions={{tabBarHideOnKeyboard: true}}>
      <Tab.Screen
        name="Send Demand"
        component={SentDemand}
        options={{
          title:strings.SEND_DEMAND,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <MCI name="file-send-outline" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Bill"
        component={BillByStore}
        options={{
          title:strings.BILL,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <FA name="page-multiple" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="BarcodeScanner"
        component={BarcodeScanner}
        options={{
          title:strings.SCANNER,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="qr-code-scanner" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Raise Demand"
        component={RaiseDemand}
        options={{
          title:strings.RAISE_DEMAND,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <MCI name="send-check" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={EmployeeSetting}
        options={{
          title: strings.SETTING,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default EmployeeBottom;
