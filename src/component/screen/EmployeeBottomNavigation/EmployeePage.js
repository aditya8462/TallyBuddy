import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import EmployeeDrawer from './EmployeeDrawer';

const EmployeePage = ({navigation}) => {
  return (
    <SafeAreaView style={Styles.container}>
      <EmployeeDrawer />
    </SafeAreaView>
  );
};
export default EmployeePage;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#F7F8FA',
  },
});
