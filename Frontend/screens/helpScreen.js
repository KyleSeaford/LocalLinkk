import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Help from '../components/help';

const HelpScreen = () => {
  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Help />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#121212',
  },
  scrollContent: {
      flexGrow: 1,
  },
});

export default HelpScreen;
