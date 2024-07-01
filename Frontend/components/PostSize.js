import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const postTypes = [
    { type: 'Text Post', size: 'Text', sizeInPixels: '500x500', price: 'Free'},
    { type: 'Large Text Post - Coming soon!', size: 'Large Text', sizeInPixels: '550x550', price: '£1.00'},
    { type: 'Small Image - Coming soon!', size: 'Small', sizeInPixels: '600x600', price: '£2.00'},
    { type: 'Medium Image - Coming soon!', size: 'Medium', sizeInPixels: '800x800', price: '£3.50'},
    { type: 'Large Image - Coming soon!', size: 'Large', sizeInPixels: '1000x1000', price: '£4.00'},
    { type: 'Extra-Large Image - Coming soon!', size: 'Extra-Large', sizeInPixels: '1200x1200', price: '£5.00' }
];

const PostSize = () => {
    const navigation = useNavigation();
    const [selectedPostType, setSelectedPostType] = useState(null);

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    const handlePostTypeClick = (postType) => {
        if (selectedPostType === postType) {
            setSelectedPostType(null);
            console.log(`${postType.type} closed!`);
        } else {
            setSelectedPostType(postType);
            console.log(`${postType.type} selected!`);
        }
    };

    const handleNextClick = () => {
        if (selectedPostType) {
            console.log(`Proceeding with ${selectedPostType.type}`);
            // Handle navigation to the next page or other actions
        } else {
            console.log('Please select a post type first');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Create a Post</Text>
            </View>

            <ScrollView contentContainerStyle={styles.postTypesContainer}>
                {postTypes.map((postType, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.postTypeButton,
                            selectedPostType === postType && styles.postTypeButtonSelected
                        ]}
                        onPress={() => handlePostTypeClick(postType)}
                    >
                        <View style={styles.postTypeDetailsContainer}>
                            <View style={styles.postTypeInfoLeft}>
                                <Text style={styles.postTypeText}>{postType.type}</Text>
                                <Text style={styles.postTypeDetails}>Size: {postType.size}</Text>
                                <Text style={styles.postTypeDetails}>Size in pixels: {postType.sizeInPixels}</Text>
                            </View>
                            <Text style={styles.postTypePrice}>{postType.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextClick}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
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
    },
    postTypesContainer: {
        flexGrow: 1,
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
    nextButton: {
        backgroundColor: '#4CAF50',
        marginTop: 20,
        padding: 15,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
        marginLeft: '60%',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default PostSize;
