/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Appearance,
} from 'react-native';
import MI from 'react-native-vector-icons/MaterialIcons';
import {FlatList} from 'react-native-gesture-handler';
import {selectedLng, setLng} from './ChangeLanguage';
import strings from './LocalizedString';
import {useIsFocused} from '@react-navigation/native';
import COLORS from '../component/helper/Colors';
import AppButtons from '../component/uicomponents/AppButtons';

const {height, width} = Dimensions.get('window');

export default function ChooseLanguage({navigation}) {
  const isFocused = useIsFocused();

 
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });

  const [language, setLangauge] = useState('');


  const handleUpdate = () => {
    strings.setLanguage(language);
    navigation.goBack();
  }
  

  const onChangeLng = lng => {
    setLangauge(lng);
    if (lng == 'English') {
      setLng('English');
      setLangauge(lng);
      return;
    }
    if (lng == 'Hindi') {
      setLng('Hindi');
      setLangauge(lng);
      return;
    }
  };

  useEffect(() => {
    async function getLang() {
      const data = await selectedLng();
      setLangauge(data);
    }
    getLang();
  }, [isFocused]);

  const data = [
    {
      id: 1,
      type: 'English',
      name: 'English',
      // source: require('../assets/adminIcon.png')
    },
    {
      id: 2,
      type: 'हिन्दी',
      name: 'Hindi',
    },
  ];

  // eslint-disable-next-line react/no-unstable-nested-components
  const Boxes = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onChangeLng(item.name)}>
        <View style={{...styles.MainView, ...(index == 4 && {width: width})}}>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-start',
              alignItems: 'center',
              // padding: 0.5,
              flex: 1,
              backgroundColor: theme == 'light' ? '#fff' : '#2C2C2C',
              width: width * 0.45,
              borderRadius: 10,
              // borderColor: COLORS.btnColor,
              borderColor: '#d0d0d0',
              borderWidth: 0.5,
              height: 110,
              margin: 5,
              marginTop: height * 0.02,
              // backgroundColor: Color.Color.BOXTHEMECOLOR,
              // borderColor: Color.Color.BOXBORDERCOLOR,
            }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: theme == 'light' ? '#000' : 'white',
                alignSelf: 'center',
                top: 15,
                paddingVertical: 5,
                textAlign: 'center',
              }}>
              {item.type}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: theme == 'light' ? '#000' : 'white',
                  alignSelf: 'center',
                  top: 15,
                  paddingVertical: 5,
                  textAlign: 'center',
                }}>
                {item.name}
              </Text>
            </View>
            <View style={{position: 'absolute', top: 30, left: 25}}>
              {language == item.name ? (
                <MI
                  name="check-circle-outline"
                  size={24}
                  style={{color: COLORS.btnColor}}
                />
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../component/assets/background.png')}
      style={{
        flex: 1,
        zIndex: 9999,
        height,
        width: '100%',
        backgroundColor: theme == 'light' ? '#fff' : 'black',
      }}>
      <View style={{width: width}}>
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={data}
            key={2}
            numColumns={2}
            renderItem={({item, index}) => <Boxes item={item} index={index} />}
            keyExtractor={item => item.id}
            style={{alignSelf: 'center'}}
          />
        </View>
        <AppButtons
          buttonText={strings.UPDATE}
          onPress={() => {
            handleUpdate()
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  CardText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000',
    // alignSelf: 'center',
    top: 10,
  },
  MainView: {height: 'auto', padding: 4},
  SecondView: {
    padding: 1,
    flex: 1,
    backgroundColor: '#fff',
    width: width * 0.45,
    borderRadius: 10,
    borderColor: '#d0d0d0',
    borderWidth: 0.5,
    height: 90,
    // margin: 5,
  },
});
