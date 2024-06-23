import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Navbar from '../components/navbar';
import SignupPage from '../components/signupbuttons';


const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <SignupPage />
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


export default SignupScreen;
