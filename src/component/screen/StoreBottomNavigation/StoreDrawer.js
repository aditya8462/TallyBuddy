import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StoreProductDetails from '../StoreService/StoreProductDetail';
import BillByStoreId from '../StoreService/BillByStoreId';
import StoreBarcodeScan from '../StoreBarcode/StoreBarcodeScan';
import AddProduct from '../StoreService/AddProduct';
import StoreSetting from '../StoreService/StoreSetting';
import RaiseDemands from '../StoreService/RaiseDemands';
import StoreBottom from './StoreBottom';
import StoreReportByStore from '../Store/StoreReportByStore';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import StoreCart from '../StoreBarcode/StoreCart';
import StoreTotalCollection from '../Store/StoreTotalCollection';
import CreateStoreRawMaterial from '../StoreService/CreateStoreRawMaterial';
import DisplayManufacturingByStore from '../StoreService/DisplayManufacturingByStore';
import COLORS from '../../helper/Colors';
import HeaderButton from '../../navigation/HeaderButton';
import DeliveryByStore from '../Delivery/DeliveryByStore';
import DisplayRawMaterialByStore from '../StoreService/DisplayRawMaterialByStore';
import StockDetailsByStore from '../StoreService/StockDetailsByStore';
const Drawer = createDrawerNavigator();

export default function StoreDrawer({navigation}) {
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
        component={StoreBottom}
        options={{
          title: strings.HOME,
        }}
      />
       <Drawer.Screen
        name="Details"
        component={StoreProductDetails}
        options={{
          headerTitle: strings.PRODUCT_DETAILS,
          headerStyle: {backgroundColor: COLORS.btnColor},
          title: strings.PRODUCT_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => <HeaderButton route="Add Products" />,
        }}
      />
      {/* <Drawer.Screen
        name="Details"
        component={StoreProductDetails}
        options={{
          title: strings.PRODUCT_DETAILS,
        }}
      /> */}
      <Drawer.Screen
        name="Bill"
        component={BillByStoreId}
        options={{
          title: strings.BILL,
        }}
      />
      <Drawer.Screen
        name="Scanner"
        component={StoreBarcodeScan}
        options={{
          title: strings.SCANNER,
        }}
      />
      <Drawer.Screen
        name="StoreCart"
        component={StoreCart}
        options={{
          title: strings.CART,
        }}
      />
      <Drawer.Screen
        name="Manufacturing Product"
        component={DisplayManufacturingByStore}
        options={{
          headerTitle: strings.MANUFACTURING_DETAILS,
          headerStyle: {backgroundColor: COLORS.btnColor},
          title: strings.MANUFACTURING_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => <HeaderButton route="AddManufacturingByStore" />,
        }}
      />


<Drawer.Screen
        name="Purchasing Stock"
        component={StockDetailsByStore}
        options={{
          headerTitle: strings.STOCK_DETAILS,
          headerStyle: {backgroundColor: COLORS.btnColor},
          // title: strings.STOCK_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => <HeaderButton route="AddStockByStore" />,
        }}
      />

<Drawer.Screen
        name="Raw Material"
        component={DisplayRawMaterialByStore}
        options={{
          headerTitle: strings.RAW_MATERIAL_DETAILS,
          headerStyle: {backgroundColor: COLORS.btnColor},
          // title: strings.STOCK_DETAILS,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
          },
          headerRight: () => <HeaderButton route="Add Raw Material" />,
        }}
      />
     
      <Drawer.Screen
        name="Raise Demand"
        component={RaiseDemands}
        options={{
          title: strings.RAISE_DEMAND,
        }}
      />
      <Drawer.Screen
        name="Report"
        component={StoreReportByStore}
        options={{
          title: strings.REPORT,
        }}
      />
      <Drawer.Screen
        name="Delivery"
        component={DeliveryByStore}
        options={{
          title: strings.DELIVERY,
        }}
      />
      <Drawer.Screen
        name="StoreTotalCollection"
        component={StoreTotalCollection}
        options={{
          title: strings.TOTALCOLLECTION,
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={StoreSetting}
        options={{
          title: strings.SETTING,
        }}
      />
    </Drawer.Navigator>
  );
}
