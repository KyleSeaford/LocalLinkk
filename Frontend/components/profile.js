import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';

import user from '../assets/user-icon.png';

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const url = 'http://192.168.127.93:5500/';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${url}Users/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
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
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
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
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update name');
    }
  };

  const handlePostClick = () => {
    console.log("Post clicked!");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfileClick}>
        <Image
          source={userData.userImg ? { uri: userData.userImg } : user}
          style={styles.logo}
        />
      </TouchableOpacity>

      <Text style={styles.Namecontainer}>{userData[1]} {userData[2]}</Text>
      <Text style={styles.CNamecontainer}>Account Type: {userData[5]}</Text>

      <TouchableOpacity onPress={handleEditClick}>
        <Text style={styles.Editcontainer}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePostClick}>
        <Text style={styles.Postcontainer}>Create a New Post</Text>
      </TouchableOpacity>

      <View style={styles.Pastcontainer}>
        <Entypo name="triangle-down" size={24} color="black" />
        <Text style={styles.PostcontainerTEXT}>Your Past LocalLinkk's</Text>
        <Entypo name="triangle-down" size={24} color="black" />
      </View>

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
            source={userData.userImg ? { uri: userData.userImg } : user}
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
          <Text style={{ fontSize: 20, marginBottom: 20 }}>Edit Your Name</Text>
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 60,
  },
  Namecontainer: {
    fontSize: 25,
    marginLeft: 160,
    marginTop: -120,
    color: '#fff',
  },
  CNamecontainer: {
    fontSize: 20,
    marginLeft: 160,
    marginTop: 10,
    color: 'white',
  },
  Editcontainer: {
    fontSize: 20,
    marginLeft: 350,
    marginTop: -29,
    color: 'black',
    borderColor: '#E4E4E4',
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    width: 75,
    backgroundColor: '#E4E4E4',
    textAlign: 'center',
  },
  Postcontainer: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 160,
    color: 'black',
    borderColor: '#E4E4E4',
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    width: 260,
    backgroundColor: '#E4E4E4',
    textAlign: 'center',
  },
  Pastcontainer: {
    flexDirection: 'row',
    marginTop: 20,
    color: 'black',
    borderColor: '#E4E4E4',
    borderWidth: 5,
    padding: 5,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  PostcontainerTEXT: {
    fontSize: 20,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 280,
    right: 30,
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
    backgroundColor: '#fff',
    marginTop: 350,
    marginBottom: 350,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  chooseImageButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  chooseImageButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Profile;
