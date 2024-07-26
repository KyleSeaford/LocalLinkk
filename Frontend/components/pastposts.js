import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PastPosts = () => {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'http://192.168.127.93:5500/';

    // Function to fetch past posts
    const GetPastPosts = async () => {
        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
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

    // Function to handle the re-post button click
    const handlePostClick = () => {
        console.log('Re-post button clicked');
        navigation.navigate('LocalLinkk - Post');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <View key={post.id || index} style={styles.postWrapper}>
                            <View style={styles.postContentContainer}>
                                <View style={styles.postContainer}>
                                    <Text style={styles.postText}>{post.advert_text}</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.postButton} onPress={handlePostClick} >
                                        <Text style={styles.postButtonText}>Re-Post</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        flex: 2,
        marginTop: 135, // Adds top margin for positioning
    },
    scrollViewContainer: {
        padding: 20,
    },
    postWrapper: {
        marginBottom: 10, // Space between posts
    },
    postContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    postText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        marginLeft: 25,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 135, // Adds top margin for positioning
    },
    loadingText: {
        color: '#4CAF50',
        fontSize: 16,
        marginTop: 10,
    },
    noPostsText: {
        textAlign: 'center',
        color: '#888', // Light grey color for no posts message
        fontSize: 16,
        marginTop: 30,
    },
});

export default PastPosts;
