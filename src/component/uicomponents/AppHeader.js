import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StoreBottom from '../screen/StoreBottomNavigation/StoreBottom';
import StoreProductDetails from '../screen/StoreService/StoreProductDetail';
import BillByStoreId from '../screen/StoreService/BillByStoreId';
import StoreBarcodeScan from '../screen/StoreBarcode/StoreBarcodeScan';
import AddProduct from '../screen/StoreService/AddProduct';
import StoreSetting from '../screen/StoreService/StoreSetting';
import RaiseDemands from '../screen/StoreService/RaiseDemands';

const Drawer = createDrawerNavigator();

export default function AppHeader() {
  return (
    <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Home">
      <Drawer.Screen name="Home" component={StoreBottom} />
      <Drawer.Screen name="Details" component={StoreProductDetails} />
      <Drawer.Screen name="Bill" component={BillByStoreId} />
      <Drawer.Screen name="Scanner" component={StoreBarcodeScan} />
      <Drawer.Screen name="Add Product" component={AddProduct} />
      <Drawer.Screen name="Setting" component={StoreSetting} />
      <Drawer.Screen name="Raise Demand" component={RaiseDemands} />



    </Drawer.Navigator>
  );
}
