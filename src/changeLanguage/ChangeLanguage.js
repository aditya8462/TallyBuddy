import AsyncStorage from '@react-native-community/async-storage';
import strings from './LocalizedString';

export const setLng = data => {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('LANGUAGE', data);
};
export const getLng = async () => {
  const data = await AsyncStorage.getItem('LANGUAGE');
  if (data != null) {
    return JSON.parse(data);
  }
};

export const selectedLng = async () => {
  const lngData = await getLng();
  if (lngData) {
    strings.setLanguage(lngData);
    return lngData;
  }
};
