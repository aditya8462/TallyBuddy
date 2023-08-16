/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground, Dimensions, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import Inputs from '../../uicomponents/Inputs';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLottieView from 'lottie-react-native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import {useIsFocused} from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';
import { Appearance } from 'react-native';
import COLORS from '../../helper/Colors';
const {height} = Dimensions.get('screen');
export default function EditStore({navigation, route}) {
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
    emailid: '',
    mobileno: '',
    address: '',
    gstno: '',
    status: '',
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const validate = () => {
    var isValid = true;
    if (!inputs.name) {
      handleErrors('Please Input Name', 'name');
      isValid = false;
    } else if (inputs.name.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.name)) {
        handleErrors('Please Input valid name', 'name');
        isValid = false;
      }
      console.log('here');
    }
    console.log('1')
    if (!inputs.username.length) {
      handleErrors('Please Input username', 'username');
      isValid = false;
    } else if (inputs.username.length) {
      if (!/^[a-zA-Z0-9_][a-zA-Z0-9_.]{0,29}$/.test(inputs.username)) {
        handleErrors('Please Input valid username', 'username');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log('2')

    if (!inputs.password) {
      handleErrors('Please Input Password', 'password');
      isValid = false;
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
    if (inputs.gstno.length) {
      if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(inputs.gstno)) {
        handleErrors('Please Input valid Gst no.', 'gstno');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log('3')
    
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
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
    }
    console.log('4')
    console.log(isValid);
    return isValid;
  };

  const [checked, setChecked] = React.useState('first');
  const isFocused = useIsFocused();

  const handleDelete = async () => {
    const result = await deleteData('store/' + route.params.id);
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
 

  const fetchStore = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('store/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        name: result.data.name,
        username: result.data.username,
        password: result.data.password,
        emailid: result.data.emailid,
        mobileno: result.data.mobileno,
        address: result.data.address,
        gstno: result.data.gstno,
        status: result.data.status,
      });
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchStore();
      selectedLng();
    },
    [isFocused],
  );

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        name: inputs.name,
        username: inputs.username,
        password: inputs.password,
        emailid: inputs.emailid,
        mobileno: inputs.mobileno,
        gstno: inputs.gstno,
        address: inputs.address,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,

      };
      setHideButton(true)
      const result = await putData('store/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.STORE_EDITED_SUCCESSFULLY,
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

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  return (
    <ScrollView style={{flex: 1}}>
      <>
        <ImageBackground
          source={require('../../assets/background.png')}
          style={{
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
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
                {strings.STORE_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Input
                  error={error.name}
                  onFocus={() => handleErrors(null, 'name')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                  placeholder={strings.NAME}
                  value={inputs.name}
                  labelTxt={strings.NAME}
                  placeholderTextColor= {theme== 'light'? "black":'white'}
                />
                <Input
                  error={error.username}
                  onFocus={() => handleErrors(null, 'username')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'username')}
                  placeholder={strings.USERNAME}
                  value={inputs.username}
                  labelTxt={strings.USERNAME}
                  placeholderTextColor= {theme== 'light'? "black":'white'}

                />
                <Input
                  error={error.password}
                  onFocus={() => handleErrors(null, 'password')}
                  onChangeText={txt => handleValues(txt, 'password')}
                  placeholder={strings.PASSWORD}
                  value={inputs.password}
                  placeholderTextColor= {theme== 'light'? "black":'white'}
                  labelTxt={strings.PASSWORD}
                />
                <Input
                error={error.emailid}
                  onFocus={() => handleErrors(null, 'emailid')}
                  onChangeText={txt => handleValues(txt, 'emailid')}
                  placeholder={strings.EMAILID}
                  value={inputs.emailid}
                  labelTxt={strings.EMAILID}
                  keyboardType="email-address"
                  placeholderTextColor= {theme== 'light'? "black":'white'}

                />
                <Input
                  error={error.mobileno}
                  onFocus={() => handleErrors(null, 'mobileno')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'mobileno')}
                    keyboardType="numeric"
                  placeholder={strings.MOBILE}
                  maxLength={10}
                  value={inputs.mobileno}
                  labelTxt={strings.MOBILE}
                  placeholderTextColor= {theme== 'light'? "black":'white'}
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
                  placeholderTextColor= {theme== 'light'? "black":'white'}
                />
                <Input
                  error={error.gstno}
                  onFocus={() => handleErrors(null, 'gstno')}
                  onChangeText={txt => handleValues(txt, 'gstno')}
                  placeholder={strings.GST_NO}
                  value={inputs.gstno}
                  labelTxt={strings.GST_NO}
                  maxLength={15}
                  placeholderTextColor= {theme== 'light'? "black":'white'}

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
                  <Text style={{marginRight: 50,color:theme == 'light' ? '#2C2C2C' : '#fff'}}>{strings.YES}</Text>
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
                  <Text style={{color:theme == 'light' ? '#2C2C2C' : '#fff'}}>{strings.NO}</Text>
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
                <AppButton onPress={askDelete} buttonText={strings.DELETE} />
              </View>
              <View style={{marginTop: 10}} />
            </View>
          )}
        </ImageBackground>
      </>
    </ScrollView>
  );
}
