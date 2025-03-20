import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import LoginButtons from '../components/loginbuttons';


const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <LoginButtons />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
  },
});


export default LoginScreen;
