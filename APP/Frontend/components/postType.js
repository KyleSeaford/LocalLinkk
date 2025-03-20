import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PostType = () => {
    const navigation = useNavigation();
    const [selectedType, setSelectedType] = useState('company');  // Default to 'company'

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk');
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleNextClick = () => {
        if (selectedType) {
            const screen = selectedType === 'company' ? 'LocalLinkk - Company Post' : 'LocalLinkk - Event Post';
            navigation.navigate(screen);
        }
    };

    const descriptions = {
        company: 'Share relevant information about your company, including news, updates, and other insights. This option enables you to connect meaningfully with your audience by offering a glimpse into your organization, showcasing recent achievements, announcing new products, and sharing behind-the-scenes stories. It’s an excellent way to keep your customers and followers informed about what’s taking place in your company and engage with them on a deeper, more personal level. \n\nPrices start from £2.00 up to £45.00.',
        
        event: 'Promote an upcoming event by sharing engaging details that will attract attendees. This option is perfect for advertising conferences, workshops, webinars, or social gatherings. Highlight crucial information such as the event date, time, location, and what attendees can expect to experience. Use this opportunity to spark excitement, encourage registrations, and connect with potential participants who might benefit from your event. \n\nPrices start from £2.00 up to £45.00.'
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Choose a Post Size</Text>
            </View>

            <Text style={styles.instructionText}>Please select the post type and continue to the next step</Text>

            <View style={styles.postTypeContainer}>
                {['company', 'event'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.postTypeButton,
                            selectedType === type && styles.selectedButton
                        ]}
                        onPress={() => handleTypeSelect(type)}
                        accessibilityLabel={`Select ${type} post type`}
                    >
                        <MaterialIcons
                            name={type === 'company' ? 'business' : 'event'}
                            size={30}
                            color="white"
                        />
                        <Text style={styles.postTypeText}>{type === 'company' ? 'Company Post' : 'Event Post'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedType && (
                <View style={styles.infoContainer}>
                    <View style={styles.speechBubble}>
                        <Text style={styles.infoText}>{descriptions[selectedType]}</Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.nextButton} onPress={handleNextClick} accessibilityLabel="Proceed to next step">
                            <Text style={styles.backNextButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.instructionText}>Advertise for less than a cup of coffee.</Text>

                </View>
            )}
        </View>
    );
}

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
    selectedButton: {
        backgroundColor: '#2E7D32',
        borderColor: '#ffffff',
        borderWidth: 2,
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
    backNextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },

});

export default PostType;
