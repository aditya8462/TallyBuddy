import {View, Text} from 'react-native';
import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal'

export default function SendNotifi() {
  OneSignal.setAppId('0f98ca9e-2cd9-429a-8458-54c627439e6d');
  OneSignal.promptForPushNotificationsWithUserResponse();
  return (
    <View style={{backgroundColor: 'white', height: 10000}}>
      <Text style={{color: 'black', margin: 10, fontSize: 20}}>
        Hello World
      </Text>
    </View>
  );
}
