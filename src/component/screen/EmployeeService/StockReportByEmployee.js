/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Appearance,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';
import {getData, postData} from '../../Connection/FetchServices';
import {getStoreData} from '../../storage/AsyncStorage';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import COLORS from '../../helper/Colors';
import {Image} from 'react-native-elements';
import AnimatedLottieView from 'lottie-react-native';
import AppButtons from '../../uicomponents/AppButtons';

const {width, height} = Dimensions.get('window');

export default function StockReportByEmployee({route}) {
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const [filterReports, setFilterReports] = useState([]);
  const [category, setCategory] = useState([]);
  const [reports, setReports] = useState({
    tableHead: [
      'Category',
      'Brand',
      'Model',
      'Vendor',
      'Color',
      'Quantity',
      'MRP/Unit',
      'Offer Price',
      'Booked',
      'Available',
      'Manufactured',
    ],
    widthArr: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,1200],
    tableData: [''],
  });
  const [available, setAvailable] = useState({});
  const [model, setModel] = useState([]);
  const [loader, setLoader] = useState(true);
  const [inputs, setInputs] = useState({
    category_id: '',
    model_id: '',
  });

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const fetchReports = async (str = '') => {
    setLoader(true);
    var store = await getStoreData('EMPLOYEE');
    var result = await getData('report/storeStock/' + store.store_id + str);
    // alert("Hii")
    if (result.status) {
      const data = result.data.map(item => {
        return [
          item.category_name || item.productname,
          item.brand_name || '--',
          item.model_name || '--',
          item.vendor_name,
          item.color,
          item.quantity,
          item.mrp,
          item.costprice,
          item.booked,
          item.availablequantity,
          item.manufacturedquantity
        ];
      });
      setAvailable(
        result.data.reduce(
          (acc, item) => {
            acc.booked += Number(item.booked) || 0;
            acc.available += Number( item.availablequantity) || 0;
            return acc;
          },
          {booked: 0, available: 0},
        ),
      );

      setReports(prev => ({...prev, tableData: data}));
      setFilterReports(result.data);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchCategory();
      fetchModel();
      fetchReports();
      selectedLng();
    },
    [isFocused],
  );
  const [filterList, setFilterList] = useState([]);

  const handleValues = (txt, attr) => {
    console.log(txt, attr);
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const fetchFilterList = async () => {
    var result = await postData('services/filterlist');

    if (result.status) {
      setFilterList(result.data);
    }
  };
  const fetchCategory = async category_id => {
    const result = await getData('category/display/active', {
      category_id: category_id,
    });
    setCategory(result.data);
  };

  const fetchModel = async category_id => {
    const result = await getData('model/byCategory/' + category_id);
    setModel(result.data);
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchFilterList();
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchDetail = async id => {
    let data = [];
    if (id == 0) {
      data = [...filterReports];
    } else if (id == 1) {
      data = filterReports.filter(item => item.manufacturing == 1);
    } else {
      data = filterReports.filter(item => item.manufacturing == 0);
    }
    setAvailable(
      data.reduce(
        (acc, item) => {
          acc.booked += Number(item.booked) || 0;
          acc.available += Number( item.availablequantity) || 0;
          return acc;F
        },
        {booked: 0, available: 0},
      ),
    );
    data = data.map(item => {
      return [
        item.category_name || item.productname,
        item.brand_name || '--',
        item.model_name || '--',
        item.vendor_name,
        item.color,
        item.quantity || 1,
        item.mrp,
        item.costprice,
        item.booked,
        item.availablequantity,
        item.manufacturedquantity
      ];
    });
    setReports(prev => ({...prev, tableData: data}));
  };

  const FilterDates = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.25,
          backgroundColor: theme == 'light' ? '#fff' : 'black',
          borderRadius: 9,
          borderColor: '#d2d2d2',
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          height: height * 0.045,
          marginLeft: width * 0.02,
          marginTop: height * 0.01,
          elevation: 1.5,
        }}
        onPress={() => {
          fetchDetail(item.name);
        }}>
        <Text
          style={{
            color: theme == 'light' ? '#2C2C2C' : '#fff',
            fontSize: 12,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {item.key}
        </Text>
      </TouchableOpacity>
    );
  };

  const [categorylist, setCategoryList] = useState('');
  const handleCategory = itemValue => {
    setCategoryList(itemValue);
    fetchModel(itemValue);
    fetchReports('?categoryid=' + itemValue);
  };
  const [modellist, setModelList] = useState('');
  const handleModel = itemValue => {
    setModelList(itemValue);
    fetchReports('?modelid=' + itemValue);
  };

  const headerHeight = 40;
  const leftColumnWidth = 700;

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <View style={styles.container}>
        {/* <View style={{margin: 5}}>
            <Text style={{fontFamily: 'Poppins-Medium', color: '#000'}}>
              Products Report
            </Text>
          </View> */}

        <View
          style={{
            marginTop: 10,
            width: width * 0.9,
            alignSelf: 'center',
          }}>
          <View style={{alignSelf: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 1.5,
                margin: 5,
              }}>
              <Picker
                selectedValue={categorylist}
                style={{
                  height: 50,
                  width: '60%',
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleCategory(itemValue);
                }}>
                <Picker.Item label={'-Select Category-'} value={''} />
                {category.map(itm => {
                  return (
                    <Picker.Item label={itm.name} value={itm.category_id} />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            width: width * 0.9,
            alignSelf: 'center',
          }}>
          <View style={{alignSelf: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 1.5,
                margin: 5,
              }}>
              <Picker
                selectedValue={modellist}
                style={{
                  height: 50,
                  width: '60%',
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleModel(itemValue);
                }}>
                <Picker.Item label={'-Select Model-'} value={''} />
                {model?.map(itm => {
                  return <Picker.Item label={itm.name} value={itm.model_id} />;
                })}
              </Picker>
            </View>
          </View>
        </View>

        <View style={{padding: 5, marginBottom: height * 0.15}}>
          <View style={{paddingBottom: 10}}>
            <FlatList
              data={[
                {key: strings.ALL, name: 0},
                {key: strings.MANUFACTURED, name: 1},
                {key: strings.IMPORTED, name: 2},
              ]}
              renderItem={({item}) => <FilterDates item={item} />}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
          <View style={{width: width * 0.15, marginLeft: width * 0.8}}>
            <AppButtons buttonText={'Clear'} onPress={() => fetchReports()} />
          </View>
          <Text
            style={{
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              fontSize: 14,
              fontFamily: 'Poppins-Bold',
            }}>
            Total: {available.available} Booked: {available.booked}
          </Text>
          <ScrollView>
            <ScrollView
              horizontal={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              {loader ? (
                <AnimatedLottieView
                  source={require('../../assets/TallyBudy Loader.json')}
                  autoPlay
                  loop
                  style={{
                    height: 100,
                    alignItems: 'center',
                    marginLeft: width * 0.05,
                    width,
                  }}
                />
              ) : reports.tableData.length != 0 ? (
                <Table borderStyle={{borderWidth: 1, borderColor: '#d0d0d0'}}>
                  <Row
                    data={reports.tableHead}
                    flexArr={[2, 2.2, 2.3, 2, 1.8, 1.6, 2, 2, 1.8]}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={[leftColumnWidth]}
                  />

                  <TableWrapper style={styles.wrapper}>
                    <Rows
                      data={reports.tableData}
                      flexArr={[2, 2.2, 2.3, 2, 1.8, 1.6, 2, 2, 1.8]}
                      style={styles.row}
                      widthArr={[leftColumnWidth]}
                      textStyle={{
                        textAlign: 'center',
                        fontSize: 9,
                        color: theme == 'light' ? '#000' : 'white',
                        fontFamily: 'Poppins-Medium',
                      }}
                    />
                  </TableWrapper>
                </Table>
              ) : theme == 'light' ? (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginLeft: width * 0.25,
                    marginTop: height * 0.05,
                  }}
                />
              ) : (
                <Image
                  source={require('../../assets/NOData.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginLeft: width * 0.25,
                    marginTop: height * 0.05,
                  }}
                />
              )}
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, fontFamily: 'Poppins-Medium'},
  head: {
    height: 40,
    alignSelf: 'center',
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#E9F7FA',
  },
  wrapper: {flexDirection: 'row', marginBottom: height * 0.25},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {
    textAlign: 'center',
    fontSize: 9,
    color: '#4CB3D4',
    fontFamily: 'Poppins-Medium',
  },
  text1: {},
});
