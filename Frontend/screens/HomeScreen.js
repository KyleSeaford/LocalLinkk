import React from 'react';
import { View, StyleSheet } from 'react-native';

import Navbar from '../components/navbarTop';
import NavbarSlide from '../components/navbarSlide';
// import Barsearch from '../components/searchbar'; Too be added later
import Crumbs from '../components/breadcrumbs';

const HomeScreen = ({ userImage }) => {
  return (
    <View style={styles.container}>
      <View>
        <Navbar userImage={userImage} />
        {/*<Barsearch /> Too be added later*/}
        <Crumbs />
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
