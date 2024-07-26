import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payment = () => {
    const navigation = useNavigation();

    const [nameOnCard, setNameOnCard] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    const handlePaymentSubmit = async () => {
        if (!validateCardDetails()) {
            return;
        }
        cost = await AsyncStorage.getItem('cost');
        console.log('Payment Submitted!');
        console.log('details:', {nameOnCard, cardNumber, expirationDate, cvv, billingAddress, city, state, zipCode, country, cost});
        AsyncStorage.removeItem('cost');
        AsyncStorage.removeItem('duration');
        // Add payment processing logic here
    };

    const validateCardDetails = () => {
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            setErrorMessage('Card number should be 16 digits.');
            return false;
        }
        const [month, year] = expirationDate.split('/');
        if (month > 12 || month < 1 || year.length !== 2) {
            setErrorMessage('Expiration date should be in MM/YY format.');
            return false;
        }
        if (cvv.length !== 3) {
            setErrorMessage('CVV should be 3 digits.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const formatCardNumber = (number) => {
        return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const handleCardNumberChange = (number) => {
        setCardNumber(formatCardNumber(number));
    };

    const formatExpirationDate = (date) => {
        return date.replace(/\s?\/?\s?/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
    };

    const handleExpirationDateChange = (date) => {
        setExpirationDate(formatExpirationDate(date));
    };

    const handleNameOnCardChange = (name) => {
        setNameOnCard(name.replace(/\b\w/g, (c) => c.toUpperCase()));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Payment Zone</Text>
            </View>

            <Text style={styles.instructionText}>Please enter your payment details below</Text>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Name on Card"
                placeholderTextColor="#aaa"
                value={nameOnCard}
                onChangeText={handleNameOnCardChange}
            />

            <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
            />

            <TextInput
                style={styles.input}
                placeholder="Expiration Date (MM/YY)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={5}
                value={expirationDate}
                onChangeText={handleExpirationDateChange}
            />

            <TextInput
                style={styles.input}
                placeholder="CVV"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
                value={cvv}
                onChangeText={setCvv}
            />

            <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor="#aaa"
                value={billingAddress}
                onChangeText={setBillingAddress}
            />

            <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#aaa"
                value={city}
                onChangeText={setCity}
            />

            <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#aaa"
                value={state}
                onChangeText={setState}
            />

            <TextInput
                style={styles.input}
                placeholder="Zip Code"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={zipCode}
                onChangeText={setZipCode}
            />

            <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor="#aaa"
                value={country}
                onChangeText={setCountry}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handlePaymentSubmit}>
                <Text style={styles.submitButtonText}>Pay Securely</Text>
            </TouchableOpacity>

            <Text style={styles.instructionText2}>All of your personal details are safe and secure</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        backgroundColor: '#1A1A1A',
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 70,
    },
    backButton: {
        padding: 10,
    },
    text: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
    },
    instructionText: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'center',
    },
    instructionText2: {
        fontSize: 10,
        color: '#aaa',
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Payment;
