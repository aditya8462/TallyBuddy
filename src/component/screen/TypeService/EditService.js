/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, Alert, ToastAndroid,ImageBackground,Dimensions, Appearance} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {getData, deleteData, putData} from '../../Connection/FetchServices';
import AnimatedLottieView from 'lottie-react-native';
import SweetAlert from 'react-native-sweet-alert';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import { useIsFocused } from '@react-navigation/native';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';
import COLORS from '../../helper/Colors';
const {height,width}=Dimensions.get('screen')
export default function EditService({navigation, route}) {
  const [inputs, setInputs] = useState({
    name: '',
    servicecharge: '',
    status: '',
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
    if (!inputs.name) {
      handleErrors('Please Input Name', 'name');
      isValid = false;
    } else if (inputs.name.length) {
      const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.name)) {
        handleErrors('Please Input valid name', 'name');
        isValid = false;
      }
    }
      if (!inputs.servicecharge) {
        handleErrors('Please Input Service Charge', 'servicecharge');
        isValid = false;
      } else if (inputs.servicecharge.length) {  
      const regex = new RegExp(/^\d+(,\d{1,2})?$/);
        if (!regex.test(inputs.servicecharge)) {
          handleErrors('Please Input valid service charge', 'servicecharge');
          isValid = false;
        }
      }
    if (!inputs.status) {
      handleErrors('Please Input status', 'status');
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  };

  const [checked, setChecked] = React.useState('first');

  const handleDelete = async () => {
    const result = await deleteData('typesofservice/' + route.params.id);
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
        style: 'success',
        cancellable: true,
      });
    }
  }

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


  const fetchTypeOfServiceDetails = async () => {
    setLoader(true);
    var result = await getData('typesofservice/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        name: result.data.name,
        servicecharge: String(result.data.servicecharge),
        status: String(result.data.status),
      });
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchTypeOfServiceDetails();
    selectedLng();
  }, [isFocused]);

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        name: inputs.name,
        status: inputs.status,
        servicecharge: inputs.servicecharge,
        added_by: asyncData?asyncData.name:superAdmin.name,

      };
     setHideButton(true)
      const result = await putData('typesofservice/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVICES_EDITED_SUCCESSFULLY,
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
          style: 'success',
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
    <ScrollView>
    <ImageBackground
    source={require('../../assets/background.png')}
    style={{
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
            style={{height: 100, alignSelf: 'center', display: 'flex'}}
          />
        ) : (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                paddingTop:10,
              }}>
              {strings.EDIT_SERVICE_DETAILS}
            </Text>
            <View
              style={{
                alignItems: 'center',
                marginTop:10
              }}>
              <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder={strings.SERVICE_TYPE_NAME}
                value={inputs.name}
                labelTxt={strings.SERVICE_TYPE_NAME}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.servicecharge}
                onFocus={() => handleErrors(null, 'servicecharge')}
                onChangeText={txt => handleValues(txt.trimStart(), 'servicecharge')}
                placeholder={strings.SERVICE_CHARGE}
                keyboardType="numeric"
                value={inputs.servicecharge}
                labelTxt={strings.SERVICE_CHARGE}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily:'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginTop: 10,
                  fontSize: 14,
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
                <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
                <RadioButton
                  value="2"
                  status={
                    checked == '0' || inputs.status == '0'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => {
                    setChecked('0');
                    handleValues('0', 'status');
                  }}
                />
                <Text style={{color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
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
      </>
    </ScrollView>
    </ImageBackground>
    </ScrollView>
  );
}
