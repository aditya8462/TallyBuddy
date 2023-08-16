/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  ImageBackground,
  Appearance,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {Picker} from '@react-native-picker/picker';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';

import {getData} from '../../Connection/FetchServices';
import strings from '../../../changeLanguage/LocalizedString';
import COLORS from '../../helper/Colors';
import {Image} from 'react-native-elements';
import AnimatedLottieView from 'lottie-react-native';
import { getStoreData } from '../../storage/AsyncStorage';
import { FlatList } from 'react-native';
import AppButtons from '../../uicomponents/AppButtons';
const {width, height} = Dimensions.get('window');

export default function StockReportForServicemen({route}) {
  const [inputs, setInputs] = useState({
    category_id: '',
  });

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [reports, setReports] = useState({
    tableHead: [
      'Category',
      'Brand',
      'Model',
      // 'Vendor',
      'Color',
      'Quantity',
      'MRP/Unit',
      'Offer Price',
      'Available',
    ],
    widthArr: [200, 300, 400, 500, 600, 700, 800, 900, 1000,1100],
    tableData: [''],
  });
  const [loader, setLoader] = useState(true);
  
  const [filterReports, setFilterReports] = useState([]);

  const [category, setCategory] = useState([]);
  const [available, setAvailable] = useState({});


  const [model, setModel] = useState([]);
  
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
 
  
   const fetchReports = async (str = '') => {
    const ser = await getStoreData('SERVICEMAN'); 
    setLoader(true);
     var result = await getData('servicemanstock/byServiceman/' + ser.serviceman_id + str);
     if (result.status) {
       const data = result.data.map(item => {
         return [
           item.category_name || item.productname,
           item.brand_name || '--',
           item.model_name || '--',
          //  item.vendor_name,
           item.color,
           item.quantity || 1,
           item.mrp,
           item.costprice,
           item.availablequantity,
         ];
       });
       setAvailable(
         result.data.reduce(
           (acc, item) => {
             acc.available += Number(item.availablequantity) || 0;
             return acc;
           },
           { available: 0},
         ),
       );
       setReports(prev => ({...prev, tableData: data}));
       setFilterReports(result.data);
     }
     setLoader(false);
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
           acc.available += Number(item.availablequantity) || 0;
           return acc;
         },
         { available: 0},
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
         item.availablequantity,
       ];
     });
     setReports(prev => ({...prev, tableData: data}));
   
   };

  useEffect(function () {
     fetchReports();
    fetchCategory();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchReports();
      setRefreshing(false);
      fetchCategory();

    }, 2000);
  }, []);
  const [categorylist,setCategoryList]=useState('')
  const handleCategory=(itemValue)=>{
    setCategoryList(itemValue)
    fetchModel(itemValue)
    fetchReports('?categoryid=' + itemValue);
    
   }
   const [modellist,setModelList]=useState('')
 const handleModel=(itemValue)=>{
  setModelList(itemValue)
  fetchReports('?modelid=' + itemValue);
 
 }

 const headerHeight = 40;
  const leftColumnWidth = 700;

  // const leftRef = useRef<ScrollView>(null);
  // const rightRef = useRef<ScrollView>(null);

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
        <View style={{flex: 1, fontFamily: 'Poppins-Medium'}}>
         
         <View
          style={{
            width: width * 0.9,
            alignSelf: 'center',
          }}>
            <View style={{alignSelf:'center'}}>
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
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
          }}
          onValueChange={itemValue => {
          handleCategory(itemValue)
          }}>
          <Picker.Item label={'-Select Category-'} value={''} />
          {category.map(itm => {
            return (
              <Picker.Item
                label={itm.name}
                value={itm.category_id}
              />
            );
          })}
        </Picker>
        </View>
        </View>
        </View>
        <View
          style={{
            width: width * 0.9,
            alignSelf: 'center',
          }}>
            <View style={{alignSelf:"center"}}>
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
                backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
              handleModel(itemValue)
              }}>
              <Picker.Item label={'-Select Model-'} value={''} />
              {model?.map(itm => {
                return (
                  <Picker.Item
                    label={itm.name}
                    value={itm.model_id}
                  />
                );
              })}
            </Picker>
            </View>
            </View>
        </View>
          <View style={{marginTop:height*0.02, marginLeft:width*0.06}}>
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
          <View style={{width: width * 0.17, marginLeft: width * 0.7}}>
            <AppButtons buttonText={'Clear'} onPress={() => fetchReports()} />
          </View> 
          <Text style={{color: theme == 'light' ? '#2C2C2C' : '#fff',fontSize: 14,
                          fontFamily:'Poppins-Bold',}}>
              Total: {available.available}
            </Text>
            </View>
            <ScrollView>
            <ScrollView
            horizontal={true}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
          {loader ? (<AnimatedLottieView
        source={require('../../assets/TallyBudy Loader.json')}
        autoPlay
        loop
        style={{height: 100, alignItems: 'center',marginLeft:width*0.05,width}}
      />):
          reports.tableData.length !=0 ? ( <View style={{padding: 5, marginTop: 10,}}>
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
          </View>):theme == 'light' ? (
                <Image
                  source={require('../../assets/No-Data-Found-Image.png')}
                  style={{
                    width: width * 0.5,
                    height: height * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginLeft:width*0.25,
                    marginTop:height*0.05
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
                    marginLeft:width*0.25,
                    marginTop:height*0.05
                  }}
                />
              )}
         </ScrollView>
         </ScrollView>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {},
  head: {
    height: 40,
    alignSelf: 'center',
    fontSize: 12,
    backgroundColor: '#E9F7FA',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  wrapper: {flexDirection: 'row', marginBottom:height*0.25},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {
    textAlign: 'center',
    fontSize: 9,
    color: '#4CB3D4',
    fontFamily: 'Poppins-Medium',
  },
  text1: {},
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderColor: COLORS.inputColor,
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
    padding: 8,
  },
  icon: {
    marginRight: 5,
    color: COLORS.btnColor,
  },
  label: {
    position: 'absolute',
    backgroundColor: COLORS.inputColor,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
