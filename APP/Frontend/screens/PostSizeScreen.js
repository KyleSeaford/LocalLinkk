import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import PostSize from '../components/PostSize';

const ScreenPostSize = () => {
  return (
    <View style={styles.container}>
      <View>
        <PostSize />
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


export default ScreenPostSize;
