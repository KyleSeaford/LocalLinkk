import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const url = 'http://192.168.127.93:5500/';

export const setBreadcrumbs = (breadcrumbs) => {
    //  function can be used to set the breadcrumbs state
    breadcrumbsStateSetter(breadcrumbs);
};

let breadcrumbsStateSetter = null;

const Crumbs = () => {
    const [breadcrumbs, setBreadcrumbsState] = useState('');

    breadcrumbsStateSetter = setBreadcrumbsState;

    const fetchCrumbs = async () => {
        try {
            const category_id = await AsyncStorage.getItem('LL-c4ef352f74e502ef5e7bc98e6f4e493d');
            const response = await axios.get(`${url}Categories/category/${category_id}/breadcrumbs`);
            setBreadcrumbsState(response.data.breadcrumbs);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCrumbs();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.TextCon}>{breadcrumbs}</Text>
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
