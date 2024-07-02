import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TEXTPost from '../components/TextPost';

const ScreenPostTEXT = () => {
  return (
    <View style={styles.container}>
      <View>
        <TEXTPost />
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


export default ScreenPostTEXT;
