/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
// import React, {useState, useEffect} from 'react';
// // import all the components we are going to use
// import {SafeAreaView, StyleSheet, View, Text, Button} from 'react-native';
// import NetInfo from '@react-native-community/netinfo';

// export default function AppNetInfo() {
//   const [netInfo, setNetInfo] = useState('');
//   useEffect(() => {
//     // Subscribe to network state updates
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setNetInfo(
//         `Connection type: ${state.type}
//         Is connected?: ${state.isConnected}
//         IP Address: ${state.details.ipAddress}`,
//       );
//     });
//     return () => {
//       // Unsubscribe to network state updates
//       unsubscribe();
//     };
//   }, []);

//   const getNetInfo = () => {
//     // To get the network state once
//     NetInfo.fetch().then(state => {
//       alert(
//         `Connection type: ${state.type}
//         Is connected?: ${state.isConnected}
//         IP Address: ${state.details.ipAddress}`,
//       );
//     });
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.container}>
//         <Text style={styles.textStyle}>
//           {/*Here is NetInfo to get device type*/}
//           {netInfo}
//         </Text>
//         {/* <Button title="Get more detailed NetInfo" onPress={getNetInfo} /> */}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 10,
//     justifyContent: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: 'black',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     marginTop: 30,
//     fontSize: 16,
//     textAlign: 'center',
//     color: 'black',
//     paddingVertical: 20,
//   },
// });
/* eslint-disable react-hooks/exhaustive-deps */

import NetInfo from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Linking,
  View,
} from 'react-native';
import Lottie from 'lottie-react-native';
// import {TouchableOpacity} from 'react-native';
const {width, height} = Dimensions.get('window');
const deviceWidth = width < height ? width : height;
const deviceHeight = width < height ? height : width;
// const screenWidth = Dimensions.get('screen').width;
// const screenHeight = Dimensions.get('screen').height;
let unsubscribe = '';

export default function AppNetInfo() {
  let [isConnected, closeModal] = useState(false);
  let [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isConnected ? 1 : 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1 * 1000, -1 * 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  useEffect(() => {
    unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        closeModal(false);
      } else {
        closeModal(true);
      }
    });
  }, []);

  return (
    <Animated.View style={[styles.mainContainer, slideUp]}>
      <Text allowFontScaling={false} style={styles.offlineTextStyle}>
        {'Please check your internet connectivity'}
      </Text>
      <Lottie
        source={require('../../assets/No Internet.json')}
        autoPlay
        loop
        style={{height: 380, width: 300}}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fbfbf6',
    width: width,
    height: deviceHeight,
    padding: deviceWidth / 30,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  offlineTextStyle: {
    // color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Italic',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
