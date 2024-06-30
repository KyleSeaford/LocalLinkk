import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Help = () => {
    const navigation = useNavigation();

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>LocalLinkk Help</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FAQs</Text>
                    <Text style={styles.question}>Q1: How do I Choose my location</Text>
                    <Text style={styles.answer}>A: Go to the settings menu and click on 'Location'</Text>
                    <Text style={styles.question}>Q2: How do I update my Profile picture?</Text>
                    <Text style={styles.answer}>A: Go to the profile page, click `edit` and then choose a new profile picture.</Text>
                    <Text style={styles.question}>Q3: How do I change my profile Name?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Profile Name' or go to the profile page and click `edit`.</Text>
                    <Text style={styles.question}>Q4: How do I change my profiles email address?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Email'</Text>
                    <Text style={styles.question}>Q5: How do I change my profiles password</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Password'</Text>
                    <Text style={styles.question}>Q6: How do I delete my account?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and type 'DELETE' in the confirmation box to delete your account.</Text>

                    <Text style={styles.sectionTitle}>Troubleshooting Guides</Text>
                    <Text style={styles.guideTitle}>App not loading?</Text>
                    <Text style={styles.guideText}>Ensure you have a stable internet connection and try restarting the app.</Text>
                    <Text style={styles.guideTitle}>Profile picture not updating?</Text>
                    <Text style={styles.guideText}>Ensure the image is less than 5MB and in a supported format (jpg, png).</Text>

                    {/* change the links to the real link */}
                    <Text style={styles.sectionTitle}>Privacy & Legal</Text>
                    <Text style={styles.subSectionTitle}>Privacy Policy</Text>
                    <Text style={styles.policyText}>Our privacy policy outlines how we handle your data. <a href="https://github.com">Link to privacy policy</a></Text>
                    <Text style={styles.subSectionTitle}>Terms of Service</Text>
                    <Text style={styles.policyText}>Our terms of service explain the rules of using our app. <a href="https://github.com">Link to terms of service</a></Text>
                    <Text style={styles.subSectionTitle}>Data Storage</Text>
                    <Text style={styles.policyText}>Your data is securely stored and protected. <a href="https://github.com">Link to data storage policy</a></Text>

                    <Text style={styles.sectionTitle}>Miscellaneous</Text>
                    <Text style={styles.subSectionTitle}>About Us</Text>
                    <Text style={styles.miscText}>Learn more about our app, company, and team. <a href="https://github.com">Link to about us</a></Text>
                    <Text style={styles.subSectionTitle}>Version History</Text>
                    <Text style={styles.miscText}>View the version history of our app. <a href="https://github.com">Version history</a></Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 55,
        marginHorizontal: 20,
    },
    scrollContainer: {
        maxHeight: '10%', 
        minHeight: '60%',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginBottom: 30,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        marginTop: 20,
    },
    question: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
    },
    answer: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    contactInfo: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 10,
    },
    guideTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
    },
    guideText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
    },
    subSectionTitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 5,
    },
    policyText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
    },
    miscText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#1A1A1A',
    },
    text: {
        fontSize: 25,
        color: '#fff',
    },
});

export default Help;
