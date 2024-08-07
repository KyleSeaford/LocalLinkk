import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const PostSize = () => {
    const navigation = useNavigation();
    const [postTypes, setPostTypes] = useState([]);
    const [selectedPostType, setSelectedPostType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = 'http://192.168.127.93:5500/';

    useEffect(() => {
        axios.get(`${url}Posts/posts`)
            .then(response => {
                console.log(response.data);
                const formattedPostTypes = response.data 
                    .map(postType => ({
                        id: postType.post_id,
                        type: postType.post_name,
                        size: postType.post_size,
                        sizeInPixels: postType.post_sizeinpixels,
                        price: postType.post_price,
                    }));
                setPostTypes(formattedPostTypes);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk');
    };

    const handlePostTypeClick = (postType) => {
        if (selectedPostType === postType) {
            setSelectedPostType(null);
            console.log(`${postType.type} Event closed!`);
        } else {
            setSelectedPostType(postType);
            console.log(`${postType.type} Event selected!`);
        }
    };

    const handleBackClick = () => {
        console.log('Back clicked!');
        navigation.goBack();
    };

    const handleNextClick = () => {
        if (selectedPostType) {
            console.log(`Proceeding with ${selectedPostType.type} Event`);
            navigation.navigate(`LocalLinkk - ${selectedPostType.type} Event`);
        } else {
            console.log('Please select a post type first');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error fetching post types. Please try again later.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Choose a Post Size</Text>
            </View>

            <ScrollView contentContainerStyle={styles.postTypesContainer}>
                {postTypes.map((postType) => (
                    <TouchableOpacity
                        key={postType.id}
                        style={[
                            styles.postTypeButton,
                            selectedPostType === postType && styles.postTypeButtonSelected
                        ]}
                        onPress={() => handlePostTypeClick(postType)}
                    >
                        <View style={styles.postTypeDetailsContainer}>
                            <View style={styles.postTypeInfoLeft}>
                                <Text style={styles.postTypeText}>{postType.type}</Text>
                                <Text style={styles.postTypeDetails}>Type: {postType.size}</Text>
                                <Text style={styles.postTypeDetails}>Size: {postType.sizeInPixels}</Text>
                            </View>
                            <Text style={styles.postTypePrice}>{postType.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                    <Text style={styles.backNextButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                    <Text style={styles.backNextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 55,
        paddingHorizontal: 20,
        backgroundColor: '#1A1A1A',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 15,
        backgroundColor: '#1A1A1A',
    },
    backButton: {
        padding: 10,
    },
    text: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    postTypesContainer: {
        flexGrow: 1,
        marginTop: 5,
    },
    postTypeButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    postTypeButtonSelected: {
        backgroundColor: '#4CAF50',
    },
    postTypeDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postTypeInfoLeft: {
        flex: 1,
    },
    postTypeText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'left',
    },
    postTypeDetails: {
        color: '#ccc',
        fontSize: 14,
    },
    postTypePrice: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginRight: 10,
    },
    postTypePreviewContainer: {
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    backNextButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    backNextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backNextButton2: {
        backgroundColor: '#848884',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PostSize;
