/* eslint-disable react/no-unstable-nested-components */

import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FA from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import COLORS from '../../helper/Colors';
import StoreSetting from '../StoreService/StoreSetting';
import AddProduct from '../StoreService/AddProduct';
import StoreProductDetails from '../StoreService/StoreProductDetail';
import BillByStoreId from '../StoreService/BillByStoreId';
import StoreBarcodeScan from '../StoreBarcode/StoreBarcodeScan';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const Tab = createBottomTabNavigator();

const StoreBottom = ({navigation}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    selectedLng();
  }, [isFocused])
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
        name="Details"
        component={StoreProductDetails}
        options={{
          title: strings.PRODUCT_DETAILS,
          headerShown: false,
          tabBarIcon: ({color}) => <FA name="page" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Bill"
        component={BillByStoreId}
        options={{
          title: strings.BILL,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <FA name="page-multiple" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="StoreBarcodeScan"
        component={StoreBarcodeScan}
        options={{
          title: strings.SCANNER,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="qr-code-scanner" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Product"
        component={AddProduct}
        options={{
          title: strings.ADD_PRODUCT,
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Fontisto name="shopping-bag-1" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={StoreSetting}
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

export default StoreBottom;
