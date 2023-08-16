import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SentDemand from '../Demand/SentDemand';
import BillByStore from '../EmployeeService/BillByStore';
import BarcodeScanner from '../../../Barcode/BarcodeScanner';
import RaiseDemand from '../EmployeeService/RaiseDemand';
import EmployeeSetting from '../EmployeeService/EmployeeSetting';
import EmployeeBottom from './EmployeeBottom';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import Cart from '../../../Barcode/Cart';
import TodayDelivery from '../Delivery/TodayDelivery';
import AddProductByEmployee from '../EmployeeService/AddProductByEmployee';
import CreateEmployeeRawMaterial from '../EmployeeService/CreateEmployeeRawMaterial';
import DisplayManufacturingByEmployee from '../EmployeeService/DisplayManufacturingByEmployee';
import COLORS from '../../helper/Colors';
import HeaderButton from '../../navigation/HeaderButton';
import DisplayProductByEmployee from '../EmployeeService/DisplayProductByEmployee';
import DisplayRawMaterialByEmployee from '../EmployeeService/DisplayRawMaterialByEmployee';
import StockDetailsByEmployee from '../EmployeeService/StockDetailsByEmployee';
import StockReportByEmployee from '../EmployeeService/StockReportByEmployee';
const Drawer = createDrawerNavigator();

export default function EmployeeDrawer() {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    selectedLng();
  }, [isFocused]);
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      initialRouteName="Home"
      screenOptions={{drawerLabelStyle: {fontFamily: 'Poppins-Medium'}}}>
      <Drawer.Screen
        name="Home"
        component={EmployeeBottom}
        options={{
          title: strings.HOME,
        }}
      />
      <Drawer.Screen
        name="Demand"
        component={SentDemand}
        options={{
          title: strings.DEMAND,
        }}
      />
      <Drawer.Screen
        name="Bill"
        component={BillByStore}
        options={{
          title: strings.BILL,
        }}
      />
      <Drawer.Screen
        name="Scanner"
        component={BarcodeScanner}
        options={{
          title: strings.SCANNER,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          title: strings.CART,
        }}
      />
       <Drawer.Screen
        name="Product Details"
        component={DisplayProductByEmployee}
        options={{
          headerStyle: {backgroundColor: COLORS.btnColor},
          headerTitle: strings.PRODUCT_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => (
            <HeaderButton route="AddProductByEmployee" />
          ),
        }}
      />
      <Drawer.Screen
        name="Manufacturing Product"
        component={DisplayManufacturingByEmployee}
        options={{
          headerStyle: {backgroundColor: COLORS.btnColor},
          headerTitle: strings.MANUFACTURING_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => (
            <HeaderButton route="AddManufacturingByEmployee" />
          ),
        }}
      />
       <Drawer.Screen
        name="Purchasing Stock"
        component={StockDetailsByEmployee}
        options={{
          headerStyle: {backgroundColor: COLORS.btnColor},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => (
            <HeaderButton route="AddStockByEmployee" />
          ),
        }}
      />

     <Drawer.Screen
        name="RawMaterial Details"
        component={DisplayRawMaterialByEmployee}
        options={{
          headerStyle: {backgroundColor: COLORS.btnColor},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => (
            <HeaderButton route="AddRawMaterialByEmployee" />
          ),
        }}
      />
      <Drawer.Screen
        name="Raise Demand"
        component={RaiseDemand}
        options={{
          title: strings.RAISE_DEMAND,
        }}
      />
      <Drawer.Screen
        name="Stock Report"
        component={StockReportByEmployee}
        options={{
          title: strings.STOCK_REPORT,
        }}
      />
      <Drawer.Screen
        name="Delivery"
        component={TodayDelivery}
        options={{
          title: strings.DELIVERY,
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={EmployeeSetting}
        options={{
          title: strings.SETTING,
        }}
      />
    </Drawer.Navigator>
  );
}
