/* eslint-disable react/no-unstable-nested-components */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import COLORS from '../../helper/Colors';
import MyServices from '../Services/MyServices';
import Setting from '../Services/Setting';
import NewServices from '../Services/NewServices';
import Servicemanraisedemand from '../serviceman/Servicemanraisedemand';
import ServicemanReport from '../serviceman/ServicemanReport';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const Tab = createBottomTabNavigator();

const BottomNavigator = ({navigation}) => {

  const isFocused = useIsFocused();

  useEffect(() => {
    selectedLng();
  }, [isFocused]);
  return (
    <Tab.Navigator
      initialRouteName="New Services"
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
        name="New Services"
        component={NewServices}
        options={{
          title: strings.NEW_SERVICES,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="home-repair-service" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="My Services"
        component={MyServices}
        options={{
          title: strings.MY_SERVICES,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="home-repair-service" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ServicemanReport}
        options={{
          title:strings.REPORT,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="fact-check" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Serice man Raise Demand"
        component={Servicemanraisedemand}
        options={{
          title: strings.RAISE_DEMAND,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="fact-check" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title:strings.SETTING,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
