import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Settings from '../components/settings';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Settings />
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


export default SettingScreen;
