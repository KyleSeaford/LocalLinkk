import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TEXTLinkPost from '../components/TextPostWithLinkEvent';

const ScreenPostTEXTLinkEvent = () => {
  return (
    <View style={styles.container}>
      <View>
        <TEXTLinkPost />
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


export default ScreenPostTEXTLinkEvent;
