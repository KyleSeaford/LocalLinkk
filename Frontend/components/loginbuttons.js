import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import logo from '../assets/icon.png';

const LoginPage = () => {
    const navigator = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login clicked!');
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const handleSignup = () => {
        console.log('Signup clicked!');
        navigator.navigate('LocalLinkk - Sign Up');
    };

    return (
        <View style={styles.container}>

            <Image source={logo} style={styles.logo}/>

            <Text style={styles.title}>LocalLinkk Login</Text>
            
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
});

export default LoginPage;
