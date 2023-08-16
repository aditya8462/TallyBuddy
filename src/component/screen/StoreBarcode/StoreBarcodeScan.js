import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Appearance,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ServerURL, getData} from '../../Connection/FetchServices';
import Input from '../../uicomponents/Input';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import AppButtons from '../../uicomponents/AppButtons';
import SweetAlert from 'react-native-sweet-alert';
import RBSheet from 'react-native-raw-bottom-sheet';
import {InputMode} from 'react-native-paper/lib/typescript/src/components/TextInput/Adornment/enums';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ENT from 'react-native-vector-icons/Entypo';
import MCI from 'react-native-vector-icons/FontAwesome';
import MC from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../helper/Colors';

const {height, width} = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const scanBarWidth = SCREEN_WIDTH * 0.46;

export default function StoreBarcodeScan({navigation, route}) {
  const [data, setData] = useState({});
  const [input, setInput] = useState('');
  const [category, setCategory] = useState([]);
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const refRBSheet2 = useRef();

  // alert(JSON.stringify(category));

  const Boxes = ({item}) => {
    return (
        <View
          style={{
            marginHorizontal: 5,
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 5,
            borderWidth: 0.7,
            borderColor: '#f2f2f2',
            paddingBottom: 3,
            paddingRight: 2,
            backgroundColor: theme == 'light' ? '#f5f6fa' : '#2C2C2C',
            shadowColor: '#000000',
            alignItems: 'center',
            shadowOpacity: 0.8,
            height:110,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1,
            },
          }}>
          <View
            style={{
              padding: 5,
              paddingLeft: 8,
              flexDirection: 'row',
              borderRadius: 10,
            }}>
            <TouchableOpacity onPress={() => handleImagePress(item)}>
            <FastImage
               source={{uri: `${ServerURL}/images/${item.picture}`,priority: FastImage.priority.normal}}
              style={{
                width: 100,
                height: '99%',
                resizeMode: 'contain',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: theme == 'light' ? '#000' : 'white',
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            </TouchableOpacity>
            <View
              style={{
                marginTop: 4,
                marginLeft: 10,
                width: width * 0.35,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="category"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.category_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ENT
                  name="price-tag"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.brand_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MCI
                  name="cubes"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: theme == 'light' ? '#000' : 'white',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.model_name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="color-lens"
                  size={14}
                  style={{
                    color: theme == 'light' ? COLORS.btnColor : 'white',
                    padding: 1,
                  }}
                />
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    // color: item.store_name ? '#2C2C2C' : 'red',
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                    justifyContent: 'center',
                  }}>
                  {item.color}
                </Text>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: height * 0.02,
                marginLeft: width * 0.02,
              }}>
              <AppButtons
                onPress={() =>
                  navigation.navigate('StoreBarcodeDetails', {
                    id: item.product_id,
                  })
                }
                buttonText={strings.ADD_TO_CART}
              />
            </View>
          </View>
        </View>
    );
  };

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const onSuccess = async id => {
    const result = await getData('product/' + id.data);
    if (result.status) {
      // console.log(result);
      setData(result.data);
      
      navigation.navigate('StoreBarcodeDetails', {id: id.data});
    }
  };

  const isFocused = useIsFocused();
  const [inputs, setInputs] = useState({
    input: '',
  });

  const [error, setError] = useState({});
  useEffect(() => {
    selectedLng();
  }, [isFocused]);
  const validate = () => {
    var isValid = true;
    if (!inputs.input) {
      handleErrors('Please Type Model Name', 'input');
      isValid = false;
    }

    return isValid;
  };
  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleShowProduct = async id => {
    if (validate()) {
      var result = await getData('product/find/' + inputs.input);
      if (result.status) {
        setCategory(result.data);
        refRBSheet2.current.open();
        // navigation.navigate('Barcode Details', {
        //   id: result.data.product_id,
        // });
      } else {
        SweetAlert.showAlertWithOptions({
          title: 'Not Found',
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
        });
      }
    }
  };

  const handleImagePress = item => {
    navigation.navigate('ImageSelected', {imgp: item});
  };
  return (
    <ImageBackground
      source={require('../../../component/assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <QRCodeScanner
        onRead={e => onSuccess(e)}
        reactivate={true}
        cameraStyle={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          marginTop: -(height * 0.1),
        }}
        cameraProps={{captureAudio: false}}
        bottomContent={
          <KeyboardAvoidingView behavior="padding">
            <View style={{marginTop: -(height * 0.06)}}>
              <Input
                placeholder={strings.MODEL_NAME}
                autoCompleteType="off"
                fontAwesome="cubes"
                value={input}
                onFocus={() => handleErrors(null, 'input')}
                onChangeText={txt => handleValues(txt, 'input')}
                error={error.input}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <AppButtons
                onPress={() => handleShowProduct()}
                buttonText={strings.SEARCH_PRODUCT}
              />
            </View>
            <RBSheet
              ref={refRBSheet2}
              height={450}
              openDuration={250}
              closeDuration={80}
              customStyles={{
                container: {
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                },
              }}>
              <View
                style={{
                  flex: 1,
                  height: height * 0.5,
                  backgroundColor: theme == 'light' ? 'white' : 'black',
                }}>
                <FlatList
                  data={category}
                  renderItem={({item}) => <Boxes item={item} />}
                  keyExtractor={item => item.id}
                />
                {/* <Text style={{fontSize:20}}>hiiiii</Text> */}
              </View>
            </RBSheet>
          </KeyboardAvoidingView>
        }
      />
    </ImageBackground>
  );
}
