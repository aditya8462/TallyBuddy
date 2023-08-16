import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import ServiceManDrawer from './ServiceManDrawer';

const Page = ({navigation}) => {
  return (
    <SafeAreaView style={Styles.container}>
      <ServiceManDrawer />
    </SafeAreaView>
  );
};
export default Page;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#F7F8FA',
  },
});
