/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import AnimatedLottieView from 'lottie-react-native';
import stateCity from '../stateCity.json';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import Inputs from '../../uicomponents/Inputs';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';
import {Appearance} from 'react-native';
const {height, width} = Dimensions.get('screen');
export default function EditVendor({navigation, route}) {
  const [inputs, setInputs] = useState({
    firmname: '',
    typeoffirm: '',
    country: '',
    gstno: '',
    address: '',
    emailid: '',
    mobileno: '',
    status: '',
    state: '',
    city: '',
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const validate = () => {
    var isValid = true;
    if (!inputs.firmname) {
      handleErrors('Please Input Firm Name', 'firmname');
      isValid = false;
    } else if (inputs.firmname.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.firmname)) {
        handleErrors('Please Input valid firmname', 'firmname');
        isValid = false;
      }
    }

    if (!inputs.typeoffirm) {
      handleErrors('Please Input firm type', 'typeoffirm');
      isValid = false;
    } else if (inputs.typeoffirm.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.typeoffirm)) {
        handleErrors('Please Input valid firm type', 'typeoffirm');
        isValid = false;
      }
    }

    if (!inputs.country) {
      handleErrors('Please Input Country', 'country');
      isValid = false;
    } else if (inputs.country.length) {
      const regex = new RegExp(/^[a-zA-Z ]{5,30}$/);
      if (!regex.test(inputs.country)) {
        handleErrors('Please Input valid Country', 'country');
        isValid = false;
      }
    } 
    if (inputs.gstno.length) {
      if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(inputs.gstno)) {
        handleErrors('Please Input valid Gst no.', 'gstno');
        isValid = false;
      }
      console.log(isValid);
    }
    if (!inputs.address) {
      handleErrors('Please Input Address', 'address');
      isValid = false;
    } else if (inputs.address.length) {
      if (!/^[a-zA-Z0-9\s,.'-]{3,}$/.test(inputs.address)) {
        handleErrors('Please Input Valid Address', 'address');
        isValid = false;
      }
      console.log(isValid);
    }
    if (!inputs.mobileno) {
      handleErrors('Please Input Mobile No.', 'mobileno');
      isValid = false;
    } else if (inputs.mobileno.length) {
      if (isNaN(inputs.mobileno.length) || inputs.mobileno.length < 10) {
        handleErrors('Please Input valid Mobile No.', 'mobileno');
        isValid = false;
      }
    }
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input valid emailid', 'emailid');
        isValid = false;
      }
    }
    console.log(isValid);
    return isValid;
  };

  const states = Object.keys(stateCity);
  const [getCities, setCities] = useState([]);

  const handleState = state => {
    const cities = stateCity[state];
    setCities(cities);
  };


  const [checked, setChecked] = React.useState('first');

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        firm_name: inputs.firmname,
        type_of_firm: inputs.typeoffirm,
        country: inputs.country,
        gstno: inputs.gstno,
        address: inputs.address,
        emailid: inputs.emailid,
        mobileno: inputs.mobileno,
        status: inputs.status,
        state: inputs.state,
        city: inputs.city,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await putData('vendor/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.VENDOR_EDITED_SUCCESSFULLY,
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
  };

  const handleDelete = async () => {
    const result = await deleteData('vendor/' + route.params.id);
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
    setHideButton(false)
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

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const fetchVendorDetails = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('vendor/' + route.params.id);
    console.log(result);
    if (result.status) {
      console.log(result.data.state);
      handleState(result.data.state);
      setInputs({
        firmname: result.data.firm_name,
        typeoffirm: result.data.type_of_firm,
        country: result.data.country,
        gstno: result.data.gstno,
        address: result.data.address,
        emailid: result.data.emailid,
        mobileno: result.data.mobileno,
        status: result.data.status,
        state: result.data.state,
        city: result.data.city,
      });
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchVendorDetails();
      selectedLng();
    },
    [isFocused],
  );

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
      <ScrollView>
        <View style={{flex: 1}}>
          <>
            {loader ? (
              <AnimatedLottieView
                source={require('../../assets/TallyBudy Loader.json')}
                autoPlay
                loop
                style={{height: 100, alignSelf: 'center', display: 'flex'}}
              />
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: theme == 'light' ? '#2C2C2C' : '#fff',
                    marginLeft: 20,
                    paddingTop: 10,
                    paddingLeft: 5,
                  }}>
                  {strings.EDIT_VENDOR_DETAILS}
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    margin: 10,
                  }}>
                  <Input
                    error={error.firmname}
                    onFocus={() => handleErrors(null, 'firmname')}
                    onChangeText={txt => handleValues(txt.trimStart(), 'firmname')}
                    placeholder={strings.FIRM_NAME}
                    value={inputs.firmname}
                    labelTxt={strings.FIRM_NAME}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                  <Input
                    error={error.typeoffirm}
                    onFocus={() => handleErrors(null, 'typeoffirm')}
                    onChangeText={txt => handleValues(txt.trimStart(), 'typeoffirm')}
                    placeholder={strings.TYPE_OF_FIRM}
                    value={inputs.typeoffirm}
                    labelTxt={strings.TYPE_OF_FIRM}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                  <Input
                    error={error.country}
                    onFocus={() => handleErrors(null, 'country')}
                    onChangeText={txt => handleValues(txt.trimStart(), 'country')}
                    placeholder={strings.COUNTRY}
                    value={inputs.country}
                    labelTxt={strings.COUNTRY}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: '700',
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      fontSize: 12,
                      marginLeft: 20,
                    }}>
                    {strings.STATUS}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      marginLeft: 20,
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
                    <Text
                      style={{
                        color: theme == 'light' ? '#2C2C2C' : '#fff',
                      }}>
                      {strings.NO}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Input
                    error={error.gstno}
                    onFocus={() => handleErrors(null, 'gstno')}
                    onChangeText={txt => handleValues(txt, 'gstno')}
                    placeholder={strings.GST_NO}
                    value={inputs.gstno}
                    labelTxt={strings.GST_NO}
                    maxLength={15}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                  <Inputs
                    error={error.address}
                    onFocus={() => handleErrors(null, 'address')}
                    onChangeText={txt => handleValues(txt.trimStart(), 'address')}
                    placeholder={strings.ADDRESS}
                    value={inputs.address}
                    multiline
                    numberOfLines={5}
                    height={120}
                    labelTxt={strings.ADDRESS}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      marginLeft: 20,
                      color: theme == 'light' ? 'black' : '#fff',
                    }}>
                    {strings.STATE}
                  </Text>
                  <SelectDropdown
                    data={states}
                    onSelect={(selectedItem, index) => {
                      handleState(selectedItem);
                      handleValues(selectedItem, 'state');
                      handleValues('', 'city');
                    }}
                    defaultValue={inputs.state}
                    value={inputs.state}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    buttonStyle={{
                      height: 50,
                      width: '90%',
                      borderRadius: 10,
                      backgroundColor:
                        theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      paddingLeft: 20,
                      alignSelf: 'center',
                    }}
                    buttonTextStyle={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      textAlign: 'left',
                      fontSize: 14,
                    }}
                    defaultButtonText="Select State"
                    renderDropdownIcon={isOpened => {
                      return (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={theme == 'light' ? '#2C2C2C' : '#fff'}
                          size={18}
                        />
                      );
                    }}
                    dropdownIconPosition="right"
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Poppins-Bold',
                      textAlign: 'left',
                      marginTop: 10,
                      marginLeft: 20,
                      color: theme == 'light' ? 'black' : '#fff',
                    }}>
                    {strings.CITY}
                  </Text>
                  <SelectDropdown
                    data={getCities}
                    onSelect={selectedItem => {
                      handleValues(selectedItem, 'city');
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    buttonStyle={{
                      height: 50,
                      width: '90%',
                      borderRadius: 10,
                      backgroundColor:
                        theme == 'light' ? COLORS.inputColor : '#2C2C2C',
                      paddingLeft: 20,
                      alignSelf: 'center',
                    }}
                    buttonTextStyle={{
                      color: theme == 'light' ? '#2C2C2C' : '#fff',
                      textAlign: 'left',
                      fontSize: 14,
                    }}
                    {...(inputs.city
                      ? {defaultButtonText: inputs.city || 'Select City'}
                      : {defaultButtonText: 'Select City'})}
                    renderDropdownIcon={isOpened => {
                      return (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={theme == 'light' ? '#2C2C2C' : '#fff'}
                          size={18}
                        />
                      );
                    }}
                    dropdownIconPosition="right"
                  />
                </View>

                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Input
                    error={error.emailid}
                    onFocus={() => handleErrors(null, 'emailid')}
                    onChangeText={txt => handleValues(txt, 'emailid')}
                    placeholder={strings.EMAILID}
                    value={inputs.emailid}
                    labelTxt={strings.EMAILID}
                    keyboardType="email-address"
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                  <Input
                    error={error.mobileno}
                    onFocus={() => handleErrors(null, 'mobileno')}
                    onChangeText={txt =>
                      handleValues(txt.trimStart(), 'mobileno')
                    }
                    keyboardType="numeric"
                    placeholder={strings.MOBILE}
                    value={inputs.mobileno}
                    labelTxt={strings.MOBILE}
                    maxLength={10}
                    placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
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
                  <AppButton
                    onPress={askDelete}
                    buttonText={strings.DELETE}
                  />
                </View>
              </View>
            )}
          </>
        </View>
      </ScrollView>
    </ImageBackground>
   
  );
}
