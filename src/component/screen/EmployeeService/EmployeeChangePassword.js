/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Input from '../../uicomponents/Input';
import AppButton from '../../uicomponents/AppButton';
import {getStoreData} from '../../storage/AsyncStorage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import SweetAlert from 'react-native-sweet-alert';
import {putData, putDataAxios} from '../../Connection/FetchServices';
import strings from '../../../changeLanguage/LocalizedString';
import {selectedLng} from '../../../changeLanguage/ChangeLanguage';

const {height, width} = Dimensions.get('window');

export default function EmployeeChangePassword({navigation, route}) {
  const [employee, setEmployee] = useState([]);
  const [loader, setLoader] = useState(true);
  const [inputs, setInputs] = useState({
    current: '',
    newpassword: '',
    confirmpassword: '',
  });
  const [error, setError] = useState({});
  const isFocused = useIsFocused();

  const validate = () => {
    var isValid = true;
    if (!inputs.current) {
      handleErrors('Please input current password', 'current');
      isValid = false;
    }

    if (!inputs.newpassword) {
      handleErrors('Please input new password', 'newpassword');
      isValid = false;
    } else if (inputs.newpassword !== inputs.confirmpassword) {
      handleErrors('Please match your password', 'confirmpassword');
      isValid = false;
    }
    return isValid;
  };
  const handleErrors = (txt, attr) => {
    setError(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleValues = (txt, attr) => {
    setInputs(prevStates => ({...prevStates, [attr]: txt}));
  };

  const handleKhali=()=>{
   setInputs('');
  }

  const handleUpdate = async () => {
    if (validate()) {
      let formdata = new FormData();
      formdata.append('password', inputs.confirmpassword);

      var result = await putDataAxios('employee/' + employee.employee_id, formdata);
      console.log("====>",JSON.stringify(result));
      if (result.status) {
        SweetAlert.showAlertWithOptions({
          title: strings.UPDATE_SUCCESSFULLY,
          confirmButtonTitle: 'OK',
          confirmButtonColor: '#000',
          otherButtonTitle: 'Cancel',
          otherButtonColor: '#dedede',
          style: 'success',
          cancellable: true,
        });
        handleKhali()
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

  const fetchEmployee = async () => {
    setLoader(true);
    var result = await getStoreData('EMPLOYEE');
    console.log(JSON.stringify(result));
    if (result) {
      setEmployee(result);
    }
    setLoader(false);
  };

  useEffect(
    function () {
      fetchEmployee();
      selectedLng();
    },
    [isFocused],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployee();
    }, []),
  );
  return (
    <View
      style={{
        alignItems: 'center',
        margin: height * 0.05,
        height: height * 0.46,
      }}>
      <Input
        placeholder={strings.CURRENT_PASSWORD}
        secureTextEntry={true}
        error={error.current}
        onFocus={() => handleErrors(null, 'current')}
        onChangeText={txt => handleValues(txt, 'current')}
        simpleLineIconsEnd="eye"
        fontisto='key'
        value={inputs.current}
      />
      <Input
        placeholder={strings.NEW_PASSWORD}
        error={error.newpassword}
        onFocus={() => handleErrors(null, 'newpassword')}
        onChangeText={txt => handleValues(txt, 'newpassword')}
        SimpleLineIconsEnd={'eye'}
        simpleLineIcons={'lock'}
        value={inputs.newpassword}
      />
      <Input
        placeholder={strings.CURRENT_PASSWORD}
        error={error.confirmpassword}
        onFocus={() => handleErrors(null, 'confirmpassword')}
        onChangeText={txt => handleValues(txt, 'confirmpassword')}
        SimpleLineIconsEnd={'eye'}
        simpleLineIcons={'lock'}
        value={inputs.confirmpassword}
      />
      <AppButton
        style={{marginTop: 10}}
        onPress={handleUpdate}
        buttonText={strings.UPDATE}
      />
    </View>
  );
}
