/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ImageBackground,
  Appearance,
  Alert,
  ScrollView,
} from 'react-native';
import AppButton from '../../uicomponents/AppButton';
import {getData, putData, deleteData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import Input from '../../uicomponents/Input';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import {useIsFocused} from '@react-navigation/native';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import {getStoreData} from '../../storage/AsyncStorage';

const {height, width} = Dimensions.get('window');

export default function EditAdmin({navigation, route}) {
  const [inputs, setInputs] = useState({
    fullname: '',
    mobile: '',
    emailid: '',
    username: '',
    password: '',
  });
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState({});
  const [hideButton,setHideButton]=useState(false)

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const isFocused = useIsFocused();

  const fetchAdminDetails = async () => {
    setLoader(true);
    var result = await getData('admins/' + route.params.id);
    console.log(result);
    if (result.status) {
      setInputs({
        fullname: result.data.name,
        mobile: result.data.mobileno,
        emailid: result.data.emailid,
        username: result.data.username,
        password: result.data.password,
      });
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchAdminDetails();
    selectedLng();
  }, [isFocused]);

  const validate = () => {
    var isValid = true;
    if (!inputs.fullname) {
      handleErrors('Please Input Name', 'fullname');
      isValid = false;
    } else if (inputs.fullname.length) {
     const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
      if (!regex.test(inputs.fullname)) {
        handleErrors('Please Input valid name', 'fullname');
        isValid = false;
      }
      console.log('here');
    }
    console.log(2);
    if (!inputs.mobile) {
      handleErrors('Please Input Mobile No.', 'mobile');
      isValid = false;
    } else if (inputs.mobile.length) {
      if (isNaN(inputs.mobile.length) || inputs.mobile.length < 10) {
        handleErrors('Please Input valid Mobile No.', 'mobile');
        isValid = false;
      }
    }
    console.log(3);
    if (!inputs.username) {
      handleErrors('Please Input username', 'username');
      isValid = false;
    } 
    else if (inputs.username.length) {
      if (!/^[a-zA-Z0-9_][a-zA-Z0-9_.]{0,29}$/.test(inputs.username)) {
        handleErrors('Please Input valid username', 'username');
        isValid = false;
      }
      console.log(isValid);
    }
    console.log(4);
    if (inputs.emailid.length) {
      const reg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/);
      if (!reg.test(inputs.emailid)) {
        handleErrors('Please Input emailid', 'emailid');
        isValid = false;
      }
    }
    console.log(isValid);
    if (!inputs.password) {
      handleErrors('Please Input Password', 'password');
      isValid = false;
    }

    console.log('5');
    console.log(isValid);
    return isValid;
  };

  const handleEdit = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if(validate()){
    let body = {
      name: inputs.fullname,
      mobileno: inputs.mobile,
      emailid: inputs.emailid,
      username: inputs.username,
      password: inputs.password,
      added_by: asyncData?asyncData.name:superAdmin.name,
    };
    setHideButton(true)
    var result = await putData('admins/' + route.params.id, body);
    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.ADMIN_EDITED_SUCCESSFULLY,
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

  const handleDelete = async () => {
    var result = await deleteData('admins/' + route.params.id);
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
                paddingTop: 10,
                marginBottom: 10,
              }}>
              {strings.EDIT_ADMIN_DETAILS}
            </Text>
            <View style={{alignItems: 'center'}}>
              <Input
                error={error.fullname}
                onFocus={() => handleErrors(null, 'fullname')}
                onChangeText={txt => handleValues(txt.trimStart(), 'fullname')}
                placeholder={strings.NAME}
                value={inputs.fullname}
                labelTxt={strings.NAME}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.mobile}
                onFocus={() => handleErrors(null, 'mobile')}
                onChangeText={txt => handleValues(txt.trimStart(), 'mobile')}
                keyboardType="numeric"
                placeholder={strings.MOBILE}
                value={inputs.mobile}
                labelTxt={strings.MOBILE}
                maxLength={10}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                onFocus={() => handleErrors(null, 'emailid')}
                onChangeText={txt => handleValues(txt, 'emailid')}
                placeholder={strings.EMAILID}
                value={inputs.emailid}
                labelTxt={strings.EMAILID}
                keyboardType="email-address"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.username}
                onFocus={() => handleErrors(null, 'username')}
                onChangeText={txt => handleValues(txt, 'username')}
                placeholder={strings.USERNAME}
                value={inputs.username}
                labelTxt={strings.USERNAME}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <Input
                error={error.password}
                onFocus={() => handleErrors(null, 'password')}
                onChangeText={txt => handleValues(txt, 'password')}
                placeholder={strings.PASSWORD}
                iconName={'eye-with-line'}
                value={inputs.password}
                labelTxt={strings.PASSWORD}
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  display: 'flex',
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
                  bgColor={COLORS.btnColor}
                />
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </ScrollView>
  );
}
