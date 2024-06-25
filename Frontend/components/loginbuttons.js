import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/icon.png';


const LoginPage = () => {
    const navigator = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        console.log('Login clicked!');

        // Input validation
        if (!email || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        const url = `http://192.168.127.93:5500/Users/users/login`;

        const requestBody = {
            userEmail: email,
            userPassword: password
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            await AsyncStorage.setItem('token', data.access_token);
            await AsyncStorage.setItem("isAuthenticated", "true");
            //window.localStorage.setItem('token', data.access_token);
            //window.localStorage.setItem("isAuthenticated", true);

            if (response.status === 200) {
                console.log('User logged in successfully:', data);
                navigation.navigate('LocalLinkk - Home', { screen: 'HomeScreen' });
            } else {
                console.error('Login failed:', data.message);
                setErrorMessage(data.message);
                AsyncStorage.removeItem('token');
                AsyncStorage.removeItem('isAuthenticated');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred. Please try again');
        }
    };

    const handleSignup = async () => {
        console.log('Signup clicked!');
        //navigator.navigate('LocalLinkk - Sign Up');
        navigation.navigate('LocalLinkk - Sign Up', { screen: 'SignupPage' });
    };

    return (
        <View style={styles.container}>

            <Image source={logo} style={styles.logo}/>

            <Text style={styles.title}>LocalLinkk Login</Text>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button2} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create An Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 90,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: '#2196F3',
        borderRadius: 8,
        alignItems: 'center',
    },
    button2: {
        width: '100%',
        padding: 7,
        backgroundColor: '#000814',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 24,
        borderRadius: 80,
    },
    error: {
        color: 'red',
        marginBottom: 16,
        marginTop: -10,
    },
});

export default LoginPage;
