import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ToastAndroid,ImageBackground,Dimensions, ScrollView, Appearance} from 'react-native';
import AppButton from '../../uicomponents/AppButton';
import {postData} from '../../Connection/FetchServices';
import {RadioButton} from 'react-native-paper';
import Input from '../../uicomponents/Input';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';
const {height,width}=Dimensions.get('screen')
export default function CreateCategory({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    gst_percent: '',
    status: '',
    hsn:'',
  });

  const [error, setError] = useState({});
  const [checked, setChecked] = React.useState('first');
  const isFocused = useIsFocused();
  const [hideButton,setHideButton]=useState(false)


  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  useEffect(() => {
    selectedLng();
  }, [isFocused]);

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

  const handleCreate = async () => {
   
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    const employeeAdmin = await getStoreData('EMPLOYEE');
    const storeAdmin = await getStoreData('STORE');
    if (validate()) {
      let body = {
        name: inputs.name,
        gst_percent: inputs.gst_percent,
        status: inputs.status,
        hsn: inputs.hsn,
        added_by: asyncData?asyncData.name:superAdmin.name||employeeAdmin.name||storeAdmin.name,
      };
      setHideButton(true)
      const result = await postData('category', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.CATEGORY_CREATED_SUCCESSFULLY,
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
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
            <ScrollView style={{flex:1}}>
             <Text
          style={{
            fontSize: 16,
            fontFamily:'Poppins-Bold',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
            marginLeft: 20,
            marginTop:10,
            padding:5
          }}>
         {strings.CREATE_CATEGORY}
        </Text>
    <View style={{display: 'flex', alignItems: 'center'}}>
      
      <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder= {strings.NAME}
                autoCompleteType="off"
                simpleLineIcons="user"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
     <Input
                error={error.gst_percent}
                onChangeText={txt => handleValues(txt.trimStart(), 'gst_percent')}
                placeholder={strings.GST_PERCENT}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome5='percentage'
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
       <Input
                error={error.hsn}
                onFocus={() => handleErrors(null, 'hsn')}
                onChangeText={txt => handleValues(txt.trimStart(), 'hsn')}
                placeholder={strings.HSN}
                autoCompleteType="off"
                materialIcons="tag"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
      
      <View style={{alignSelf: 'flex-start'}}>
        <Text
          style={{
            marginTop: 10,
            fontFamily:'Poppins-Bold',
            color: theme == 'light' ? '#2C2C2C' : '#fff',
            fontSize: 14,
            marginLeft: 20,
          }}>
           {strings.STATUS}
        </Text>
        <View>
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
              status={checked === '1' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('1');
                handleValues('1', 'status');
              }}
            />
            <Text style={{marginRight: 50, color: theme == 'light' ? '#2C2C2C' : '#fff'}}> {strings.YES}</Text>
            <RadioButton
              value="2"
              status={checked === '2' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('2');
                handleValues('2', 'status');
              }}
            />
            <Text style={{marginRight: 50, color: theme == 'light' ? '#2C2C2C' : '#fff'}}> {strings.NO}</Text>
          </View>
        </View>
      </View>
      {hideButton?
              ( <AppButton
                buttonText={strings.CREATE}
                bgColor={COLORS.disable}
                btnWidth={0.8}
              />
              ) :(
                <AppButton
                onPress={handleCreate}
                buttonText={strings.CREATE}
                bgColor={COLORS.btnColor}
                btnWidth={0.8}
              />
              )}
    </View>
    </ScrollView>
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
    backgroundColor: '#4171E1',
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
  },
});
