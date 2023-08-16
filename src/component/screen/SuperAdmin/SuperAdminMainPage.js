/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */

import React, {useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  View,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Appearance,
} from 'react-native';
import {getData} from '../../Connection/FetchServices';
import COLORS from '../../helper/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import {getStoreData} from '../../storage/AsyncStorage';
import AsyncStorage from '@react-native-community/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
const {height, width} = Dimensions.get('window');

export default function SuperAdminMainPage({navigation}) {
  const isFocused = useIsFocused();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });


  const data = [
    {
      id: 1,
      type: 'SUPER_ADMIN',
      source: require('../../assets/profile.png'),
      route: 'Super Admins Details',
      key: 'admins',

      icon: (
        <Entypo
          name="user"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 2,
      type: 'ADMIN',
      source: require('../../assets/profile.png'),
      route: 'Admins Details',
      key: 'admins',

      icon: (
        <Entypo
          name="user"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 3,
      type: 'STORE',
      source: require('../../assets/store.png'),
      icon: (
        <Entypo
          name="shop"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
      route: 'Store Details',
      key: 'stores',
    },
    {
      id: 4,
      type: 'TEAM',
      source: require('../../assets/employee.png'),
      route: 'Team Details',
      key: 'employees',
      icon: (
        <FontAwesome
          name="users"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 5,
      type: 'ATTENDANCE',
      source: require('../../assets/employee.png'),
      route: 'Employee Attendance',
      key: 'attendance',
      icon: (
        <FontAwesome
          name="pencil-square-o"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 6,
      type: 'AVAILABLE',
      source: require('../../assets/employee.png'),
      key: 'available',
      route: 'Employee Available',
      icon: (
        <MaterialCommunityIcons
          name="calendar-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 7,
      type: 'VENDOR',
      source: require('../../assets/vendor.png'),
      key: 'vendors',
      route: 'Vendor Details',
      icon: (
        <MaterialIcons
          name="supervised-user-circle"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 8,
      type: 'CATEGORY',
      source: require('../../assets/category.png'),
      backgroundColor: COLORS.btnColor,
      key: 'categories',
      route: 'Category Details',
      icon: (
        <FontAwesome
          name="cubes"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 9,
      type: 'BRAND',
      source: require('../../assets/bank.png'),
      key: 'brands',
      route: 'Brand Details',
      icon: (
        <Entypo
          name="price-tag"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 10,
      type: 'MODEL',
      source: require('../../assets/model.png'),
      key: 'models',
      route: 'Model Details',
      icon: (
        <MaterialCommunityIcons
          name="format-list-bulleted-type"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 11,
      type: 'PRODUCT',
      source: require('../../assets/model.png'),
      key: 'products',
      route: 'Product Details',
      icon: (
        <Fontisto
          name="shopping-bag-1"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 12,
      type: 'SERVICE_TYPE',
      source: require('../../assets/model.png'),
      key: 'typesofservice',
      route: 'Service Details',
      icon: (
        <Octicons
          name="tools"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 13,
      type: 'CREATE_SERVICE',
      source: require('../../assets/model.png'),
      key: 'services',
      route: 'Create Service Details',
      icon: (
        <MaterialCommunityIcons
          name="tools"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 14,
      type: 'SERVICE_MAN',
      source: require('../../assets/model.png'),
      key: 'serviceman',
      route: 'Serviceman Details',
      icon: (
        <MaterialCommunityIcons
          name="human-dolly"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 15,
      type: 'RAW_MATERIAL',
      source: require('../../assets/model.png'),
      key: 'rawmaterial',
      route: 'Raw Material Details',
      icon: (
        <MaterialCommunityIcons
          name="human-dolly"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 15,
      type: 'MANUFACTURING',
      source: require('../../assets/model.png'),
      key: 'rawmaterial',
      route: 'Manufacturing Details',
      icon: (
        <MaterialCommunityIcons
          name="human-dolly"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 16,
      type: 'BANK',
      source: require('../../assets/bank.png'),
      key: 'banks',
      route: 'Bank Details',
      icon: (
        <MaterialCommunityIcons
          name="bank"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 17,
      type: 'ORDER',
      key: 'orders',
      route: 'Order',
      icon: (
        <MaterialCommunityIcons
          name="cart"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 18,
      type: 'STORE_REPORT',
      key: 'store Report',
      route: 'Store Report',
      icon: (
        <MaterialCommunityIcons
          name="file-chart"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 19,
      type: 'DEMAND',
      key: 'storereport',
      route: 'Demand',
      icon: (
        <MaterialCommunityIcons
          name="file-upload"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 20,
      type: 'ACTIVITY_CARD',
      key: 'ActivityCard',
      route: 'ActivityCard',
      icon: (
        <Feather
          name="activity"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 21,
      type: 'TEAM_REPORT',
      key: 'All Stores',
      route: 'All Stores',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 22,
      type: 'SERVICEMAN_REPORT',
      key: 'ServiceManReportForAdmin',
      route: 'ServiceManReportForAdmin',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 23,
      type: 'PAYMENT_SETTLEMENT',
      key: 'PaymentSettlementDetails',
      route: 'PaymentSettlementDetails',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 24,
      type: 'PAYMENT_REPORT',
      key: 'PaymentReport',
       route: 'PaymentReport',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 25,
      type: 'TRACK_SERVICEMAN',
      key: 'AllServiceman',
       route: 'AllServiceman',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 26,
      type: 'DRIVER_DETAILS',
      key: 'All Drivers',
       route: 'All Drivers',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 27,
      type: 'SERVICEMAN_STOCK',
      key: 'ServicemanStock',
      route: 'ServicemanStock',
      icon: (
        <MaterialCommunityIcons
          name="file-account"
          style={{fontSize: 32, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
    {
      id: 28,
      type: 'LOGOUT',
      key: 'storereport',
      route: 'Logout',
      icon: (
        <Ionicons
          name="log-out"
          style={{fontSize: 40, color: COLORS.btnColor, paddingLeft: 10}}
        />
      ),
    },
  ];

  const [count, setCount] = useState({});
  const [admin, setAdmin] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('SUPERADMIN');
    SweetAlert.showAlertWithOptions({
      title: strings.LOGOUT_SUCCESSFULLY,
      confirmButtonTitle: 'OK',
      confirmButtonColor: '#000',
      otherButtonTitle: 'Cancel',
      otherButtonColor: '#dedede',
      style: 'success',
      cancellable: true,
    });
    navigation.replace('Home');
  };

  const fetchSuperAdminDetails = async () => {
    setLoader(true);
    var result = await getStoreData('ADMIN');
    if (result) {
      setAdmin(result);
    }
    setLoader(false);
  };

  const fetchCount = async () => {
    var result = await getData('statistics');
    setCount(result.data);
  };

  useEffect(
    function () {
      selectedLng();
      fetchCount();
      fetchSuperAdminDetails();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchCount();
      fetchSuperAdminDetails();
    }, []),
  );

  const Boxes = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (item.route != 'Logout') {
            navigation.navigate(item.route);
          } else {
            handleLogout();
          }
        }}>
        <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 0.5,
              flex: 1,
              backgroundColor: theme == 'light' ? '#fff' : '#2C2C2C',
              width: width * 0.3,
              borderRadius: 10,
              borderColor: '#d0d0d0',
              borderWidth: 0.5,
              height: 110,
              margin: 3,
            }}>
            <View style={styles.ImageView}>
              {item.icon ? (
                item.icon
              ) : (
                <Image
                  style={styles.IMGStyle}
                  source={item.source}
                  resizeMode={'contain'}
                />
              )}
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light'? '#000': 'white',
                alignSelf: 'center',
                top: 15,
                paddingVertical: 5,
                textAlign: 'center',
              }}>
              {strings[item.type]}
            </Text>
          </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light'? '#fff':'black',
        flex: 1,
      }}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{marginTop: 20, alignSelf: 'center'}}>
            <FlatList
              data={data}
              key={3}
              numColumns={3}
              renderItem={({item}) => <Boxes item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  CardText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#000',
    alignSelf: 'center',
    top: 15,
  },
  MainView: {height: 'auto', padding: 1},
  SecondView: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0.5,
    flex: 1,
    backgroundColor: '#fff',
    width: width * 0.3,
    borderRadius: 10,
    borderColor: '#d0d0d0',

    borderWidth: 0.5,
    height: 110,
    margin: 3,
  },
  ImageView: {
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    top: 15,
  },
  IMGStyle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  statusTextIn: {
    fontSize: 9,
    color: '#000',
    alignSelf: 'center',
    top: 12,
  },
  DotStatusGreenColor: {
    width: 5,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#44bd32',
  },
});
