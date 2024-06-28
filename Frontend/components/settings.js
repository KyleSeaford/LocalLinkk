import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';

const Settings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [profilefName, setProfilefName] = useState('');
    const [profilelname, setProfilelName] = useState('');

    const handleLogoutClick = () => {
        console.log("Logout clicked!");
    };

    const handleDeleteAccountClick = () => {
        if (deleteConfirm === 'DELETE') {
            console.log("Delete Account confirmed!");
        } else {
            console.log("Delete Account clicked but not confirmed.");
        }
    };

    const handleChangeEmailClick = () => {
        console.log("Change Email clicked!");
        console.log("New Email:", email);
    };

    const handleChangePasswordClick = () => {
        console.log("Change Password clicked!");
        console.log("New Password:", password);
    };

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
    };


    const handleSaveProfile = () => {
        console.log("Save Profile clicked!");
        console.log("First Name:", profilefName);
        console.log("Last Name:", profilelname);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>LocalLinkk Settings</Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Change Profile Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    value={profilefName}
                    onChangeText={setProfilefName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#aaa"
                    value={profilelname}
                    onChangeText={setProfilelName}
                />
                <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                    <Text style={styles.buttonText}>Save Profile Changes</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.sectionTitle}>Change Profile Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                />
                <TouchableOpacity style={styles.button} onPress={handleChangeEmailClick}>
                    <Text style={styles.buttonText}>Change Email</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.sectionTitle}>Change Profile Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleChangePasswordClick}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogoutClick}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type DELETE to confirm"
                    placeholderTextColor="#aaa"
                    value={deleteConfirm}
                    onChangeText={setDeleteConfirm}
                />
                <TouchableOpacity style={styles.button2} onPress={handleDeleteAccountClick}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 55,
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    text: {
        fontSize: 25,
        color: '#fff',
    },
    sectionContainer: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    button2: {
        backgroundColor: '#C70000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    chooseImageButton: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 10,
    },
});

export default Settings;
