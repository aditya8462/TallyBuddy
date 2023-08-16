/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Input from '../../uicomponents/Input';
import AppButton from '../../uicomponents/AppButton';
import {getStoreData} from '../../storage/AsyncStorage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import SweetAlert from 'react-native-sweet-alert';
import {putData} from '../../Connection/FetchServices';
import { selectedLng } from '../../../changeLanguage/ChangeLanguage';
import strings from '../../../changeLanguage/LocalizedString';

const {height, width} = Dimensions.get('window');

export default function ChangePassword({navigation, route}) {
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const isFocused = useIsFocused();

  const [inputs, setInputs] = useState({
    current: '',
    newpassword: '',
    confirmpassword: '',
  });
  const [error, setError] = useState({});

  const validate = () => {
    var isValid = true;
    if (!inputs.current) {
      handleErrors('Please input current password', 'current');
      isValid = false;
    }
    
    if (!inputs.newpassword) {
      handleErrors('Please input new password', 'newpassword');
      isValid = false;
    }
    else if(inputs.newpassword !== inputs.confirmpassword){
      handleErrors('Please match your password','confirmpassword')
      isValid=false
    }
    return isValid;
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleUpdate = async () => {
    if (validate()) {
      const body = {
        password: inputs.confirmpassword,
      };
    //  if(inputs.newpassword == inputs.confirmpassword &&)

      var result = await putData('serviceman/' + services.serviceman_id, body);
      if (result.status) {
        console.log(JSON.stringify(result));
        SweetAlert.showAlertWithOptions({
          title: strings.UPDATE_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
      } else {
        SweetAlert.showAlertWithOptions({
          title: strings.CHECK_PASSWORD,
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

  const fetchServiceman = async () => {
    setLoader(true);
    var result = await getStoreData('SERVICEMAN');
    console.log(JSON.stringify(result));
    if (result) {
      setServices(result);
    }
    setLoader(false);
  };

  useEffect(function () {
    fetchServiceman();
    selectedLng();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      fetchServiceman();
    }, []),
  );
  return (
    <View
      style={{
        alignItems: 'center',
        margin: height * 0.05,
        height:height*0.46
      }}>
      <Input
        placeholder={strings.CURRENT_PASSWORD}
        secureTextEntry={true}
        error={error.current}
        onFocus={() => handleErrors(null, 'current')}
        onChangeText={txt => handleValues(txt, 'current')}
        simpleLineIconsEnd="eye"
      />
      <Input
        placeholder={strings.NEW_PASSWORD}
        error={error.newpassword}
        onFocus={() => handleErrors(null, 'newpassword')}
        onChangeText={txt => handleValues(txt, 'newpassword')}
        SimpleLineIconsEnd="eye"
      />
      <Input
        placeholder={strings.CONFIRM_PASSWORD}
        error={error.confirmpassword}
        onFocus={() => handleErrors(null, 'confirmpassword')}
        onChangeText={txt => handleValues(txt, 'confirmpassword')}
        secureTextEntry={true}
        SimpleLineIconsEnd="eye"
      />
      <AppButton
        style={{marginTop: 10}}
        onPress={handleUpdate}
        buttonText={strings.UPDATE}
      />
    </View>
  );
}
