import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
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
import { Appearance } from 'react-native';
import COLORS from '../../helper/Colors';
const {height, width} = Dimensions.get('screen');
export default function EditBank({navigation, route}) {
  const [inputs, setInputs] = useState({
    name: '',
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
      console.log('here');
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
    const result = await deleteData('banks/' + route.params.id);
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

  const fetchBankDetails = async () => {
    setLoader(true);
    console.log(route.params.id);
    var result = await getData('banks/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        name: result.data.name,
        status: result.data.status,
      });
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchBankDetails();
    selectedLng();
  }, [isFocused]);

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      const body = {
        name: inputs.name,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await putData('banks/' + route.params.id, body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.BANK_EDITED_SUCCESSFULLY,
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
    <ScrollView>
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
                  paddingTop: 10,
                  paddingLeft: 5,
                }}>
                {strings.EDIT_BANK_DETAILS}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Input
                  error={error.name}
                  onFocus={() => handleErrors(null, 'name')}
                  onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                  placeholder={strings.BANK_NAME}
                  value={inputs.name}
                  labelTxt={strings.BANK_NAME}
                  placeholderTextColor={theme == 'light' ? 'black' : 'white'}
                />
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily:'Poppins-Bold',
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
                  <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
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
