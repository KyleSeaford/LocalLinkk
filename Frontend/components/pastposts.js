import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';

const PastPosts = () => {

    const ShowPastPosts = () => {
        console.log("Search clicked!");
    };

    return (
        <View style={styles.container}>
            <Text>Past LocalLinkk's will be shown below</Text>
            {/* will get the users past posts from the database */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 110,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default PastPosts;
