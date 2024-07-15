import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const PastPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'http://192.168.127.93:5500/';

    // Function to fetch past posts
    const GetPastPosts = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`${url}Companies/companies/user/${userId}`);
                const data = await response.json();
                setPosts(data);
            } else {
                console.error('No userId found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching past posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the past posts when the component mounts
    useEffect(() => {
        GetPastPosts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Your Past Posts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <View key={post.id || index} style={styles.postContainer}>
                            <Text style={styles.postText}>{post.advert_text}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noPostsText}>No past posts available.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 110, // Adds top margin for positioning
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1, // Allows ScrollView content to grow and be scrollable
        alignItems: 'center',
    },
    postContainer: {
        flex: 1,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        width: '90%', // Adjust width to fit within the screen
    },
    postText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1, // Ensures the loading container takes up available space
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // Ensures the loading container is on top of other content
    },
    loadingText: {
        color: '#4CAF50',
        fontSize: 16,
        marginTop: 10,
    },
    noPostsText: {
        color: '#888', // Light grey color for no posts message
        fontSize: 16,
        marginTop: 20,
    },
});

export default PastPosts;
