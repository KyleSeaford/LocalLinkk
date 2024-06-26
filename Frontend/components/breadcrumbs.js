// cant figure out how to get the breadcrumbs to work too tired to think

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Crumbs = () => {

    const url = `http://192.168.127.93:5500/Categories/category/`;

    const fetchCrumbs = async () => {
        try {
            const category_id = await AsyncStorage.getItem('category');
            const response = await axios.get(`${url}${category_id}/breadcrumbs`);
            console.log(response.data); // Log the response data
            return response.data;
    
        } catch (error) {
            console.error(error);
        };
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.TextCon}>Category >> Automotive >> Car Hire</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        alignItems: 'start',
    },
    TextCon: {
        fontSize: 16,
        color: '#fff',
    },
});

export default Crumbs;
