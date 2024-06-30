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
                    <Text style={styles.question}>Q1: How do I Choose my location?</Text>
                    <Text style={styles.answer}>A: Go to the settings menu and click on 'Location'</Text>
                    <Text style={styles.question}>Q2: How do I update my Profile picture?</Text>
                    <Text style={styles.answer}>A: Go to the profile page, click `edit` and then choose a new profile picture.</Text>
                    <Text style={styles.question}>Q3: How do I change my profile Name?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Profile Name' or go to the profile page and click `edit`.</Text>
                    <Text style={styles.question}>Q4: How do I change my profile's email address?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Email'</Text>
                    <Text style={styles.question}>Q5: How do I change my profile's password?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Password'</Text>
                    <Text style={styles.question}>Q6: How do I delete my account?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and type 'DELETE' in the confirmation box to delete your account.</Text>

                    <Text style={styles.sectionTitle}>Troubleshooting Guides</Text>
                    <Text style={styles.guideTitle}>App not loading?</Text>
                    <Text style={styles.guideText}>Ensure you have a stable internet connection and try restarting the app.</Text>
                    <Text style={styles.guideTitle}>Profile picture not updating?</Text>
                    <Text style={styles.guideText}>Ensure the image is less than 5MB and in a supported format (jpg, png).</Text>

                    <Text style={styles.sectionTitle}>Privacy & Legal</Text>
                    <Text style={styles.subSectionTitle}>Privacy Policy</Text>
                    <Text style={styles.policyText}>Our privacy policy outlines how we handle your data. <Text style={styles.link} onPress={() => { /* add link handler */ }}>Link to privacy policy</Text></Text>
                    <Text style={styles.subSectionTitle}>Terms of Service</Text>
                    <Text style={styles.policyText}>Our terms of service explain the rules of using our app. <Text style={styles.link} onPress={() => { /* add link handler */ }}>Link to terms of service</Text></Text>
                    <Text style={styles.subSectionTitle}>Data Storage</Text>
                    <Text style={styles.policyText}>Your data is securely stored and protected. <Text style={styles.link} onPress={() => { /* add link handler */ }}>Link to data storage policy</Text></Text>

                    <Text style={styles.sectionTitle}>Miscellaneous</Text>
                    <Text style={styles.subSectionTitle}>About Us</Text>
                    <Text style={styles.miscText}>Learn more about our app, company, and team. <Text style={styles.link} onPress={() => { /* add link handler */ }}>Link to about us</Text></Text>
                    <Text style={styles.subSectionTitle}>Version History</Text>
                    <Text style={styles.miscText}>View the version history of our app. <Text style={styles.link} onPress={() => { /* add link handler */ }}>Link to version history</Text></Text>
                </View>
            </ScrollView>
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
    scrollContainer: {
        //flex: 1,
        maxHeight: '10%', 
        minHeight: '60%',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
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
    link: {
        color: '#2196F3',
        textDecorationLine: 'underline',
    },
});

export default Help;
