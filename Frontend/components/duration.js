import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Duration = () => {
    const url = 'http://192.168.127.93:5500/';

    const navigation = useNavigation();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const defaultEndDate = new Date(today);
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    const defaultEndDateString = defaultEndDate.toISOString().split('T')[0];

    const [selectedDates, setSelectedDates] = useState({});
    const [endDate, setEndDate] = useState(defaultEndDateString);

    useEffect(() => {
        const markedDates = getMarkedDates(defaultEndDateString);
        setSelectedDates(markedDates);
    }, []);

    const handleBackToHomeClick = () => {
        console.log("Back to Home Page clicked!");
        navigation.navigate('LocalLinkk - Home');
    };

    const handleBackClick = () => {
        console.log('Back clicked!');
        navigation.goBack();
    };

    const handleNextClick = async () => {
        if (endDate) {
            // sets end date in 
            console.log(`End date: ${endDate}`);
            await AsyncStorage.setItem('endDate', endDate);

            // fetches post types
            const companyID = await AsyncStorage.getItem('companyID');
            const Response = await fetch(`${url}/Companies/company/${companyID}/PostType`);
            const data = await Response.json();
            console.log(data.message);
            // sets post type in AsyncStorage
            await AsyncStorage.setItem('postType', data.message);

            // if the end date is the default end date, the duration is 7 days, if it is not, the duration is the difference between the chosen end date and selected end date in days 
            // so if the post is 7 days it cost £2 but if its 10 days it £2 + £0.50 for each extra day
            // if the post is 7 days the cost is £2
            // if the post is 10 days the cost is £2 + £0.50 + £0.50 + £0.50 = £3.50
            // if the post is 14 days the cost is £2 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p = £5.50
            // if the post is 21 days the cost is £2 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p = £8.50

            // need to calculate the duration of the post

            // fetches the cost of the post

        } else {
            console.log('Please select an end date');
        }
    };

    const getMarkedDates = (endDateString) => {
        const markedDates = {};
        const endDate = new Date(endDateString);

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            markedDates[dateString] = { selected: true, marked: true, selectedColor: '#00adf5' };
        }

        const start = new Date(todayString);
        const end = new Date(endDateString);
        const range = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            range.push(new Date(d).toISOString().split('T')[0]);
        }

        range.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#00adf5' };
        });

        return markedDates;
    };

    const handleDayPress = (day) => {
        const date = new Date(day.timestamp);
        const dateString = date.toISOString().split('T')[0];

        // Ensure the selected date is on or after the 7th day from today
        const minEndDate = new Date(today);
        minEndDate.setDate(minEndDate.getDate() + 6);
        
        if (date < minEndDate) {
            return;
        }

        setEndDate(dateString);
        const newSelectedDates = getMarkedDates(dateString);
        setSelectedDates(newSelectedDates);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Duration of Post</Text>
            </View>

            <Text style={styles.instructionText}>Please select the duration of the post and continue to your next step</Text>

            <Calendar
                onDayPress={handleDayPress}
                markedDates={{ ...selectedDates }}
                theme={{
                    calendarBackground: '#1A1A1A',
                    textSectionTitleColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    arrowColor: '#ffffff',
                    monthTextColor: '#ffffff',
                    indicatorColor: '#ffffff',
                }}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                    <Text style={styles.backNextButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                    <Text style={styles.backNextButtonText}>Calculate Cost</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        backgroundColor: '#1A1A1A',
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
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
        flex: 1,
        textAlign: 'right',
    },
    instructionText: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 25,
        marginTop: 10,
        textAlign: 'center',
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

export default Duration;
