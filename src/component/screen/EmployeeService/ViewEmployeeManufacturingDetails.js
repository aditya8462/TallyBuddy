
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  Text,
  ImageBackground,
  Appearance,
  TouchableOpacity,
  RefreshControl,
  ScrollView
} from 'react-native';
import {ServerURL, getData} from '../../Connection/FetchServices';
import {useIsFocused} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import Entypo from 'react-native-vector-icons/Entypo';
import FA from 'react-native-vector-icons/FontAwesome';
import MI from 'react-native-vector-icons/MaterialIcons';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import COLORS from '../../helper/Colors';



const {height, width} = Dimensions.get('window');

export default function ViewEmployeeManufacturingDetails({navigation, route}) {
  const [products, setProducts] = useState({});
  const [loader, setLoader] = useState(true);
  const [rawmaterialList, setRawmaterialList] = useState({});
  const isFocused = useIsFocused();

  const [subItemList, setSubItemList] = useState({});
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };
  const fetchProduct = async () => {
    setLoader(true);
    var result = await getData('manufacturing/' + route.params.id);
    if (result.status) {
      setProducts(result.data);
      setRawmaterialList(result.data.rawmateriallist);

      setSubItemList(result.data.subitemlist);
    }
    setLoader(false);
    console.log(result);

    console.log(setProducts);
  };

  useEffect(
    function () {
      fetchProduct();
      selectedLng();
    },
    [],
  );

  const Boxes = ({item}) => {
    return (
      <View style={{flexDirection:'column',backgroundColor:COLORS.btnColor}}>
      <View style={{backgroundColor:'white',borderBottomLeftRadius:height*0.1}}>
      <View style={{backgroundColor:COLORS.btnColor,height:height*0.32,borderBottomRightRadius:height*0.1}}>
      <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image
               source={{uri: `${ServerURL}/images/${products.picture}`}}
               style={{
                 borderRadius: 15,
                 borderWidth: 3,
                 borderColor: 'white',
                 width: width * 0.4,
                 height: height * 0.18,
                 elevation: 10,
                 alignSelf: 'center',
                 marginTop: height*0.05,
               }}
               resizeMode="cover"
             />
             </TouchableOpacity>
      </View> 
      </View>

      <View style={{backgroundColor:'#0652DD',borderTopLeftRadius:height*0.1}}>
      <View style={{backgroundColor:'white',height:height,borderTopLeftRadius:height*0.1}}>
        <View style={{padding:height*0.015,paddingLeft:height*0.06}}>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <MI
                  name="category"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 0.5,
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                {strings.CATEGORY}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                {item.category_name}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <Entypo
                  name="price-tag"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                   paddingTop:5
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.BRAND}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.brand_name}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <FA
                  name="cubes"
                  size={28}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                    paddingTop:6
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.MODEL}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.model_name}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <MI
                  name="supervised-user-circle"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    paddingTop:5
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                {strings.VENDOR}
               </Text>
               <View style={{flexDirection: 'row', alignItems: 'center'}}></View>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.vendor_name}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <FA
                  name="money"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1.3,
                    paddingTop:7
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                {strings.OFFER_PRICE}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.costprice}
               </Text>
               </View>
               </View>
               <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <FA
                  name="rupee"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 7,
                    paddingLeft:12
                  }}
                />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.PRICE}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.mrp}
               </Text>
               </View>
               </View>
               {item.subitemscount ? ( <View style={{backgroundColor:COLORS.inputColor,borderRadius:20,width:width*0.8,height:height*0.08,padding:height*0.012,flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
               <View style={{marginLeft:width*0.02,backgroundColor:COLORS.grey,borderRadius:15,width:width*0.09,height:height*0.05}}>
               <FA5
                          name="sort-amount-up-alt"
                          size={32}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            padding: 1,
                          }} />
                </View>
                <View style={{marginLeft:width*0.03}}><Text
                 style={{
                   fontSize: 16,
                   color: '#000',
                   fontFamily: 'Poppins-Bold',
                 }}>
                 {strings.SUB_ITEMS_QUANTITY}
               </Text>
               <Text
                 numberOfLines={1}
                 adjustsFontSizeToFit
                 style={{
                   fontSize: 14,
                   color: '#000',
                   fontFamily: 'Poppins-Medium',
                 }}>
                 {item.subitemscount}
               </Text>
               </View>
               </View>):null}
               {item?.subitemlist?.map(item => {
                return(
                  <><View>
                    <Text style={{ marginLeft:5,fontSize:14,fontFamily:'Poppins-Bold',color:'#000',marginTop:5 }}>{strings.SUB_ITEMS}</Text>
                  </View>
                  <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
                        <MI
                          name="menu"
                          size={32}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            // padding: 1,
                          }} />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.SUB_ITEMS_NAME}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {item.productname}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center' }}>
                        <FA5
                          name="sort-amount-up-alt"
                          size={32}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            padding: 1,
                          }} />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.QUANTITY}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {item.quantity}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center' }}>
                      <FA
                  name="rupee"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 7,
                    paddingLeft:12
                  }}
                />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.SUB_ITEMS_PRICE}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {item.costprice}.00
                        </Text>
                      </View>
                    </View>
                    </>
                )
              })}

{item?.rawmateriallist?.map(itm =>{
                return(
                  <>
                  <View>
                  <Text style={{marginLeft:5,fontSize:14,fontFamily:'Poppins-Bold',color:'#000',marginTop:5}}>{strings.RAW_MATERIAL}</Text>
                  </View>
                  <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center' }}>
                        <FA
                          name="industry"
                          size={26}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            padding: 1,
                          }} />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.RAWMATERIAL_NAME}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {itm.product_name}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center'}}>
                      <FA5
                          name="sort-amount-up-alt"
                          size={32}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            padding: 1,
                          }} />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.QUANTITY} 
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {itm.quantity}
                        </Text>
                      </View>
                    </View>
                  </>
                )
              })}
           
{item.color ? ( 
              <View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{  backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center' }}>
                        <MI
                          name="format-color-fill"
                          size={32}
                          style={{
                            color: theme == 'light' ? COLORS.btnColor : 'white',
                            padding: 1,
                          }} />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.COLOR}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {item.color}
                        </Text>
                      </View>
                    </View>):null}

                    {item.store_name ? (<View style={{ backgroundColor: COLORS.inputColor, borderRadius: 20, width: width * 0.8, height: height * 0.09, padding: height * 0.012, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <View style={{ marginLeft: width * 0.02, backgroundColor: COLORS.grey, borderRadius: 15,width:width*0.1,height:height*0.05,alignItems:'center' }}>
                      <Entypo
                  name="shop"
                  size={32}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 3,
                    paddingTop:5
                  }}
                />
                      </View>
                      <View style={{ marginLeft: width * 0.03 }}><Text
                        style={{
                          fontSize: 16,
                          color: '#000',
                          fontFamily: 'Poppins-Bold',
                        }}>
                       {strings.STORE}
                      </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Poppins-Medium',
                          }}>
                           {item.store_name}
                        </Text>
                      </View>
                    </View>):null}
               </View>
      </View>
      </View>
      </View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchProduct();
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#f5f6fa' : 'black',
      }}>
      <View style={{flex: 1}}>
        <View style={{width: width}}>
        <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
          {loader ? (
            <AnimatedLottieView
              source={require('../../assets/TallyBudy Loader.json')}
              autoPlay
              loop
              style={{height: 100, alignSelf: 'center', display: 'flex'}}
            />
          ) : (
            <>
              <Boxes item={products} />
            </>
          )}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
