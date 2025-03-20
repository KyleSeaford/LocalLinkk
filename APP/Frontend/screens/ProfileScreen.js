import React from 'react';
import { View, StyleSheet } from 'react-native';

import Navbar from '../components/navbarTop';
import NavbarSlide from '../components/navbarSlide';
import Profile from '../components/profile';
import PastPosts from '../components/pastposts';

const ProfileScreen = ({ userImage, updateUserImage }) => {
  return (
    <View style={styles.container}>
      <View>
        <Navbar userImage={userImage} />
        <Profile userImage={userImage} updateUserImage={updateUserImage} />
        {/*<PastPosts />*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 5,
      backgroundColor: '#045757',
      //backgroundColor: 'orange',
  },
});

export default ProfileScreen;
