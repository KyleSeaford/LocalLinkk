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
                    <Text style={styles.question}>Q1: How do I choose my location?</Text> 
                    <Text style={styles.answer}>A: To select your location, go to the settings menu and tap on 'Location'. You can then choose from a list of available locations.</Text> 
                    <Text style={styles.question}>Q2: How do I update my profile picture?</Text> 
                    <Text style={styles.answer}>A: To update your profile picture, go to your profile page, tap the edit button, and select a new profile picture from your device's photo library.</Text> 
                    <Text style={styles.question}>Q3: How do I change my profile name?</Text> 
                    <Text style={styles.answer}>A: To change your profile name, go to the settings page, tap on 'Change Profile Name', and enter your new name in the text field. Make sure to save your changes by tapping the 'Save' button.</Text> 
                    <Text style={styles.question}>Q4: How do I change my profile email address?</Text> 
                    <Text style={styles.answer}>A: To change your profile email address, go to the settings page, tap on 'Change Email', and enter your new email address in the text field.</Text> 
                    <Text style={styles.question}>Q5: How do I change my profile password?</Text> 
                    <Text style={styles.answer}>A: To change your profile password, go to the settings page, tap on 'Change Password', and enter your new password. Make sure to save your changes by tapping the 'Save' button.</Text> 
                    <Text style={styles.question}>Q6: How do I delete my account?</Text> 
                    <Text style={styles.answer}>A: To delete your account, go to the settings page, tap on 'Delete Account', and confirm that you want to delete your account by typing 'DELETE' in the confirmation box. Note that this action is irreversible and will permanently delete all of your data associated with this account.</Text>
                    
                    <Text style={styles.sectionTitle}>Troubleshooting Guides</Text>
                    <Text style={styles.guideTitle}>App not loading?</Text>
                    <Text style={styles.guideText}>Try restarting the app or check if there are any updates available for download. If the issue persists, please contact our support team for assistance.</Text>
                    <Text style={styles.guideTitle}>Profile picture not updating?</Text>
                    <Text style={styles.guideText}>Make sure that the image is less than 5MB in size and in a supported format (jpg, png). If you're still having issues, try clearing the app's cache or restarting the app.</Text>

                    <Text style={styles.sectionTitle}>Privacy & Legal</Text>
                    <Text style={styles.subSectionTitle}>Privacy Policy</Text>
                    <Text style={styles.policyText}>Our privacy policy outlines how we handle your personal data, including what information we collect, how we use it, and how you can control its use. Please click here for more information:</Text>
                    <Text style={styles.subSectionTitle}>Terms of Service</Text>
                    <Text style={styles.policyText}>Our terms of service explain the rules of using our app and what is expected of users. Please click here for more information:</Text>
                    <Text style={styles.subSectionTitle}>Data Storage</Text>
                    <Text style={styles.policyText}>We take data security seriously and store all data securely. For more information on our data storage practices, please click here:</Text>

                    <Text style={styles.sectionTitle}>Miscellaneous</Text>
                    <Text style={styles.subSectionTitle}>About Us</Text>
                    <Text style={styles.miscText}>Learn more about our company, team, and mission by clicking here: </Text>
                    <Text style={styles.subSectionTitle}>Version History</Text>
                    <Text style={styles.miscText}>View the version history of our app by clicking here:</Text>
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
        minHeight: '40%',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    question: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    answer: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    guideTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    guideText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    subSectionTitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 5,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    policyText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    miscText: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 15,
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 5,
    },
    link: {
        color: '#2196F3',
        textDecorationLine: 'underline',
    },
});

export default Help;
