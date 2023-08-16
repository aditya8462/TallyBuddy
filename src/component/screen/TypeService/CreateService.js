/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text,ImageBackground,Dimensions, Appearance} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import AppButton from '../../uicomponents/AppButton';
import Input from '../../uicomponents/Input';
import {postData} from '../../Connection/FetchServices';
import SweetAlert from 'react-native-sweet-alert';
import COLORS from '../../helper/Colors';
import { useIsFocused } from '@react-navigation/native';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';
import { getStoreData } from '../../storage/AsyncStorage';
const {height,width} = Dimensions.get('window');

export default function CreateService({navigation}) {
  const [inputs, setInputs] = useState({
    name: '',
    servicecharge: '',
    status: '',
  });
  const [error, setError] = useState({});
  const isFocused = useIsFocused();
  const [hideButton, setHideButton] = useState(false)

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

  const handleCreate = async () => {
    const asyncData = await getStoreData('ADMIN');
    const superAdmin = await getStoreData('SUPERADMIN');
    if (validate()) {
      let body = {
        name: inputs.name,
        servicecharge: inputs.servicecharge,
        status: inputs.status,
        added_by: asyncData?asyncData.name:superAdmin.name,
      };
      setHideButton(true)
      const result = await postData('typesofservice', body);
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.SERVICES_CREATED_SUCCESSFULLY,
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
    <ScrollView style={{flex: 1}}>
      <View >
        <ImageBackground
          source={require('../../assets/background.png')}
          style={{
            zIndex: 9999,
            height,
            width: '100%',
            backgroundColor: theme == 'light' ? '#fff' : 'black',
          }}>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily:'Poppins-Bold',
              color: theme == 'light' ? '#2C2C2C' : '#fff',
            marginLeft: 20,
            marginTop:10
          }}>
          {strings.CREATE_SERVICE}
        </Text>
        <View
          style={{
            alignItems: 'center',
          }}>
           <Input
                error={error.name}
                onFocus={() => handleErrors(null, 'name')}
                onChangeText={txt => handleValues(txt.trimStart(), 'name')}
                placeholder={strings.SERVICE_TYPE_NAME}
                autoCompleteType="off"
                simpleLineIcons="user"
                placeholderTextColor={theme == 'light' ? 'black' : 'white'}
              />
          
         
          <Input
                error={error.servicecharge}
                onFocus={() => handleErrors(null, 'servicecharge')}
                onChangeText={txt => handleValues(txt.trimStart(), 'servicecharge')}
                placeholder={strings.SERVICE_CHARGE}
                keyboardType="numeric"
                autoCompleteType="off"
                fontAwesome="rupee"
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
              status={checked === '1' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('1');
                handleValues('1', 'status');
              }}
            />
            <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.YES}</Text>
            <RadioButton
              value="2"
              status={checked === '2' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('2');
                handleValues('2', 'status');
              }}
            />
            <Text style={{marginRight: 50,color: theme == 'light' ? '#2C2C2C' : '#fff',}}>{strings.NO}</Text>
          </View>
        </View>
        <View style={{alignSelf: 'center'}}>
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
        <View style={{marginTop: 10}} />
      </View>
      </ImageBackground>
      </View>
      
    </ScrollView>
  );
}
