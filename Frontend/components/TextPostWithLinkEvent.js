// need to sort out the scroll view
// need to navigate to the duration page after the post button is clicked

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEXTLinkPost = () => {
    const navigation = useNavigation();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [searchGenre, setSearchGenre] = useState('');
    const [Cname, setCname] = useState(""); // Company Name state
    const [Edate, setEdate] = useState(""); // Event Date state
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [advertText, setAdvertText] = useState(""); // Advert Text state
    const [charCount, setCharCount] = useState(0); // Character count for Advert Text
    const [eventName, setEventName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [townCity, setTownCity] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [advertPreview, setAdvertPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const url = 'http://192.168.127.93:5500/';

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleBackToHomeClick = () => {
        AsyncStorage.removeItem('LL-dc5d7d7557a8a2730c32bea281233f37');
        navigation.navigate('LocalLinkk');
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex according to expected phone number format
        return phoneRegex.test(phoneNumber);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validateWebsite = (website) => {
        const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return websiteRegex.test(website);
    }; 

    const validateDate = (date) => {
        // Regular expression to match DD-MM-YYYY format
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        return dateRegex.test(date);
    };

    const formatDate = (input) => {
        // Remove non-digit characters
        const inputDigits = input.replace(/\D/g, '');
    
        // Format the date as DD-MM-YYYY while typing
        if (inputDigits.length <= 2) return inputDigits; // Allow entering DD
        if (inputDigits.length <= 4) return `${inputDigits.slice(0, 2)}-${inputDigits.slice(2)}`; // Allow entering DD-MM
        if (inputDigits.length <= 8) return `${inputDigits.slice(0, 2)}-${inputDigits.slice(2, 4)}-${inputDigits.slice(4)}`; // Allow entering DD-MM-YYYY
    
        // Limit input to DD-MM-YYYY format
        return `${inputDigits.slice(0, 2)}-${inputDigits.slice(2, 4)}-${inputDigits.slice(4, 8)}`;
    };
    
    const getCoordinates = async (location) => {
        const response = await fetch(`${url}Locations/location/${location}`);
        const data = await response.json();
        console.log(data);

        if (data && data.lat !== undefined && data.lng !== undefined) {
            const lat = data.lat;
            console.log(lat);
            const lng = data.lng;
            console.log(lng);

            return { lat, lng };
        } else {
            throw new Error('Location not found');
        }
    };

    const handleNextClick = async () => {
        if (!eventName || !selectedGenre || !phoneNumber || !townCity || !Edate || !advertText || !Cname || !email || !website) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage('Invalid phone number');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        };
    
        if (!validateWebsite(website)) {
            setErrorMessage('Invalid website URL');
            return;
        };

        if (!validateDate(Edate)) {
            setErrorMessage('Invalid date format. Please use YYYY-MM-DD.');
            return;
        }

        setIsLoading(true); // Start loading indicator
        setErrorMessage(''); // Clear any previous error messages
        setAdvertPreview(null); // Clear previous preview

        try {
            const { lat, lng } = await getCoordinates(townCity);
            console.log(`Proceeding with details: ${eventName}, ${Cname}, ${selectedGenre}, ${phoneNumber}, ${townCity}, ${advertText}, ${Edate}, ${email}, ${website}`);
            console.log(`Coordinates: Latitude ${lat}, Longitude ${lng}`);

            const advert_type = 'TextCustom';
            const details = JSON.stringify({ eventName, selectedGenre, phoneNumber, townCity, lat, lng, advert_type, Cname, email, website, Edate });
            await AsyncStorage.setItem('LL-27792947ed5d5da7c0d1f43327ed9dab', details);

            const postAdvert = async (details) => {
                try {
                    const genre_id = genres.find(genre => genre.genre_name === selectedGenre).genre_id;
                    const userID2 = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
                    console.log('User ID:', userID2);
                    
                    const response = await fetch(`${url}/Events/?event_name=${eventName}&company_name=${Cname}&event_date=${Edate}&phone=${phoneNumber}&advert_text=${advertText}&created_by_user_id=${userID2}&latitude=${lat}&longitude=${lng}&genre_id=${genre_id}&website=${website}&email=${email}&advert_type=${advert_type}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(details),
                    });
                    const data = await response.json();
                    console.log('event added:', data);
                    await AsyncStorage.setItem('LL-866afa3572e9f6ca510cd75c79b8ff8f', data.event_id);
                    await AsyncStorage.removeItem('LL-27792947ed5d5da7c0d1f43327ed9dab');
                    return data;
                }
                catch (error) {
                    console.error('Error posting advert:', error);
                    await AsyncStorage.removeItem('LL-27792947ed5d5da7c0d1f43327ed9dab');
                }
            };

            const eventData = await postAdvert();

            if (eventData) {
                const showPreview = async () => {
                    try {
                        await AsyncStorage.getItem('LL-866afa3572e9f6ca510cd75c79b8ff8f').then(async eventIdData => {
                            const eventID = eventIdData;
                            console.log('Event ID:', eventID);

                            const response = await fetch(`${url}Events/${eventID}/advertPreview`);
                            const advertData = await response.json();
                            console.log('Advert preview:', advertData);
                            await AsyncStorage.setItem('LL-dc5d7d7557a8a2730c32bea281233f37', JSON.stringify(advertData));
                            await AsyncStorage.removeItem('LL-866afa3572e9f6ca510cd75c79b8ff8f');
                            setAdvertPreview(advertData.advert_text); // Set the advert preview text
                        });
                    } catch (error) {
                        console.error('Error fetching advert preview:', error);
                    }
                };

                await showPreview();
            }

        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    const handleBackClick = () => {
        console.log('Back clicked!');
        AsyncStorage.removeItem('LL-27792947ed5d5da7c0d1f43327ed9dab');
        navigation.goBack();
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${url}Genres/genre/0/children`);
            const data = await response.json();
            await AsyncStorage.setItem('LL-b0b5ccb4a195a07fd3eed14affb8695f', JSON.stringify(data));
            setGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const handleGenreClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const fetchGenreChildren = async (genre_id) => {
        try {
            const response = await fetch(`${url}Genres/genre/${genre_id}/children`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching genres:', error);
            return [];
        }
    };

    const handleGenre = (genre) => {
        fetchGenreChildren(genre.genre_id).then(children => {
            if (children.length > 0) {
                setGenres(children);
            } else {
                setDropdownVisible(false);
                setSelectedGenre(genre.genre_name);
            }
        });
    };

    const handleGenreBackClick = () => {
        AsyncStorage.getItem('LL-b0b5ccb4a195a07fd3eed14affb8695f').then(data => {
            setGenres(JSON.parse(data));
        });
    };

    const handlePostClick = async () => {
        AsyncStorage.removeItem('LL-dc5d7d7557a8a2730c32bea281233f37');
        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
            const response = await fetch(`${url}Users/users/TypeChange?userID=${userId}&userType=Poster`, {
                method: 'PUT'
            });
            const data = await response.json();
            console.log('User type changed:', data);

        } catch (error) {
            console.error('Error changing user type:', error);
        }
        navigation.navigate('LocalLinkk');
    };

    const handleAdvertTextChange = (text) => {
        if (text.length <= 84) {
            setAdvertText(text);
            setCharCount(text.length);
        }
    };


    const renderGenreDropdown = () => {
        const filteredGenres = genres.filter(genre =>
            genre.genre_name.toLowerCase().includes(searchGenre.toLowerCase())
        );

        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.back} onPress={handleGenreBackClick}>
                        <AntDesign name="back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                {filteredGenres.map((genre) => (
                    <TouchableOpacity key={genre.genre_id} onPress={() => handleGenre(genre)}>
                        <Text style={styles.dropdownItem}>{genre.genre_name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Your Event Details</Text>
            </View>

            <Text style={styles.instructionText}>Your details will be used to generate a text advert with a HyperLink.</Text>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Event Name"
                placeholderTextColor="#999"
                value={eventName}
                onChangeText={setEventName}
            />

            <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="#999"
                value={Cname}
                onChangeText={setCname}
            />

            <TouchableOpacity style={styles.categoryButton} onPress={handleGenreClick}>
                <Text style={styles.categoryButtonText}>
                    {selectedGenre ? selectedGenre : "Select Genre"}
                </Text>
            </TouchableOpacity>

            {dropdownVisible && renderGenreDropdown()}

            <TextInput
                style={styles.input}
                placeholder="Event Date (DD-MM-YYYY)"
                placeholderTextColor="#999"
                value={Edate}
                onChangeText={(text) => setEdate(formatDate(text))}
                maxLength={10}
                keyboardType='numeric'
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Website"
                placeholderTextColor="#999"
                value={website}
                onChangeText={setWebsite}
            />

            <TextInput
                style={styles.input}
                placeholder="Town / City"
                placeholderTextColor="#999"
                value={townCity}
                onChangeText={(text) => setTownCity(text.charAt(0).toUpperCase() + text.slice(1))}
                autoCapitalize="words"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                    style={styles.input2}
                    placeholder="Event Description"
                    placeholderTextColor="#999"
                    value={advertText}
                    onChangeText={handleAdvertTextChange}
                    maxLength={84}
                />
                <Text style={styles.charCountText}>{charCount}/84</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                    <Text style={styles.backNextButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                    <Text style={styles.backNextButtonText}>Show Preview</Text>
                </TouchableOpacity>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Generating preview...</Text>
                </View>
            )}

            {advertPreview && (
                <>
                    <View style={styles.previewContainer}>
                        {advertPreview.split('\n').map((line, index) => (
                            <Text key={index} style={styles.previewText}>{line}</Text>
                        ))}
                    </View>
                    <View style={styles.PostButton}>
                        <TouchableOpacity style={styles.backNextButton} onPress={handlePostClick}>
                            <Text style={styles.backNextButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        backgroundColor: '#1A1A1A',
        flexGrow: 1,
        paddingBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
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
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    categoryButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        marginBottom: 10,
    },
    categoryButtonText: {
        color: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
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
    dropdownScroll: {
        maxHeight: 470,
    },
    dropdownItem: {
        padding: 10,
        color: '#fff',
        fontSize: 16,
    },
    back: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    loadingText: {
        color: '#4CAF50',
        fontSize: 16,
        marginTop: 10,
    },
    previewContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        width: '100%',
        flex: 2,
        flexGrow: 2,

    },
    previewText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    PostButton: {
        marginTop: 15,
    },
    charCountText: {
        color: '#aaa',
        textAlign: 'right',
        fontSize: 13,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        marginTop: 20,
    },
    input2: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '95%',
    },
});

export default TEXTLinkPost;
