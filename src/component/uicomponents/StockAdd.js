/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Appearance,
} from 'react-native';
import COLORS from '../helper/Colors';
import Ion from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {getData} from '../Connection/FetchServices';
import Input from './Input';
import strings from '../../changeLanguage/LocalizedString';
import ShortInputs from './ShortInputs';

import {useIsFocused} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

export default function StockAdd(props) {
  // alert(JSON.stringify(props.error))
  const isFocused = useIsFocused();
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [product, setProduct] = useState([]);
  const [error, setError] = useState({});
  const {stocklist, setStockList, item, index, navigation} = props;

  const [theme, setTheme] = useState(Appearance.getColorScheme());
  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };
  const fetchCategory = async category_id => {
    const result = await getData('category', {category_id: category_id});
    setCategory(result.data);
  };
  const fetchBrand = async category_id => {
    const result = await getData('brand/byCategory/' + category_id);
    setBrand(result.data);
    console.log('Brand', result.data);
  };

  const fetchModel = async brand_id => {
    const result = await getData('model/byBrand/' + brand_id);
    setModel(result.data);
    console.log('model', result.data);
  };

  const fetchProduct = async model_id => {
    const result = await getData('product/byModel/' + model_id);
    setProduct(result.data);
    console.log('product', result.data);
    // alert(JSON.stringify(result))
  };
  const handleCategoryId = (item, index) => {
    const data = [...stocklist];
    // alert(JSON.stringify(index));
    data[index]['categoryid'] = item;
    if (item != '') {
      fetchBrand(item);
      setModel([]);
      setProduct([]);
      data[index].modelid = '';
      data[index].productid = '';
    } else {
      setBrand([]);
      setModel([]);
      setProduct([]);
      data[index].modelid = '';
      data[index].brandid = '';
      data[index].productid = '';
    }
    setStockList([...data]);
  };
  const handleBrandId = (item, index) => {
    const data = [...stocklist];
    data[index].brandid = item;
    setStockList([...data]);
    if (item != '') fetchModel(item);
  };
  const handleModelId = (item, index) => {
    const data = [...stocklist];
    data[index].modelid = item;
    setStockList([...data]);
    if (item != '') fetchProduct(item);
  };
  const handleProductId = (item, index) => {
    const data = [...stocklist];
    data[index].productid = item;
    setStockList([...data]);
  };

  useEffect(function () {
    fetchCategory();
  }, []);

  const handleInputMrp = (index, text) => {
    const newInput = [...stocklist];
    newInput[index].totalamount = text;
    setStockList(newInput);
  };

  const handleInputStock = (index, text) => {
    const newInputs = [...stocklist];
    newInputs[index].stock = text;
    setStockList(newInputs);
  };

  return (
    <>
      {error.category_id ? (
        <>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 0.9,
              }}>
              <Picker
                selectedValue={item.categoryid}
                style={{
                  height: 50,
                  width: width * 0.9,
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleCategoryId(itemValue, index);
                }}>
                <Picker.Item label={'-Select Category-'} value={''} />
                {category?.map(itm => {
                  return (
                    <Picker.Item label={itm.name} value={itm.category_id} />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-SemiBold',
                color: 'red',
                marginRight: width * 0.57,
              }}>
              {error.category_id}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: width * 0.9,
            }}>
            <Picker
              selectedValue={item.categoryid}
              style={{
                height: 50,
                width: width * 0.9,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
                handleCategoryId(itemValue, index);
              }}>
              <Picker.Item label={'-Select Category-'} value={''} />
              {category?.map(itm => {
                return <Picker.Item label={itm.name} value={itm.category_id} />;
              })}
            </Picker>
          </View>
        </View>
      )}
      {error.brand_id ? (
        <>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 0.9,
              }}>
              <Picker
                selectedValue={item.brandid}
                style={{
                  height: 50,
                  width: width * 0.9,
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleBrandId(itemValue, index);
                }}>
                <Picker.Item label={'-Select Brand-'} value={''} />
                {brand?.map(itm => {
                  return (
                    <Picker.Item label={itm.brand_name} value={itm.brand_id} />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-SemiBold',
                color: 'red',
                marginRight: width * 0.6,
              }}>
              {error.brand_id}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: width * 0.9,
            }}>
            <Picker
              selectedValue={item.brandid}
              style={{
                height: 50,
                width: width * 0.9,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
                handleBrandId(itemValue, index);
              }}>
              <Picker.Item label={'-Select Brand-'} value={''} />
              {brand?.map(itm => {
                return (
                  <Picker.Item label={itm.brand_name} value={itm.brand_id} />
                );
              })}
            </Picker>
          </View>
        </View>
      )}
      {error.model_id ? (
        <>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 0.9,
                margin: 5,
              }}>
              <Picker
                selectedValue={item.modelid}
                style={{
                  height: 50,
                  width: width * 0.9,
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleModelId(itemValue, index);
                }}>
                <Picker.Item label={'-Select Model-'} value={''} />
                {model?.map(itm => {
                  return <Picker.Item label={itm.name} value={itm.model_id} />;
                })}
              </Picker>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-SemiBold',
                color: 'red',
                marginRight: width * 0.6,
              }}>
              {error.model_id}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: width * 0.9,
            }}>
            <Picker
              selectedValue={item.modelid}
              style={{
                height: 50,
                width: width * 0.9,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
                handleModelId(itemValue, index);
              }}>
              <Picker.Item label={'-Select Model-'} value={''} />
              {model?.map(itm => {
                return <Picker.Item label={itm.name} value={itm.model_id} />;
              })}
            </Picker>
          </View>
        </View>
      )}
      {error.product_id ? (
        <>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: width * 0.9,
                margin: 5,
              }}>
              <Picker
                selectedValue={item.productid}
                style={{
                  height: 50,
                  width: width * 0.9,
                  backgroundColor:
                    theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                }}
                onValueChange={itemValue => {
                  handleProductId(itemValue, index);
                }}>
                <Picker.Item label={'-Select Product-'} value={''} />
                {product?.map(itm => {
                  return (
                    <Picker.Item
                      label={itm.product_name}
                      value={itm.product_id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Poppins-SemiBold',
                color: 'red',
                marginRight: width * 0.6,
              }}>
              {error.product_id}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: width * 0.9,
            }}>
            <Picker
              selectedValue={item.productid}
              style={{
                height: 50,
                width: width * 0.9,
                backgroundColor:
                  theme == 'light' ? COLORS.inputColor : '#2C2C2C',
              }}
              onValueChange={itemValue => {
                handleProductId(itemValue, index);
              }}>
              <Picker.Item label={'-Select Product-'} value={''} />
              {product?.map(itm => {
                return (
                  <Picker.Item
                    label={itm.product_name}
                    value={itm.product_id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      )}
      <Input
        error={error.stock}
        onFocus={() => handleErrors(null, 'stock')}
        placeholder={strings.STOCK}
        autoCompleteType="off"
        keyboardType="numeric"
        fontAwesome="cubes"
        onChangeText={txt => handleInputStock(index, txt)}
        placeholderTextColor={theme == 'light' ? 'black' : 'white'}
      />
      {/* {item.color?.map((item, index) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: width * 0.9,
          }}>
          <ShortInputs
            error={error.color}
            onFocus={() => handleErrors(null, 'color')}
            placeholder={strings.COLOR}
            onChangeText={text => handleColorInputChange(index, text)}
            value={item.color}
            contWidth={width * 0.554}
            materialIcons="color-lens"
          />
          <ShortInputs
            error={error.stock}
            onFocus={() => handleErrors(null, 'stock')}
            placeholder={strings.STOCK}
            onChangeText={text => handleStockChange(index, text)}
            value={item.stock}
            contWidth={width * 0.554}
            fontAwesome="cubes"
          />
        </View>
      ))} */}
      <Input
        error={error.mrp}
        onFocus={() => handleErrors(null, 'totalamount')}
        onChangeText={txt => handleInputMrp(index, txt)}
        placeholder={strings.MRP}
        keyboardType="numeric"
        autoCompleteType="off"
        fontAwesome="rupee"
        placeholderTextColor={theme == 'light' ? 'black' : 'white'}
      />
    </>
  );
}
