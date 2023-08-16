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
const {width,height}=Dimensions.get('screen')
export default function EditCategory({navigation, route}) {
  const [inputs, setInputs] = useState({
    name: '',
    gst_percent: '',
    status: '',
    hsn: '',
  });
  const [error, setError] = useState({});
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

    if (!inputs.gst_percent) {
      handleErrors('Please Input gst', 'gst_percent');
      isValid = false;
    } else if (inputs.gst_percent.length) {
      if (isNaN(inputs.gst_percent.length)) {
        handleErrors('Please Input valid Mobile No.', 'gst_percent');
        isValid = false;
      }
    }

    if (!inputs.hsn) {
      handleErrors('Please Input Name', 'hsn');
      isValid = false;
    } else if (inputs.hsn.length) {
      const regex = new RegExp(/(^\d\d\d*$)|(^[a-zA-Z0-9  *]*$)/);
      if (!regex.test(inputs.hsn)) {
        handleErrors('Please Input valid hsn', 'hsn');
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
  const [loader, setLoader] = useState(true);

  const handleDelete = async () => {
    const result = await deleteData('category/' + route.params.id);
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

  const fetchCategoryDetails = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('category/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        name: result.data.name,
        gst_percent: result.data.gst_percent,
        status: result.data.status,
        hsn: result.data.hsn,
      });
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchCategoryDetails();
    selectedLng();
  }, [isFocused]);

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        name: inputs.name,
        gst_percent: inputs.gst_percent,
        status: inputs.status,
        hsn: inputs.hsn,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await putData('category/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.CATEGORY_EDITED_SUCCESSFULLY,
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
       <ImageBackground
          source={require('../../assets/background.png')}
          style={{
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
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
                fontFamily: 'Poppins-Bold',
                color: theme == 'light' ? '#2C2C2C' : '#fff',
                marginLeft: 20,
                marginTop:10,
                padding:3
              }}>
             {strings.EDIT_CATEGORY_DETAILS}
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
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.gst_percent}
                onFocus={() => handleErrors(null, 'gst_percent')}
                onChangeText={txt => handleValues(txt.trimStart(), 'gst_percent')}
                placeholder={strings.GST_PERCENT}
                keyboardType="numeric"
                value={inputs.gst_percent}
                labelTxt={strings.GST_PERCENT}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.hsn}
                onFocus={() => handleErrors(null, 'hsn')}
                onChangeText={txt => handleValues(txt.trimStart(), 'hsn')}
                placeholder={strings.HSN}
                value={inputs.hsn}
                labelTxt={strings.HSN}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'Poppins-Bold',
                  color: theme == 'light' ? '#2C2C2C' : '#fff',
                  marginTop: 10,
                  fontSize: 16,
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
                <Text style={{marginRight: 50}}>{strings.YES}</Text>
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
                <Text>{strings.NO}</Text>
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
      </ImageBackground>
    </ScrollView>
  );
}
