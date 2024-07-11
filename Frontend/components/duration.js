import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const Duration= () => {
    const navigation = useNavigation();
    const url = 'http://192.168.127.93:5500/'


    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Settings</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 55,
        flex: 1,
        paddingHorizontal: 20,
    },
});

export default Duration;
