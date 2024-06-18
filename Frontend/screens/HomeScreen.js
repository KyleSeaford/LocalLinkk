import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Navbar from '../components/navbar';
import Barsearch from '../components/searchbar';


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Navbar />
        <Barsearch />
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


export default HomeScreen;
