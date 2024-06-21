import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Barsearch = () => {

    const handleSearchClick = () => {
        console.log("Search clicked!");
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for a Business or Event..."
            />
            <TouchableOpacity style={styles.iconContainer} onPress={handleSearchClick}>
                <Ionicons name="search" size={24} color="#1a1a1a"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // 0 on web, 110 on mobile, not sure why this has to be different
        marginTop: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    
    input: {
        flex: 1,
        fontSize: 16,
    },
    
    iconContainer: {
        marginLeft: 10,
    },
});

export default Barsearch;
