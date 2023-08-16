/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {Dropdown} from 'react-native-element-dropdown';
import SweetAlert from 'react-native-sweet-alert';
import {
  getData,
  deleteData,
  putDataAxios,
  ServerURL,
} from '../../Connection/FetchServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import {RadioButton} from 'react-native-paper';
import {getStoreData} from '../../storage/AsyncStorage';
import {Appearance} from 'react-native';

const {width, height} = Dimensions.get('window');
export default function EditRawMaterialByEmployee({navigation, route}) {
  const [inputs, setInputs] = useState({
    productname: '',
    quantity: '',
    vendors_id: '',
    price: '',
    offerprice: '',
    status: '',
  });
  const [error, setError] = useState({});
  const [vendor, setVendor] = useState([]);
  const [isFocusVendor, setIsFocusVendor] = useState(false);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const handleQuantityChange = text => {
    setInputs(prev => ({...prev, quantity: text}));
  };

  const validate = () => {
    var isValid = true;   
    if (!inputs.productname) {
      handleErrors('Please Input Product Name', 'productname');
      isValid = false;
    } else if (inputs.productname.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.productname)) {
        handleErrors('Please Input valid product name', 'productname');
        isValid = false;
      }
      console.log('here');
    }
    if (!inputs.price) {
      handleErrors('Please Input Price', 'price');
      isValid = false;
    } else if (inputs.price.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.price)) {
        handleErrors('Please Input valid price', 'price');
        isValid = false;
      }
      console.log('1');
    }

    if (!inputs.offerprice) {
      handleErrors('Please Input Offerprice', 'offerprice');
      isValid = false;
    } else if (inputs.offerprice.length) {
      const regex = new RegExp(
        /([0-9]{1,9})[,]*([0-9]{3,3})*[,]*([0-9]{1,3})*[.]*([0-9]{2,2})*/,
      );
      if (!regex.test(inputs.offerprice)) {
        handleErrors('Please Input valid offerprice', 'offerprice');
        isValid = false;
      }
      console.log('1');
    }
    return isValid;
  };

  const [filePath, setFilePath] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Write permission err', err);
      }
      return false;
    } else {
      return true;
    }
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, 
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      } else {
        const source = {
          base64: 'data:image/jpeg;base64,' + response.assets[0].base64,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        };
        setFilePath(source);
      }
    });
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      setFilePath(response);
    });
  };

  const [checked, setChecked] = React.useState('first');
  const [loader, setLoader] = useState(true);

  const handleDelete = async () => {
    const result = await deleteData('rawmaterial/' + route.params.id);

    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.DELETED_SUCCESSFULLY,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'success',
        cancellable: true,
      });
      navigation.goBack();
    } else {
      SweetAlert.showAlertWithOptions({
        title: strings.SERVER_ERROR,
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      });
    }
  };
  const askDelete = () => {
    Alert.alert('Warning !', 'Are you sure want to delete', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => handleDelete(),
      },
    ]);

  };
  const fetchRawmaterial = async () => {
    setLoader(true);
    var result = await getData('rawmaterial/' + route.params.id);
    if (result.status) {
      setInputs({
        productname: result.data.product_name,
        quantity: result.data.quantity,
        vendors_id: result.data.vendor_id,
        price: String(result.data.price),
        offerprice: String(result.data.offerprice),
        picture: result.data.picture,
        status: result.data.status,
      });
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchRawmaterial();
      fetchVendor();
      selectedLng();
    },
    [isFocused],
  );

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const st = await getStoreData('EMPLOYEE');
    if (validate()) {
      let formdata = new FormData();
      formdata.append('product_name', inputs.productname);
      formdata.append('quantity', inputs.quantity);
      formdata.append('vendor_id', inputs.vendors_id);
      formdata.append('price', inputs.price);
      formdata.append('offerprice', inputs.offerprice);
      formdata.append('status', inputs.status);
      formdata.append('added_by', st.name);
      if (filePath) {
        formdata.append('picture', {
          ...filePath,
        });
      }
    setHideButton(true)
      const result = await putDataAxios(
        'rawmaterial/' + route.params.id,
        formdata,
      );
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.RAW_MATERIAL_EDITED_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
        navigation.goBack();
      } else {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVER_ERROR,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'error',
          cancellable: true,
        });
      }
    }
    setHideButton(false)
  };

  const fetchVendor = async () => {
    const result = await getData('vendor/display/active');
    console.log(result);
    setVendor(result.data);
  };
  const VendorDropdownComponent = vendors_id => {
    return (
      <View>
        {/* {renderLabel()} */}
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'Poppins-Bold',
            textAlign: 'left',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}>
          {strings.VENDOR}
        </Text>
        <Dropdown
          style={{
            height: 50,
            width: width * 0.9,
            borderColor: 'white',
            borderRadius: 8,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            padding: 8,
          }}
          placeholderStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          selectedTextStyle={{
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          iconStyle={styles.iconStyle}
          itemTextStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            color: theme == 'light' ? '#2C2C2C' : '#fff',
          }}
          containerStyle={{
            flex: 1,
            backgroundColor: theme == 'light' ? '#ecf0f1' : '#2C2C2C',
            borderRadius: 20,
            marginTop: -60,
            padding: 10,
            fontFamily: 'Poppins-Medium',
          }}
          data={vendor}
          search
          maxHeight={200}
          labelField="firm_name"
          valueField="vendors_id"
          placeholder={
            inputs.vendors_id
              ? vendor.filter(item => item.vendors_id == inputs.vendors_id)?.[0]
                  ?.firm_name
              : !isFocusVendor
              ? strings.SELECT_VENDOR
              : '...'
          }
          searchPlaceholder="Search..."
          value={inputs.vendors_id}
          onFocus={() => setIsFocusVendor(true)}
          onBlur={() => setIsFocusVendor(false)}
          onChange={item => {
            handleValues(item.vendors_id, 'vendors_id');
            setIsFocusVendor(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusVendor}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

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
      <ScrollView style={{flex: 1}}>
        <>
          {loader ? (
            <AnimatedLottieView
              source={require('../../assets/TallyBudy Loader.json')}
              autoPlay
              loop
              style={{
                height: 100,
                alignSelf: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginLeft: 20,
                  paddingTop: 10,
                  paddingLeft: 5,
                }}>
                {strings.EDIT_RAW_MATERIAL_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <View style={{marginTop: 10}}>{VendorDropdownComponent()}</View>
                <Input
                  error={error.productname}
                  onFocus={() => handleErrors(null, 'productname')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'productname')}
                  placeholder={strings.PRODUCT_NAME}
                  value={inputs.productname}
                  autoCompleteType="off"
                  simpleLineIcons="user"
                  labelTxt={strings.PRODUCT_NAME}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.price}
                  onFocus={() => handleErrors(null, 'price')}
                  onChangeText={txt => handleValues(txt, 'price')}
                  placeholder={strings.PRICE}
                  value={inputs.price}
                  autoCompleteType="off"
                  fontAwesome="rupee"
                  labelTxt={strings.PRICE}
                  keyboardType="numeric"
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
                <Input
                  error={error.offerprice}
                  onFocus={() => handleErrors(null, 'offerprice')}
                  onChangeText={txt => handleValues(txt, 'offerprice')}
                  placeholder={strings.OFFER_PRICE}
                  value={inputs.offerprice}
                  autoCompleteType="off"
                  keyboardType="numeric"
                  fontAwesome="percent"
                  labelTxt={strings.OFFER_PRICE}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                  paddingTop: 15,
                  marginLeft: width * 0.05,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    alignItems: 'center',
                    fontSize: 12,
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                  }}>
                  {strings.QUANTITY}:
                </Text>

                <View style={{marginLeft: 5}}>
                  <NumericInput
                    totalWidth={120}
                    totalHeight={35}
                    minValue={1}
                    maxValue={999}
                    onChange={txt => handleQuantityChange(txt)}
                    value={Number(inputs.quantity)}
                    valueType="real"
                    rounded
                    textColor={theme == 'light' ? 'black' : 'white'}
                    iconStyle={'black'}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: 'Poppins-Bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    fontSize: 16,
                    marginLeft: width * 0.06,
                  }}>
                  {strings.STATUS}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    marginLeft: width * 0.05,
                  }}>
                  <RadioButton
                    value="1"
                    status={
                      checked == '1' || inputs.status == '1'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => {
                      setChecked('1');
                      handleValues('1', 'status');
                    }}
                  />
                  <Text
                    style={{
                      marginRight: 50,
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                    }}>
                    {strings.YES}
                  </Text>
                  <RadioButton
                    value="2"
                    status={
                      checked == '2' || inputs.status == '2'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => {
                      setChecked('2');
                      handleValues('2', 'status');
                    }}
                  />
                  <Text style={{color: theme == 'light' ? '#2C2C2C' : '#fff'}}>
                    {strings.NO}
                  </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name={'camera'}
                    size={50}
                    color="#4171E1"
                    buttonText={'Select File'}
                    bgColor="#95a5a6"
                    btnWidth={0.4}
                    marginTop={20}
                    onPress={() => captureImage('photo')}
                  />
                  <Text
                    style={{
                      color: '#4171E1',
                      fontSize: 16,
                      marginTop: 20,
                    }}>
                    {strings.TAKE_PICTURE}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  {filePath ? (
                    <Image
                      source={{uri: filePath.uri}}
                      style={{width: 100, height: 100}}
                    />
                  ) : (
                    <Image
                      source={{uri: `${ServerURL}/images/${inputs.picture}`}}
                      style={{width: 100, height: 100}}
                    />
                  )}
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
              {hideButton?
              ( <AppButton
                buttonText={strings.EDIT}
                bgColor={COLORS.disable}
              />
              ) :(
                <AppButton
                onPress={handleEdit}
                buttonText={strings.EDIT}
                bgColor={COLORS.btnColor}
              />
              )}
                {/* <AppButton onPress={askDelete} buttonText={strings.DELETE} /> */}
              </View>
              <View style={{marginTop: 10}} />
            </View>
          )}
        </>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: width * 0.9,
    borderColor: COLORS.inputColor,
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
    padding: 8,
  },
  icon: {
    color: COLORS.btnColor,
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
