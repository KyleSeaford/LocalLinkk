import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/icon.png';
import { Feather } from '@expo/vector-icons';


const SignupPage = () => {
    const navigator = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    console.log('Signup clicked!');

    // Input validation
    if (!firstName || !lastName || !location || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    // Location validation
    if (!/^[A-Z]/.test(location)) {
      // Force first letter to be uppercase for data consistency
      setErrorMessage('Location must start with a capital letter');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long');
      return;
    }

    const url = `http://192.168.127.93:5500/`;

    const requestBody = {
      userFname: firstName,
      userLname: lastName,
      userLocation: location,
      userEmail: email,
      userPassword: password
    };

    try {
      const response = await fetch(`${url}Users/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.status === 201) {
        await AsyncStorage.setItem('LL_459a6f79ad9b13cbcb5f692d2cc7a94d', data.access_token);
        await AsyncStorage.setItem('LL-0a85ee01463d2b959ec02504285cfccc', 'b326b5062b2f0e69046810717534cb09');
        await AsyncStorage.setItem("LL-8e44f0089b076e18a718eb9ca3d94674", data.userID);

        console.log('User added successfully:', data);
        navigation.navigate('LocalLinkk', { screen: 'HomeScreen' });
      } else {
        console.error('Signup failed:', data.message);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred. Please try again');
    }
  };

  const handleLogin = () => {
    console.log('Login clicked!');
    navigator.navigate('LocalLinkk - Log In', { screen: 'LoginScreen' });
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>LocalLinkk Signup</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
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
        // Force first letter to be uppercase for data consistency
        onChangeText={(text) => setLocation(text.charAt(0).toUpperCase() + text.slice(1))}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{showPassword ? <Feather name="eye-off" size={24} color="black" /> : <Feather name="eye" size={24} color="black" />}</Text>
        </TouchableOpacity>
      </View>
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
},
toggleButton: {
    position: 'absolute',
    right: 16,
},
toggleButtonText: {
    fontWeight: 'bold',
    marginBottom: 15,
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
  error: {
    color: 'red',
    marginBottom: 16,
    marginTop: -10,
  },
});

export default SignupPage;
