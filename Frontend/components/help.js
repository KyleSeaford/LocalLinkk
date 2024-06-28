// page wont scroll and im not sure why
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';

const Help = () => {
    const [contactMessage, setContactMessage] = useState('');

    const handleSendContactMessage = () => {
        console.log("Contact message sent:", contactMessage);
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Help & Support</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FAQs</Text>
                    <Text style={styles.question}>Q1: How do I reset my password?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and click on 'Change Password'.</Text>
                    <Text style={styles.question}>Q2: How do I update my profile picture?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and choose a new profile picture.</Text>
                    <Text style={styles.question}>Q3: How do I delete my account?</Text>
                    <Text style={styles.answer}>A: Go to the settings page and type 'DELETE' in the confirmation box to delete your account.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message here..."
                        placeholderTextColor="#aaa"
                        value={contactMessage}
                        onChangeText={setContactMessage}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSendContactMessage}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                    <Text style={styles.contactInfo}>You can also reach us at: support@example.com</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Troubleshooting Guides</Text>
                    <Text style={styles.guideTitle}>App not loading?</Text>
                    <Text style={styles.guideText}>Ensure you have a stable internet connection and try restarting the app.</Text>
                    <Text style={styles.guideTitle}>Profile picture not updating?</Text>
                    <Text style={styles.guideText}>Ensure the image is less than 5MB and in a supported format (jpg, png).</Text>
                    <Text style={styles.guideTitle}>Notifications not working?</Text>
                    <Text style={styles.guideText}>Check your device settings to allow notifications for our app.</Text>

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Legal</Text>
                    <Text style={styles.subSectionTitle}>Privacy Policy</Text>
                    <Text style={styles.policyText}>Our privacy policy outlines how we handle your data. [Link to privacy policy]</Text>
                    <Text style={styles.subSectionTitle}>Terms of Service</Text>
                    <Text style={styles.policyText}>Our terms of service explain the rules of using our app. [Link to terms of service]</Text>
                    <Text style={styles.subSectionTitle}>Data Storage</Text>
                    <Text style={styles.policyText}>Your data is securely stored and protected. [Link to data storage policy]</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Miscellaneous</Text>
                    <Text style={styles.subSectionTitle}>About Us</Text>
                    <Text style={styles.miscText}>Learn more about our app, company, and team. [Link to about us]</Text>
                    <Text style={styles.subSectionTitle}>Version History</Text>
                    <Text style={styles.miscText}>View the version history of our app. [Link to version history]</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 20,
    },
    container: {
        flexGrow: 1,
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
});

export default Help;
