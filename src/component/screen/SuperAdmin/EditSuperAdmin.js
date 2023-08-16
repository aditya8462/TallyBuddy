/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, Text, ToastAndroid,ImageBackground, Appearance, Alert, ScrollView} from 'react-native';
import AppButton from '../../uicomponents/AppButton';
import {
  postData,
  postDataAxios,
  getData,
  putData,
  deleteData,
} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import Input from '../../uicomponents/Input';
import AnimatedLottieView from 'lottie-react-native';
import COLORS from '../../helper/Colors';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';

const {height, width} = Dimensions.get('window');

export default function EditSuperAdmin({navigation, route}) {
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

  const fetchSuperAdminDetails = async () => {
    setLoader(true);
    var result = await getData('superadmin/' + route.params.id);
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
    fetchSuperAdminDetails();
    selectedLng();
  }, [isFocused]);

  useEffect(()=>{
    
  },[])
  const validate = () => {
    var isValid = true;
    console.log(1);
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
    const asyncData = await getStoreData('SUPERADMIN');
    if(validate()){
    let body = {
      name: inputs.fullname,
      mobileno: inputs.mobile,
      emailid: inputs.emailid,
      username: inputs.username,
      password: inputs.password,
      added_by: asyncData.name, 
    };
    var result = await putData('superadmin/' + route.params.id, body);
    setHideButton(true)
    if (result.status) {
      SweetAlert.showAlertWithOptions({
        title: strings.SUPERADMIN_EDITED_SUCCESSFULLY,
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
    var result = await deleteData('superadmin/' + route.params.id);
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
              fontFamily:'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
              marginLeft: 20,
              paddingTop: 10,
              marginBottom: 10
            }}>
            {strings.EDIT_SUPERADMIN_DETAILS}
          </Text>
          <View style={{alignItems: 'center'}}>
            <Input
              error={error.fullname}
              onFocus={() => handleErrors(null, 'fullname')}
              onChangeText={txt => handleValues(txt.trimStart(), 'fullname')}
              placeholder={strings.NAME}
              value={inputs.fullname}
              labelTxt={strings.NAME}
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.mobile}
              onFocus={() => handleErrors(null, 'mobile')}
              onChangeText={txt => handleValues(txt.trimStart(), 'mobile')}
                keyboardType="numeric"
              placeholder={strings.MOBILE}
              maxLength={10}
              value={inputs.mobile}
              labelTxt={strings.MOBILE}
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              onFocus={() => handleErrors(null, 'emailid')}
              onChangeText={txt => handleValues(txt, 'emailid')}
              error={error.emailid}
              placeholder={strings.EMAILID}
              value={inputs.emailid}
              labelTxt={strings.EMAILID}
              keyboardType="email-address"
              placeholderTextColor= {theme== 'light'? "black":'white'}
            />
            <Input
              error={error.username}
              onFocus={() => handleErrors(null, 'username')}
              onChangeText={txt => handleValues(txt.trim()||txt.trimStart(), 'username')}
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
              iconName={'eye-with-line'}
              value={inputs.password}
              labelTxt={strings.PASSWORD}
              placeholderTextColor= {theme== 'light'? "black":'white'}
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
                bgColor={'#dfe4ea'}
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
               
                style={{margin: 5}}
              />
            </View>
          </View>
        </View>
      )}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
});
