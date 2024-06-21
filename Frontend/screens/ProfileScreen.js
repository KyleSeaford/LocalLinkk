import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Navbar from '../components/navbar';
import Profile from '../components/profile';


const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Navbar />
        <Profile />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#045757',
  },
});


export default ProfileScreen;
