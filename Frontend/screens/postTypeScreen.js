import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


import PostType from '../components/postType';

const ScreenPostType = () => {
  return (
    <View style={styles.container}>
      <View>
        <PostType />
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


export default ScreenPostType;
