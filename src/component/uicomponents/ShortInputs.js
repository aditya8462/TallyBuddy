/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, Dimensions, View, Appearance} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import COLORS from '../helper/Colors';
const {width, height} = Dimensions.get('window');

export default function ShortInputs({
  labelTxt,
  setValue,
  error,
  showIconName,
  hideIconName,
  inptWidth,
  contWidth,
  height,
  entypo,
  antDesign,
  evilIcons,
  feather,
  fontAwesome,
  fontAwesome5,
  fontAwesome5Pro,
  fontisto,
  foundation,
  ionicons,
  materialCommunityIcons,
  materialIcons,
  octicons,
  simpleLineIcons,
  zocial,
  EntypoEnd,
  AntDesignEnd,
  EvilIconsEnd,
  FeatherEnd,
  FontAwesomeEnd,
  FontAwesome5End,
  FontAwesome5ProEnd,
  FontistoEnd,
  FoundationEnd,
  IoniconsEnd,
  MaterialCommunityIconsEnd,
  MaterialIconsEnd,
  OcticonsEnd,
  SimpleLineIconsEnd,
  ZocialEnd,
  onFocus = () => {},
  ...props
}) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(scheme => {
    setTheme(scheme.colorScheme);
  });
  return (
    <View
      style={{
        padding: 1,
        justifyContent: 'center',

        alignItems: 'center',
      }}>
      <View style={{width: inptWidth || width * 0.9}}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'Poppins-Bold',
            textAlign: 'left',
            color: theme == 'light' ? 'black' : '#fff',
          }}>
          {labelTxt}
        </Text>
      </View>
      <View
        style={[
          styles.textContainer,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.inputColor
              : COLORS.light,
            height,
            width: contWidth || width * 0.4,
            backgroundColor: theme == 'light' ? COLORS.inputColor : '#2C2C2C',
            borderRadius: 10,
          },
        ]}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {entypo && <Entypo name={entypo} style={styles.icon} />}
          {antDesign && <AntDesign name={antDesign} style={styles.icon} />}
          {evilIcons && <EvilIcons name={evilIcons} style={styles.icon} />}
          {feather && <Feather name={feather} style={styles.icon} />}
          {fontAwesome && (
            <FontAwesome name={fontAwesome} style={styles.icon} />
          )}
          {fontAwesome5 && (
            <FontAwesome5 name={fontAwesome5} style={styles.icon} />
          )}
          {fontAwesome5Pro && (
            <FontAwesome5Pro name={fontAwesome5Pro} style={styles.icon} />
          )}
          {fontisto && <Fontisto name={fontisto} style={styles.icon} />}
          {foundation && <Foundation name={foundation} style={styles.icon} />}
          {ionicons && <Ionicons name={ionicons} style={styles.icon} />}
          {materialCommunityIcons && (
            <MaterialCommunityIcons
              name={materialCommunityIcons}
              style={styles.icon}
            />
          )}
          {materialIcons && (
            <MaterialIcons name={materialIcons} style={styles.icon} />
          )}
          {octicons && <Octicons name={octicons} style={styles.icon} />}
          {simpleLineIcons && (
            <SimpleLineIcons name={simpleLineIcons} style={styles.icon} />
          )}
          {zocial && <Zocial name={zocial} style={styles.icon} />}
          <TextInput
            style={{
              fontSize: 13,
              marginLeft: 4,
              paddingTop: props.multiline ? 0 : null,
              flex: 1,
            }}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={show}
            textAlignVertical={props.multiline ? 'top' : null}
            {...props}
          />
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => setShow(!show)}>
            {EntypoEnd && <Entypo name={EntypoEnd} style={styles.icon} />}
            {AntDesignEnd && (
              <AntDesign name={AntDesignEnd} style={styles.icon} />
            )}
            {EvilIconsEnd && (
              <EvilIcons name={EvilIconsEnd} style={styles.icon} />
            )}
            {FeatherEnd && <Feather name={FeatherEnd} style={styles.icon} />}
            {FontAwesomeEnd && (
              <FontAwesome name={FontAwesomeEnd} style={styles.icon} />
            )}
            {FontAwesome5End && (
              <FontAwesome5 name={FontAwesome5End} style={styles.icon} />
            )}
            {FontAwesome5ProEnd && (
              <FontAwesome5Pro name={FontAwesome5ProEnd} style={styles.icon} />
            )}
            {FontistoEnd && <Fontisto name={FontistoEnd} style={styles.icon} />}
            {FoundationEnd && (
              <Foundation name={FoundationEnd} style={styles.icon} />
            )}
            {IoniconsEnd && <Ionicons name={IoniconsEnd} style={styles.icon} />}
            {MaterialCommunityIconsEnd && (
              <MaterialCommunityIcons
                name={MaterialCommunityIconsEnd}
                style={styles.icon}
              />
            )}
            {MaterialIconsEnd && (
              <MaterialIcons name={MaterialIconsEnd} style={styles.icon} />
            )}
            {OcticonsEnd && <Octicons name={OcticonsEnd} style={styles.icon} />}
            {SimpleLineIconsEnd && (
              <SimpleLineIcons name={SimpleLineIconsEnd}  style={styles.icon} />
            )}
            {ZocialEnd && (
              <Zocial
                name={ZocialEnd}
                style={styles.icon}
                color={COLORS.primary}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          padding: 1,
          width: width * 0.9,
        }}>
        {error ? (
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Poppins-SemiBold',
              color: 'red',
            }}>
            {error}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
  },
  icon: {
    fontSize: 16,
    color: COLORS.btnColor,
    paddingLeft: 10,
  },
});
