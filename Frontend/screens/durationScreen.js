import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Duration from '../components/duration';

const DurationScreen = () => {
  return (
    <View style={styles.container}>
        <ScrollView>
            <Duration />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
  },
});

export default DurationScreen;
