import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const postTypes = [
    { type: 'Text Post', size: 'Text', sizeInPixels: '500x500', price: 'Free'},
    { type: 'Large Text Post - Coming soon!', size: 'Large Text', sizeInPixels: '550x550', price: '£1.00'},
    { type: 'Small Image - Coming soon!', size: 'Small', sizeInPixels: '600x600', price: '£2.00'},
    { type: 'Medium Image - Coming soon!', size: 'Medium', sizeInPixels: '800x800', price: '£3.50'},
    { type: 'Large Image - Coming soon!', size: 'Large', sizeInPixels: '1000x1000', price: '£5.00'},
    { type: 'Custom Design - Coming soon!', size: 'Large', sizeInPixels: '1000x1000', price: '£45.00' }
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

    const handleBackClick = () => {
        console.log('Back clicked!');
        navigation.goBack();
    };

    const handleNextClick = () => {
        if (selectedPostType) {
            console.log(`Proceeding with ${selectedPostType.type}`);
            navigation.navigate(`LocalLinkk - ${selectedPostType.type}`);
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
                <Text style={styles.text}>Chose a Post Size</Text>
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
});

export default PostSize;
