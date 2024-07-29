import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PostType = () => {
    const navigation = useNavigation();
    const [selectedType, setSelectedType] = useState(null);

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleBackClick = () => {
        setSelectedType(null);
    };

    const handleNextClick = () => {
        if (selectedType === 'company') {
            navigation.navigate('LocalLinkk - Post');
        } else if (selectedType === 'event') {
            navigation.navigate('LocalLinkk - Event'); // Not built yet
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Select a Post Type</Text>
            </View>

            <Text style={styles.instructionText}>Please select the post type and continue to the next step</Text>

            {selectedType ? (
                <View style={styles.speechBubble}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {selectedType === 'company' 
                                ? 'Company Post: Share information about your company, news, updates, and more.'
                                : 'Event Post: Promote an upcoming event, share details, and attract attendees.'}
                        </Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                                <Text style={styles.backNextButtonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                                <Text style={styles.backNextButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.postTypeContainer}> 
                    <TouchableOpacity style={styles.postTypeButton} onPress={() => handleTypeSelect('company')}>
                        <MaterialIcons name="business" size={30} color="white" />
                        <Text style={styles.postTypeText}>Company Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postTypeButton} onPress={() => handleTypeSelect('event')}>
                        <MaterialIcons name="event" size={30} color="white" />
                        <Text style={styles.postTypeText}>Event Post</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#1A1A1A',
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 70,
    },
    backButton: {
        padding: 10,
    },
    text: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 25,
        marginTop: 10,
        textAlign: 'center',
    },
    postTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    postTypeButton: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    postTypeText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
    speechBubble: {
        position: 'relative',
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    infoBox: {
        width: '100%',
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        width: '100%',
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

export default PostType;
