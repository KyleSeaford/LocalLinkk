import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const Settings= () => {
    const navigation = useNavigation();
    
    const url = 'http://192.168.127.93:5000/'

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [profilefName, setProfilefName] = useState('');
    const [profilelname, setProfilelName] = useState('');
    const [userData, setUserData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogOutClick = () => {
        AsyncStorage.clear();
        navigation.navigate('LocalLinkk - Log In');
    }

    const handleDeleteAccountClick = async () => {
        if (deleteConfirm === 'DELETE') {
            try {
                const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
                const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
                await axios.delete(`${url}Users/users/remove/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Account deleted successfully");
                navigation.navigate('LocalLinkk - Log In', { screen: 'LoginScreen' });
                AsyncStorage.clear();
            } catch (error) {
                console.error(error);
            }
        }
        else {
            setErrorMessage('Please type DELETE to confirm account deletion');
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const validatePassword = (password) => {
        return password.length >= 5;
    }

    const handleChangeEmailClick = async () => {
        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
            const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
            await axios.put(`${url}Users/users/EmailChange`, null, {
                params: {
                    userID: userId,
                    userEmail: email,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setUserData(prevState => ({
                ...prevState,
                0: email,
            }));
            console.log("Email updated successfully");
            setErrorMessage('Email updated successfully');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePasswordClick = async () => {
        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 5 characters long');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
            const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
            await axios.put(`${url}Users/users/passwordChange`, null, {
                params: {
                    userID: userId,
                    userPassword: password,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Password updated successfully");
            setErrorMessage('Password updated successfully');
            window.location.reload();
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk');
    };

    const handleChangeName = async () => {
        try {
          const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
          const token = await AsyncStorage.getItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d');
          await axios.put(`${url}Users/users/nameChange`, null, {
            params: {
              userID: userId,
              userFname: profilefName,
              userLname: profilelname,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(prevState => ({
            ...prevState,
            1: profilefName,
            2: profilelname,
          }));
          console.log("Profile Name updated successfully");
          setErrorMessage('Profile Name updated successfully');
        } catch (error) {
          console.error(error);
        }
      };
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>LocalLinkk Settings</Text>
            </View>

            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

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
                <TouchableOpacity style={styles.button} onPress={handleChangeName}>
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

            <TouchableOpacity style={styles.button} onPress={handleLogOutClick}>
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
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default Settings;
