import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import logo from '../assets/icon.png';

const SignupPage = () => {
    const navigator = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        console.log('Signup clicked!');
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Location:', location);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const handleLogin = () => {
        console.log('Login clicked!');
        navigator.navigate('LocalLinkk - Log In');
    };

    return (
        <View style={styles.container}>

            <Image source={logo} style={styles.logo}/>

            <Text style={styles.title}>LocalLinkk Signup</Text>
            
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Town/City"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="none"
            />

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

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button2} onPress={handleLogin}>
                <Text style={styles.buttonText}>Have An Account - Log in</Text>
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
        marginTop: 90,
        borderRadius: 80,
    },
});

export default SignupPage;
