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
    const [cost, setCost] = useState(null);
    const [duration, setDuration] = useState(null);

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
            console.log(`End date: ${endDate}`);
            await AsyncStorage.setItem('endDate', endDate);

            const companyID = await AsyncStorage.getItem('companyID');
            const Response = await fetch(`${url}/Companies/company/${companyID}/PostType`);
            const data = await Response.json();
            console.log(data.message);
            await AsyncStorage.setItem('postType', data.message);

            const startDate = todayString;
            const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            console.log(`Duration: ${duration} days`);
            await AsyncStorage.setItem('duration', duration.toString());
            setDuration(duration);

            AsyncStorage.getItem('postType').then((postType) => {
                AsyncStorage.getItem('duration').then((duration) => {
                    fetch(`${url}/Posts/posts/${postType}/${duration}/cost`)
                        .then((Response2) => Response2.json())
                        .then((data2) => {
                            console.log(data2);
                            AsyncStorage.setItem('cost', data2.cost.toString());
                            setCost(data2.cost);
                        });
                });
            });

            await AsyncStorage.removeItem('postType');
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
                    marginTop: 10,
                    marginBottom: 10,
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

            {cost && duration && (
                <View style={styles.costBreakdownContainer}>
                    <View style={styles.row}>
                        <Text style={styles.costBreakdownFDays}>
                            Free Days: 7 days
                        </Text>
                        <Text style={styles.costBreakdownFDays}>
                            Total Duration: {duration} days
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.costBreakdownPDays}>
                            Paid Days: {duration > 7 ? duration - 7 : 0} days
                        </Text>
                        <Text style={styles.costBreakdownPDays}>
                            Expire Date: {endDate}
                        </Text>
                    </View>
                    <Text style={styles.costBreakdownText}>
                        Total Cost: £{cost}
                    </Text>

                    <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('Payment')}>
                        <Text style={styles.payButtonText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    costBreakdownContainer: {
        marginTop: 25,
        backgroundColor: '#2A2A2A',
        padding: 15,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    costBreakdownFDays: {
        color: '#fff',
        fontSize: 16,
    },
    costBreakdownPDays: {
        color: '#fff',
        fontSize: 16,
    },
    costBreakdownText: {
        marginTop: 10,
        color: '#00adf5',
        fontSize: 20,
        marginVertical: 5,
        textAlign: 'center',
    },
    payButton: {
        backgroundColor: '#00adf5',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Duration;
