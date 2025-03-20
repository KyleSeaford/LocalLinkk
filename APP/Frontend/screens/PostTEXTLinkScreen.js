import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TEXTLinkpost from '../components/TextPostWithLink';

const ScreenPostTEXTLink = () => {
  return (
    <View style={styles.container}>
      <View>
        <TEXTLinkpost />
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


export default ScreenPostTEXTLink;
