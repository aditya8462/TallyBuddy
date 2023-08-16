import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import NewServices from '../Services/NewServices';
import MyServices from '../Services/MyServices';
import Seeting from '../Services/Setting';
import BottomNavigator from './BottomNavigator';
import ServicemanReport from '../serviceman/ServicemanReport';
import ServicemanSentDemand from '../serviceman/ServicemanSentDemand';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import Servicemanraisedemand from '../serviceman/Servicemanraisedemand';
import StockReportForServicemen from '../serviceman/StockReportForServicemen';

const Drawer = createDrawerNavigator();

export default function ServiceManDrawer() {
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
        component={BottomNavigator}
        options={{
          title: strings.HOME,
        }}
      />
      <Drawer.Screen
        name="New Services"
        component={NewServices}
        options={{
          title: strings.NEW_SERVICES,
        }}
      />
      <Drawer.Screen
        name="My Services"
        component={MyServices}
        options={{
          title: strings.MY_SERVICES,
        }}
      />
      <Drawer.Screen
        name="Report"
        component={ServicemanReport}
        options={{
          title: strings.REPORT,
        }}
      />
      <Drawer.Screen
        name="Raise Demand"
        component={Servicemanraisedemand}
        options={{
          title: strings.RAISE_DEMAND,
        }}
      />
      <Drawer.Screen
        name="Sent Demand"
        component={ServicemanSentDemand}
        options={{
          title: strings.SERVICEMANSENTDEMAND,
        }}
      />
            <Drawer.Screen
        name="Stock Report"
        component={StockReportForServicemen}
        options={{
          title: strings.STOCK_DETAILS,
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Seeting}
        options={{
          title: strings.SETTING,
        }}
      />
    </Drawer.Navigator>
  );
}
