import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import user from '../assets/user-icon.png';

const Profile = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleProfileClick = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleEditClick = () => {
        console.log("Edit clicked!");
    };

    const handlePostClick = () => {
        console.log("Post clicked!");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleProfileClick}>
                <Image
                    source={user}
                    style={styles.logo}
                    // Will be the users profile picture
                />
            </TouchableOpacity>

            <Text style={styles.Namecontainer}>First Name -- Surname</Text>
            <Text style={styles.CNamecontainer}>Company Name</Text>
            {/* Will be the users name and company name */}

            <TouchableOpacity onPress={handleEditClick}>
                <Text style={styles.Editcontainer}>Edit Profile</Text>
                {/* When clicked, will allow user to edit name and companies name */}
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePostClick}>
                <Text style={styles.Postcontainer}>Create a New Post</Text> 
                {/* When clicked, will allow user to create a new post */}
            </TouchableOpacity>

            <View style={styles.Pastcontainer}>
                <Entypo name="triangle-down" size={24} color="black" />
                <Text style={styles.PostcontainerTEXT}>Your Past LocalLinkk's are Below</Text>
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
                        source={user}
                        style={styles.expandedImage}
                        // Expanded version of the profile picture
                    />
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
        marginTop: 10,
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
        marginLeft: 310,
        marginTop: -30,
        color: 'black',
        borderColor: '#E4E4E4',
        borderWidth: 2,
        borderRadius: 5,
        padding: 2,
        width: 105,
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
        borderRadius: 5,
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
});

export default Profile;
