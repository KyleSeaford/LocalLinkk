import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import Navbar from '../components/navbar';
import Barsearch from '../components/searchbar';
import Crumbs from '../components/breadcrumbs';


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Navbar />
        <Barsearch />
        <Crumbs /> {/* cant figure out how to get the breadcrumbs to work too tired to think */}
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
