import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import user from '../assets/transparent_picture.png';

const url = 'http://192.168.127.93:5500/';

const Profile = () => {
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
        const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
        const response = await axios.get(`${url}Users/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);

        // Fetch user image
        const imageResponse = await fetch(`${url}Users/users/image/${userId}`);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setUserImage(imageUrl);

      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    UserPostCount();
  }, []);

  const handleProfileClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleEditClick = () => {
    setFirstName(userData[1]);
    setLastName(userData[2]);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleSaveChanges = async () => {
    try {
      const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
      const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
      await axios.put(`${url}Users/users/nameChange`, null, {
        params: {
          userID: userId,
          userFname: firstName,
          userLname: lastName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(prevState => ({
        ...prevState,
        1: firstName,
        2: lastName,
      }));
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Name updated successfully');
      window.location.reload();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update name');
    }
  };

  const handlePostClick = () => {
    console.log("Post clicked!");
    navigation.navigate('LocalLinkk - Post Type');
  };

  const changeimg = async () => {
    console.log("Change image clicked!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    const selectedImage = result.assets ? result.assets[0].uri : result.uri;

    console.log('Selected image URI: ', selectedImage);
    
    const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
    updateImage(userId, selectedImage);
  };
  
  async function updateImage(imageId, imageData) {
    const url2 = `${url}Users/users/imageChange/${imageId}`;
    const response = await fetch(url2, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    });

    if (response.status === 200) {
        console.log(`Image ${imageId} updated successfully`);
        setUserImage(imageData);
    } else {
        const errorData = await response.json();
        console.error('Error updating image:', errorData);
    }
  }

  const UserPostCount = async () => {
    try {
      const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
      const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
      const response = await axios.get(`${url}Companies/company/user/advertCount/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log(response.data);
      return response.data;

    } catch (error) {
      console.error(error);
    }
  }

  
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const count = await UserPostCount();
        setPostCount(count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostCount();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfileClick}>
        <Image
          source={userImage ? { uri: userImage } : user}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Text style={styles.Namecontainer}>{userData[1]} {userData[2]}</Text>
      <Text style={styles.CNamecontainer}>Profile Rank: {userData[5]}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Your Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePostClick} style={styles.postButton}>
          <Text style={styles.postButtonText}>Create A Post</Text>
        </TouchableOpacity>
      </View>

      {/* <PastPosts Too be added later
      <View style={styles.pastContainer}>
        <Text style={styles.pastText}>Your Past Posts:</Text>
        <Text style={styles.pastText2}>Total Posts: {postCount}</Text>
      </View>
      */}

      <Text style={styles.TextSoon}>Your Past Posts Will Show Up Here In a Future update. Please Stay Tuned!</Text>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Entypo name="cross" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={userImage ? { uri: userImage } : user}
            style={styles.expandedImage}
          />
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseEditModal}
      >
        <View style={styles.editModalContainer}>
          <TouchableOpacity style={styles.modalCloseButton2} onPress={handleCloseEditModal}>
            <Entypo name="cross" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.editModalTitle}>LocalLinkk Profile Editor</Text>
          <Text style={styles.editModalTitle}>Edit Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chooseImageButton} onPress={changeimg}>
            <Text style={styles.chooseImageButtonText}>Choose a Profile Image</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 7,
    alignItems: 'center',
    padding: 20,
    marginTop: 75,
    backgroundColor: '#045757',
    //backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  Namecontainer: {
    fontSize: 28,
    marginTop: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  CNamecontainer: {
    fontSize: 18,
    marginTop: 5,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',  // Aligns children in a row
    justifyContent: 'space-between',  // Distributes space evenly
    width: '100%',  // Makes sure buttons take up the full width of the container
    maxWidth: 400,  // Optional: to constrain the width of the buttons container
    marginTop: 20,  // Spacing above the buttons
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  editButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  postButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  postButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  pastContainer: {
    flexDirection: 'row',
    marginTop: 5,
    backgroundColor: '#045757',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '110%',
  },
  pastText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
  pastText2: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: 350,
    height: 350,
    resizeMode: 'cover',
    display: 'flex',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 280,
    right: 25,
    zIndex: 999,
  },
  modalCloseButton2: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    marginHorizontal: 50,
    marginVertical: 220,
    borderRadius: 10,
    padding: 20,
  },
  editModalTitle: {
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  chooseImageButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  chooseImageButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  TextSoon: {
    color: '#D3D3D3',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 150,
  },
});

export default Profile;
