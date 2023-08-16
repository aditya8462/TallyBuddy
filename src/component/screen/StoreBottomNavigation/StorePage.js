import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import StoreDrawer from './StoreDrawer';

const StorePage = ({navigation}) => {
  return (
    <SafeAreaView style={Styles.container}>
      <StoreDrawer/>
    </SafeAreaView>
  );
};
export default StorePage;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#F7F8FA',
  },
});
