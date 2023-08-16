/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import HeaderButton from './src/component/navigation/HeaderButton';
import {Header} from 'react-native-elements';
import Home from './src/component/screen/Home';
import Main from './src/component/screen/Main';
import SuperAdminMainPage from './src/component/screen/SuperAdmin/SuperAdminMainPage';
import Login from './src/component/screen/Admin/AdminLogin';
import AdminDetails from './src/component/screen/Admin/AdminDetails';
import SuperAdminDetails from './src/component/screen/SuperAdmin/SuperAdminDetails';
import SuperAdminLogin from './src/component/screen/SuperAdmin/SuperAdminLogin';
import EditAdmin from './src/component/screen/Admin/EditAdmin';
import EditSuperAdmin from './src/component/screen/SuperAdmin/EditSuperAdmin';
import CreateAdmin from './src/component/screen/Admin/CreateAdmin';
import CreateSuperAdmin from './src/component/screen/SuperAdmin/CreateSuperAdmin';
import CreateBank from './src/component/screen/Bank/CreateBank';
import BankDetails from './src/component/screen/Bank/BankDetails';
import EditBank from './src/component/screen/Bank/EditBank';
import CreateBrand from './src/component/screen/Brand/CreateBrand';
import BrandDetails from './src/component/screen/Brand/BrandDetails';
import EditBrand from './src/component/screen/Brand/EditBrand';
import CreateCategory from './src/component/screen/Category/CreateCategory';
import CategoryDetails from './src/component/screen/Category/CategoryDetails';
import EditCategory from './src/component/screen/Category/EditCategory';
import EmployeeDetails from './src/component/screen/Employee/EmployeeDetails';
import EditEmployee from './src/component/screen/Employee/EditEmployee';
import EmployeeLogin from './src/component/screen/Employee/EmployeeLogin';
import CreateEmployee from './src/component/screen/Employee/CreateEmployee';
import EditStore from './src/component/screen/Store/EditStore';
import CreateStore from './src/component/screen/Store/CreateStore';
import StoreDetails from './src/component/screen/Store/StoreDetails';
import EditVendor from './src/component/screen/Vendor/EditVendor';
import CreateVendor from './src/component/screen/Vendor/CreateVendor';
import VendorDetails from './src/component/screen/Vendor/VendorDetails';
import CreateModel from './src/component/screen/Model/CreateModel';
import ModelDetails from './src/component/screen/Model/ModelDetails';
import EditModel from './src/component/screen/Model/EditModel';
import CreateService from './src/component/screen/TypeService/CreateService';
import ServiceDetails from './src/component/screen/TypeService/ServiceDetails';
import EditService from './src/component/screen/TypeService/EditService';
import CreateProduct from './src/component/screen/Product/CreateProduct';
import ProductDetails from './src/component/screen/Product/ProductDetails';
import EditProduct from './src/component/screen/Product/EditProduct';
import EmployeeClockIn from './src/component/screen/Map/EmployeeClockIn';
import AppNetInfo from './src/component/screen/AppNetInfo/AppNetInfo';
import CreateCreateService from './src/component/screen/CreateService/CreateCreateService';
import CreateServiceDetails from './src/component/screen/CreateService/CreateServiceDetails';
import EditCreateService from './src/component/screen/CreateService/EditCreateService';
import EmployeeAttendance from './src/component/screen/Attendance/EmployeeAttendance';
import AttendanceDetail from './src/component/screen/Attendance/AttendanceDetail';
import AttendanceServiceman from './src/component/screen/Attendance/AttendanceServiceman';
import Map from './src/component/screen/Map';
import EmployeeAvailable from './src/component/screen/Available/EmployeeAvailable';
import CreateServiceMan from './src/component/screen/serviceman/CreateServiceMan';
import EditServiceMan from './src/component/screen/serviceman/EditServiceMan';
import ServiceManDetails from './src/component/screen/serviceman/ServiceManDetails';
import ServiceManLogin from './src/component/screen/serviceman/ServiceManLogin';
import ServiceManClockIn from './src/component/screen/serviceman/ServiceManClockIn';
import BottomNavigator from './src/component/screen/BottomNavigation/BottomNavigator';
import Page from './src/component/screen/BottomNavigation/Page';
import AboutServices from './src/component/screen/Services/AboutServices';
import ChangePassword from './src/component/screen/Services/ChangePassword';
import EmployeePage from './src/component/screen/EmployeeBottomNavigation/EmployeePage';
import StorePage from './src/component/screen/StoreBottomNavigation/StorePage';
import DemandDetails from './src/component/screen/Demand/DemandDetails';
import BillByBillView from './src/component/screen/EmployeeService/BillByBillView';
import DisplayOrder from './src/component/screen/Order/DisplayOrder';
import DisplayOrderById from './src/component/screen/Order/DisplayOrderById';
import DisplayBillById from './src/component/screen/Order/DisplayBillById';
import StoreLogin from './src/component/screen/Store/StoreLogin';
import EditStoreProduct from './src/component/screen/StoreService/EditStoreProduct';
import BillViewByStore from './src/component/screen/StoreService/BillViewByStore';
import CardDetails from './src/component/screen/TransactionByCard/CardDetails';
import FinalPayment from './src/component/screen/TransactionByCard/CardDetails';
import StoreReport from './src/component/screen/Store/StoreReport';
import ReportByStore from './src/component/screen/Store/ReportByStore';
import ActivityCard from './src/component/screen/ActivityCard/ActivityCard';
import Splash from './src/component/screen/Splash/Splash';
import RaiseDemands from './src/component/screen/StoreService/RaiseDemands';
import Servicemanraisedemand from './src/component/screen/serviceman/Servicemanraisedemand';
import DistributeProduct from './src/component/screen/Product/DistributeProduct';
import ChooseLanguage from './src/changeLanguage/ChooseLanguage';
import PaymentSettlementDetails from './src/component/screen/Payment/PaymentSettlementDetails';
import WebContainer from './src/component/Connection/WebContainer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import Barcode from './src/Barcode/Barcode';
import BarcodeDetails from './src/Barcode/BarcodeDetails';
import Cart from './src/Barcode/Cart';
import Invoice from './src/Barcode/Invoice';
import CustomerInfo from './src/Barcode/CustomerInfo';
import COLORS from './src/component/helper/Colors';
import {LogBox} from 'react-native';
import StoreBarcode from './src/component/screen/StoreBarcode/StoreBarcode';
import StoreBarcodeDetails from './src/component/screen/StoreBarcode/StoreBarcodeDetails';
import StoreCart from './src/component/screen/StoreBarcode/StoreCart';
import StoreInvoice from './src/component/screen/StoreBarcode/StoreInvoice';
import StoreCustomerInfo from './src/component/screen/StoreBarcode/StoreCustomerInfo';
import StoreReportByStore from './src/component/screen/Store/StoreReportByStore';
import ServicemanReport from './src/component/screen/serviceman/ServicemanReport';
import Print from './src/component/screen/Invoice Bill/Print';
import CashPayment from './src/component/screen/Invoice Bill/CashPayment'
import AllStores from './src/component/screen/Employee Report/AllStores';
import StoreByEmployee from './src/component/screen/Employee Report/StoreByEmployee';
import ReportByEmployee from './src/component/screen/Employee Report/ReportByEmployee';
import ServiceManReportForAdmin from './src/component/screen/serviceman/ServiceManReportForAdmin';
import ServiceManReportForAdmins from './src/component/screen/serviceman/ServiceManReportForAdmins';
import {selectedLng} from './src/changeLanguage/ChangeLanguage';
import strings from './src/changeLanguage/LocalizedString';
import PaymentSettlement from './src/component/screen/Payment/PaymentSettlement';
import ServicemanSentDemand from './src/component/screen/serviceman/ServicemanSentDemand';
import AllServiceman from './src/component/screen/Track Serviceman/AllServiceman';
import ServicemanLocation from './src/component/screen/Track Serviceman/ServicemanLocation';
import TodayDelivery from './src/component/screen/Delivery/TodayDelivery';
import StoreTotalCollection from './src/component/screen/Store/StoreTotalCollection';
import PaymentReport from './src/component/screen/Payment/PaymentReport';
import BookingSlip from './src/component/screen/Invoice Bill/BookingSlip';
import GetReceipt from './src/component/screen/Invoice Bill/GetReceipt';
import CreateRawMaterial from './src/component/screen/RawMaterial/CreateRawMaterial';
import DisplayRawMaterial from './src/component/screen/RawMaterial/DisplayRawMaterial';
import EditRawMaterial from './src/component/screen/RawMaterial/EditRawMaterial';
import ViewBillService from './src/component/screen/Services/ViewBillService';
import CreateManufacturing from './src/component/screen/Manufacturing/CreateManufacturing';
import ManufacturingDetails from './src/component/screen/Manufacturing/ManufacturingDetails';
import EditManufacturing from './src/component/screen/Manufacturing/EditManufacturing';
import EditManufacturingByStore from './src/component/screen/StoreService/EditManufacturingByStore';
import AddManufacturingByStore from './src/component/screen/StoreService/AddManufacturingByStore';
import AddManufacturingByEmployee from './src/component/screen/EmployeeService/AddManufacturingByEmployee';
import EditManufacturingByEmployee from './src/component/screen/EmployeeService/EditManufacturingByEmployee';
import ServicemanSlip from './src/component/screen/Invoice Bill/ServicemanSlip';
import DeliveryByStore from './src/component/screen/Delivery/DeliveryByStore';
import BillByStore from './src/component/screen/EmployeeService/BillByStore';
import AllDrivers from './src/component/screen/Driver/AllDrivers';
import DriverPayment from './src/component/screen/Driver/DriverPayment';
import SendNotifi from './src/component/sendnotifi/SendNotifi';
import ViewEmployeeDetails from './src/component/screen/Employee/ViewEmployeeDetails';
import ViewProductDetails from './src/component/screen/Product/ViewProductDetails';
import ViewManufacturingDetails from './src/component/screen/Manufacturing/ViewManufacturingDetails'
import ViewServicemanDetails from './src/component/screen/serviceman/ViewServicemanDetails';
import viewStoreProductDetails from './src/component/screen/StoreService/ViewStoreProductDetails';
import viewStoreManufacturingDetails from './src/component/screen/StoreService/ViewStoreManufacturingDetails';
import viewEmployeeManufacturingDetails from './src/component/screen/EmployeeService/ViewEmployeeManufacturingDetails';
import ImageSelected from './src/component/screen/SelectedImg/ImageSelected';
import SelectAttImage from './src/component/screen/AttendanceSelect/SelectAttImage';
import SelectAttImage2 from './src/component/screen/AttendanceSelect2/SelectAttImage2';
import SelectBill from './src/component/screen/BillImage/SelectBill';
import SelectBill2 from './src/component/screen/BillImage2/SelectBill2';
import EditRawmaterialByStore from './src/component/screen/StoreService/EditRawmaterialByStore';
import EmployeImageSet from './src/component/screen/SettingEmployeImage/EmployeImageSet';
import ServiceImageSet from './src/component/screen/SettingServiceImage/ServiceImageSet';
import EditProductByEmployee from './src/component/screen/EmployeeService/EditProductByEmployee'
import EditRawMaterialByEmployee from './src/component/screen/EmployeeService/EditRawMaterialByEmployee'
import EmployeeReportSettlementDetails from './src/component/screen/Employee Report/EmployeeReportSettlementDetails'
import StoreBarcodeScan from './src/component/screen/StoreBarcode/StoreBarcodeScan'
import BarcodeScanner from './src/Barcode/BarcodeScanner';
import AddStock from './src/component/screen/Stock/AddStock'
import StockDetails from './src/component/screen/Stock/StockDetails'
import ViewStockDetails from './src/component/screen/Stock/ViewStockDetails'
import AddStockByStore from './src/component/screen/StoreService/AddStockByStore'
import StockDetailsByStore from './src/component/screen/StoreService/StockDetailsByStore'

import AddStockByEmployee from './src/component/screen/EmployeeService/AddStockByEmployee'
import StockDetailsByEmployee from './src/component/screen/EmployeeService/StockDetailsByEmployee'
import DistributeStock from './src/component/screen/Stock/DistributeStock'
import AddStockofManufacturingByStore from './src/component/screen/StoreService/AddStockofManufacturingByStore'
import AddStockofManufacturingByEmployee from './src/component/screen/EmployeeService/AddStockofManufacturingByEmployee'
import AddStockofManufacturing from './src/component/screen/Manufacturing/AddStockofManufacturing'
import ViewStockDetailsByStore from './src/component/screen/StoreService/ViewStockDetailsByStore'
import AddProduct from './src/component/screen/StoreService/AddProduct';
import CreateStoreRawMaterial from './src/component/screen/StoreService/CreateStoreRawMaterial';
import AddProductByEmployee from './src/component/screen/EmployeeService/AddProductByEmployee';
import CreateEmployeeRawMaterial from './src/component/screen/EmployeeService/CreateEmployeeRawMaterial';
import ServicemanStock from './src/component/screen/serviceman/ServicemanStock'
import StockMaterialofServiceman from './src/component/screen/serviceman/StockMaterialofServiceman'
const store = createStore(WebContainer);

export default function App() {
  LogBox.ignoreAllLogs();

  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OneSignal"
            component={SendNotifi}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ImageSelected"
            component={ImageSelected}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SelectAttImage"
            component={SelectAttImage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SelectAttImage2"
            component={SelectAttImage2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SelectBill"
            component={SelectBill}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SelectBill2"
            component={SelectBill2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmployeImageSet"
            component={EmployeImageSet}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ServiceImageSet"
            component={ServiceImageSet}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Main"
            component={Main}
            options={{
              header: () => (
                <Header
                  centerComponent={{
                    text: strings.TALLYBUDDY,
                    style: {
                      color: '#fff',
                      fontSize: 20,
                      fontFamily: 'Poppins-SemiBold',
                    },
                  }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="SuperAdminMainPage"
            component={SuperAdminMainPage}
            options={{
              header: () => (
                <Header
                  centerComponent={{
                    text: strings.TALLYBUDDY,
                    style: {
                      color: '#fff',
                      fontSize: 20,
                      fontFamily: 'Poppins-SemiBold',
                    },
                  }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="AdminLogin"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmployeeLogin"
            component={EmployeeLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreLogin"
            component={StoreLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PaymentSettlement"
            component={PaymentSettlement}
            options={{
              headerTitle: strings.SETTLEMENT_SUMMARY,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="SuperAdminLogin"
            component={SuperAdminLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Language"
            component={ChooseLanguage}
            options={{
              headerTitle: strings.LANGUAGE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="BillView"
            component={BillByBillView}
            options={{
              headerTitle: strings.BILL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => (
                <HeaderButton route="EmployeePage" icon="home" />
              ),
            }}
          />
          <Stack.Screen
            name="ServiceViewBill"
            component={ViewBillService}
            options={{
              headerTitle: strings.BILL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="TodayDelivery"
            component={TodayDelivery}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DeliveryByStore"
            component={DeliveryByStore}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BillViews"
            component={BillViewByStore}
            options={{
              headerTitle: strings.BILL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="StorePage" icon="home" />,
            }}
          />
          <Stack.Screen
            name="Order"
            component={DisplayOrder}
            options={{
              headerTitle: strings.ORDER,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="PaymentReport"
            component={PaymentReport}
            options={{
              headerTitle: strings.PAYMENT_REPORT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="PaymentSettlementDetails"
            component={PaymentSettlementDetails}
            options={{
              headerTitle: strings.PAYMENT_SETTLEMENT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="PaymentSettlement" />,
            }}
          />
           <Stack.Screen
            name="EmployeeReportSettlementDetails"
            component={EmployeeReportSettlementDetails}
            options={{
              headerTitle: strings.PAYMENT_SETTLEMENT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              // headerRight: () => <HeaderButton route="ReportByEmployee" />,
            }}
          />
          <Stack.Screen
            name="DisplayOrder"
            component={DisplayOrderById}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.ORDER_BILL,
            }}
          />
          <Stack.Screen
            name="DisplayBillById"
            component={DisplayBillById}
            options={{
              headerTitle: strings.BILL,

              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="ServicemanLogin"
            component={ServiceManLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BottomNavigator"
            component={BottomNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Page"
            component={Page}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmployeePage"
            component={EmployeePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StorePage"
            component={StorePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Admins Details"
            component={AdminDetails}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTitle: strings.ADMINDETAILS,
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Admins" />,
            }}
          />
          <Stack.Screen
            name="Super Admins Details"
            component={SuperAdminDetails}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTitle: strings.SUPERADMINDETAILS,
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Super Admins" />,
            }}
          />
          <Stack.Screen
            name="Vendor Details"
            component={VendorDetails}
            options={{
              headerTitle: strings.VENDOR_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Vendor" />,
            }}
          />
          <Stack.Screen
            name="Category Details"
            component={CategoryDetails}
            options={{
              headerTitle: strings.CATEGORY_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Category" />,
            }}
          />
          <Stack.Screen
            name="Brand Details"
            component={BrandDetails}
            options={{
              headerTitle: strings.BRAND_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Brand" />,
            }}
          />
          <Stack.Screen
            name="Raw Material Details"
            component={DisplayRawMaterial}
            options={{
              headerTitle: strings.RAW_MATERIAL_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Raw Material" />,
            }}
          />
          <Stack.Screen
            name="Model Details"
            component={ModelDetails}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Model" />,
            }}
          />
          <Stack.Screen
            name="Bank Details"
            component={BankDetails}
            options={{
              headerTitle: strings.BANK_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Bank" />,
            }}
          />
          <Stack.Screen
            name="Store Details"
            component={StoreDetails}
            options={{
              headerTitle: strings.STORE_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Store" />,
            }}
          />
          <Stack.Screen
            name="Team Details"
            component={EmployeeDetails}
            options={{
              headerTitle: strings.TEAM_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Team" />,
            }}
          />
          <Stack.Screen
            name="Create Vendor"
            component={CreateVendor}
            options={{
              headerTitle: strings.CREATE_VENDOR,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Brand"
            component={CreateBrand}
            options={{
              headerTitle: strings.CREATE_BRAND,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Bank"
            component={CreateBank}
            options={{
              headerTitle: strings.CREATE_BANK,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Category"
            component={CreateCategory}
            options={{
              headerTitle: strings.CREATE_CATEGORY,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Admins"
            component={CreateAdmin}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTitle: strings.CREATE_ADMINS,
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Super Admins"
            component={CreateSuperAdmin}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTitle: strings.CREATE_SUPERADMINS,
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Store"
            component={CreateStore}
            options={{
              headerTitle: strings.CREATE_STORE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Model"
            component={CreateModel}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Raw Material"
            component={CreateRawMaterial}
            options={{
              headerTitle: strings.CREATE_RAW_MATERIAL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Vendor"
            component={EditVendor}
            options={{
              headerTitle: strings.EDIT_VENDOR,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Store Product"
            component={EditStoreProduct}
            options={{
              headerTitle: strings.EDIT_STORE_PRODUCT,

              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />

          <Stack.Screen
            name="EditRawmaterialByStore"
            component={EditRawmaterialByStore}
            options={{
              headerTitle: strings.EDIT_STORE_PRODUCT,

              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Brand"
            component={EditBrand}
            options={{
              headerTitle: strings.EDIT_BRAND,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Model"
            component={EditModel}
            options={{
              headerTitle: strings.EDIT_MODEL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Raw Material"
            component={EditRawMaterial}
            options={{
              headerTitle: strings.EDIT_RAW_MATERIAL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Category"
            component={EditCategory}
            options={{
              headerTitle: strings.EDIT_CATEGORY,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Store"
            component={EditStore}
            options={{
              headerTitle: strings.EDIT_Store,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Bank"
            component={EditBank}
            options={{
              headerTitle: strings.EDIT_BANK,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Admin"
            component={EditAdmin}
            options={{
              headerTitle: strings.EDIT_ADMINS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Super Admin"
            component={EditSuperAdmin}
            options={{
              headerTitle: strings.EDIT_ADMINS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Edit Team"
            component={EditEmployee}
            options={{
              headerTitle: strings.EDIT_TEAM,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Team"
            component={CreateEmployee}
            options={{
              headerTitle: strings.CREATE_TEAM,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Create Service"
            component={CreateCreateService}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.CREATE_CUSTOMER_SERVICE,
            }}
          />
          <Stack.Screen
            name="Create Service Details"
            component={CreateServiceDetails}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.CREATE_CUSTOMER_SERVICE,
              headerRight: () => <HeaderButton route="Create Create Service" />,
            }}
          />
          <Stack.Screen
            name="Edit Create Service"
            component={EditCreateService}
            options={{
              headerTitle: strings.EDIT_CUSTOMER_SERVICE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Service"
            component={CreateService}
            options={{
              headerTitle: strings.CREATE_SERVICE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Service Details"
            component={ServiceDetails}
            options={{
              headerTitle: strings.SERVICE_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Service" />,
            }}
          />
          <Stack.Screen
            name="Edit Service"
            component={EditService}
            options={{
              headerTitle: strings.EDIT_SERVICE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="ClockIn"
            component={EmployeeClockIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ServiceManClockIn"
            component={ServiceManClockIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Create Product"
            component={CreateProduct}
            options={{
              headerTitle: strings.CREATE_PRODUCT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Product Details"
            component={ProductDetails}
            options={{
              headerTitle: strings.PRODUCT_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Product" />,
            }}
          />
          <Stack.Screen
            name="Edit Product"
            component={EditProduct}
            options={{
              headerTitle: strings.EDIT_PRODUCT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="EditProductByEmployee"
            component={EditProductByEmployee}
            options={{
              headerTitle: strings.EDIT_PRODUCT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="EditRawMaterialByEmployee"
            component={EditRawMaterialByEmployee}
            options={{
              headerTitle: strings.EDIT_RAW_MATERIAL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Employee Attendance"
            component={EmployeeAttendance}
            options={{
              headerTitle: strings.EMPLOYEE_ATTENDANCE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Attendance Detail"
            component={AttendanceDetail}
            options={{
              headerTitle: strings.ATTENDANCE_DETAIL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Employee Detail"
            component={ViewEmployeeDetails}
            options={{
              headerTitle: strings.TEAM_DETAIL,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Product Detail"
            component={ViewProductDetails}
            options={{
              headerTitle: strings.PRODUCT_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          
          <Stack.Screen
            name="Manufacturing Detail"
            component={ViewManufacturingDetails}
            options={{
              headerTitle: strings.MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
            <Stack.Screen
            name="Stock Detail"
            component={ViewStockDetails}
            options={{
              headerTitle: 'Stock Details',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Serviceman Detail"
            component={ViewServicemanDetails}
            options={{
              headerTitle: strings.SERVICEMAN_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Store Product Detail"
            component={viewStoreProductDetails}
            options={{
              headerTitle: strings.PRODUCT_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Store Manufacturing Detail"
            component={viewStoreManufacturingDetails}
            options={{
              headerTitle: strings.MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Employee Manufacturing Detail"
            component={viewEmployeeManufacturingDetails}
            options={{
              headerTitle: strings.MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Distribute Detail"
            component={DistributeProduct}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="About Service"
            component={AboutServices}
            options={{
              headerTitle: strings.ABOUT_SERVICE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Attendance Serviceman"
            component={AttendanceServiceman}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Map"
            component={Map}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Employee Available"
            component={EmployeeAvailable}
            options={{
              headerTitle: strings.EMPLOYEE_AVAILABLE,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Serviceman"
            component={CreateServiceMan}
            options={{
              headerTitle: strings.CREATE_SERVICEMAN,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Serviceman Details"
            component={ServiceManDetails}
            options={{
              headerTitle: strings.SERVICEMAN_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Serviceman" />,
            }}
          />
          <Stack.Screen
            name="Edit Serviceman"
            component={EditServiceMan}
            options={{
              headerTitle: strings.EDIT_SERVICEMAN,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Forget"
            component={ChangePassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Barcode"
            component={Barcode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Barcode Details"
            component={BarcodeDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Invoice"
            component={Invoice}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Card"
            component={CardDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Payment"
            component={FinalPayment}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Customer"
            component={CustomerInfo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreBarcode"
            component={StoreBarcode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreBarcodeDetails"
            component={StoreBarcodeDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreCart"
            component={StoreCart}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreInvoice"
            component={StoreInvoice}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreCustomer"
            component={StoreCustomerInfo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Store Report"
            component={StoreReport}
            options={{
              headerTitle: strings.STORE_REPORT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StoreTotalCollection"
            component={StoreTotalCollection}
            options={{
              headerTitle: strings.STORE_REPORT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="ReportByStore"
            component={ReportByStore}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.STORE_REPORT,
            }}
          />
          <Stack.Screen
            name="ActivityCard"
            component={ActivityCard}
            options={{
              headerTitle: strings.ACTIVITY_CARD_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Demand"
            component={DemandDetails}
            options={{
              headerTitle: strings.DEMAND_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="ServicemanReport"
            component={ServicemanReport}
            options={{
              headerTitle: strings.SERVICEMAN_REPORT,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StoreReportByStore"
            component={StoreReportByStore}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Raise Demand"
            component={RaiseDemands}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Store" />,
            }}
          />
          <Stack.Screen
            name="Serice man Raise Demand"
            component={Servicemanraisedemand}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Serice man Sent Demand"
            component={ServicemanSentDemand}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Print"
            component={Print}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Cash"
            component={CashPayment}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BookingSlip"
            component={BookingSlip}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GetReceipt"
            component={GetReceipt}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ServicemanSlip"
            component={ServicemanSlip}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="All Stores"
            component={AllStores}
            options={{
              headerTitle: strings.ALL_STORES,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="ServiceManReportForAdmin"
            component={ServiceManReportForAdmin}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.ALL_SERVICEMAN,
            }}
          />
          <Stack.Screen
            name="ServiceManReportForAdmins"
            component={ServiceManReportForAdmins}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.SERVICEMAN_REPORT,
            }}
          />
          <Stack.Screen
            name="BillByStore"
            component={BillByStore}
            options={{
              headerTitle: strings.BILL,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="StoreByEmployee"
            component={StoreByEmployee}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.TEAM,
            }}
          />
          <Stack.Screen
            name="ReportByEmployee"
            component={ReportByEmployee}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.REPORT,
            }}
          />
          <Stack.Screen
            name="AllServiceman"
            component={AllServiceman}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.ALL_SERVICEMAN,
            }}
          />
          <Stack.Screen
            name="Serviceman Location"
            component={ServicemanLocation}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerTitle: strings.LOCATION,
            }}
          />
          <Stack.Screen
            name="Edit Manufacturing"
            component={EditManufacturing}
            options={{
              headerTitle: strings.EDIT_MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Create Manufacturing"
            component={CreateManufacturing}
            options={{
              headerTitle: strings.CREATE_MANUFACTURING,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Manufacturing Details"
            component={ManufacturingDetails}
            options={{
              headerTitle: strings.MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              // headerRight: () => <HeaderButton route="Create Manufacturing" />,
            }}
          />
          <Stack.Screen
            name="EditManufacturingByStore"
            component={EditManufacturingByStore}
            options={{
              headerTitle: strings.EDIT_MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="EditManufacturingByEmployee"
            component={EditManufacturingByEmployee}
            options={{
              headerTitle: strings.EDIT_MANUFACTURING_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="AddManufacturingByStore"
            component={AddManufacturingByStore}
            options={{
              headerTitle: strings.CREATE_MANUFACTURING,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="AddManufacturingByEmployee"
            component={AddManufacturingByEmployee}
            options={{
              headerTitle: strings.CREATE_MANUFACTURING,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="All Drivers"
            component={AllDrivers}
            options={{
              headerTitle: strings.DRIVER_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />


<Stack.Screen
            name="StoreBarcodeScan"
            component={StoreBarcodeScan}
            options={{
              headerTitle: strings.SCANNER,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
<Stack.Screen
            name="BarcodeScanner"
            component={BarcodeScanner}
            options={{
              headerTitle: strings.SCANNER,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />

          <Stack.Screen
            name="Driver Payment"
            component={DriverPayment}
            options={{
              headerTitle: strings.PAYMENT_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />

<Stack.Screen
            name="AddStock"
            component={AddStock}
            options={{
              headerTitle: strings.ADD_STOCK,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StockDetails"
            component={StockDetails}
            options={{
              headerTitle: strings.STOCK_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="AddStock" />,
            }}
          />


<Stack.Screen
            name="AddStockByStore"
            component={AddStockByStore}
            options={{
              headerTitle: strings.ADD_STOCK,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StockDetailsByStore"
            component={StockDetailsByStore}
            options={{
              headerTitle: strings.STOCK_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Product" />,
            }}
          />



<Stack.Screen
            name="AddStockByEmployee"
            component={AddStockByEmployee}
            options={{
              headerTitle: strings.ADD_STOCK,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StockDetailsByEmployee"
            component={StockDetailsByEmployee}
            options={{
              headerTitle: strings.STOCK_DETAILS,
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
              headerRight: () => <HeaderButton route="Create Product" />,
            }}
          />
          <Stack.Screen
            name="Distribute Stock"
            component={DistributeStock}
            options={{
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="Stock Details"
            component={ViewStockDetailsByStore}
            options={{
              headerTitle: 'Stock Detail',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="Add Products"
            component={AddProduct}
            options={{
              headerTitle: 'Add Product',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
            <Stack.Screen
            name="Add Raw Material"
            component={CreateStoreRawMaterial}
            options={{
              headerTitle: 'Add Raw Material',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="AddProductByEmployee"
            component={AddProductByEmployee}
            options={{
              headerTitle: 'Add Product',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
            <Stack.Screen
            name="AddRawMaterialByEmployee"
            component={CreateEmployeeRawMaterial}
            options={{
              headerTitle: 'Add Raw Material',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="ServicemanStock"
            component={ServicemanStock}
            options={{
              headerTitle: 'All Serviceman',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="StockMaterialofServiceman"
            component={StockMaterialofServiceman}
            options={{
              headerTitle: 'Stock',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="AddStockofManufacturing"
            component={AddStockofManufacturing}
            options={{
              headerTitle: 'Stock',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="AddStockofManufacturingByStore"
            component={AddStockofManufacturingByStore}
            options={{
              headerTitle: 'Stock',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
           <Stack.Screen
            name="AddStockofManufacturingByEmployee"
            component={AddStockofManufacturingByEmployee}
            options={{
              headerTitle: 'Stock',
              headerStyle: {backgroundColor: COLORS.btnColor},
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18,
              },
            }}
          />
        </Stack.Navigator>
        <AppNetInfo />
      </NavigationContainer>
    </Provider>
  );
}
