import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Help from '../components/help';

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
        < Help />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
  },
});


export default HelpScreen;
