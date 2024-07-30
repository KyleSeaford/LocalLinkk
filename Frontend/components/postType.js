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
            navigation.navigate('LocalLinkk - Company Post');
        } else if (selectedType === 'event') {
            navigation.navigate('LocalLinkk - Event Post');
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

            {selectedType && (
                <View style={styles.infoContainer}>
                    <View style={styles.speechBubble}>
                        <Text style={styles.infoText}>
                            {selectedType === 'company' 
                                ? 'Company Post:\n Share information about your company, including news, updates, and more. This option allows you to connect with your audience by providing insights into your organization, showcasing recent achievements, announcing new products, and sharing behind-the-scenes stories. It’s a great way to keep your customers and followers informed about what’s happening within your company and engage with them on a deeper level.'
                                : 'Event Post:\n Promote an upcoming event by sharing details that will attract attendees. This option is ideal for advertising conferences, workshops, webinars, or social gatherings. Highlight essential information such as the event date, time, location, and what attendees can expect. Use this opportunity to generate excitement, encourage registrations, and connect with potential participants who may benefit from your event.'}
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                            <Text style={styles.backNextButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                            <Text style={styles.backNextButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
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
        textAlign: 'center',
    },
    infoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    speechBubble: {
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
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
