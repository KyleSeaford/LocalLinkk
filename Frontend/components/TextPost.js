import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEXTPost = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchCategory, setSearchCategory] = useState('');
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [website, setWebsite] = useState("");
    const [townCity, setTownCity] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleBackToHomeClick = () => {
        navigation.navigate('LocalLinkk - Home');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex according to expected phone number format
        return phoneRegex.test(phoneNumber);
    };
    
    const validateWebsite = (website) => {
        const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return websiteRegex.test(website);
    };

    const getCoordinates = async (location) => {
        const apiKey = '08bb878c2d3d4eb6af9ef8f0c7fa16fb'; // Replace with your OpenCage API key
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { lat, lng };
        } else {
            throw new Error('Location not found');
        }
    };
    
    const handleNextClick = async () => {
        if (!companyName || !selectedCategory || !email || !phoneNumber || !website || !townCity) {
            setErrorMessage('Please fill in all fields');
            return;
        }
    
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        }
    
        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage('Invalid phone number');
            return;
        }
    
        if (!validateWebsite(website)) {
            setErrorMessage('Invalid website URL');
            return;
        }
    
        try {
            const { lat, lng } = await getCoordinates(townCity);
            console.log(`Proceeding with details: ${companyName}, ${selectedCategory}, ${email}, ${phoneNumber}, ${website}, ${townCity}`);
            console.log(`Coordinates: Latitude ${lat}, Longitude ${lng}`);
    
            const details = JSON.stringify({ companyName, selectedCategory, email, phoneNumber, website, townCity, lat, lng });
            await AsyncStorage.setItem('details', details);
            
            // TODO: create a preview page to display the entered details in the default format for chose post type, for text will go straight to the preview, for imgs it will go to the duration page
            // TODO: on the preview page top bar as usual, title "LocalLinkk - Post Preview", preview of the post, cost of the post and two buttons "Back" and "Post"

            setErrorMessage(''); // Clear error message on success
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    
    const handleBackClick = () => {
        console.log('Back clicked!');
        AsyncStorage.removeItem('details');
        navigation.goBack();
    };

    const url = 'http://192.168.127.93:5500/';

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${url}Categories/category/0/children`);
            const data = await response.json();
            await AsyncStorage.setItem('categories', JSON.stringify(data));
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const fetchCategoryChildren = async (category_id) => {
        try {
            const response = await fetch(`${url}Categories/category/${category_id}/children`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    const handleCategory = (category) => {
        fetchCategoryChildren(category.category_id).then(children => {
            if (children.length > 0) {
                setCategories(children);
            } else {
                setDropdownVisible(false);
                setSelectedCategory(category.category_name);
            }
        });
    };

    const handleCategoryBackClick = () => {
        AsyncStorage.getItem('categories').then(data => {
            setCategories(JSON.parse(data));
        });
    };

    const renderCategoryDropdown = () => {
        const filteredCategories = categories.filter(category =>
            category.category_name.toLowerCase().includes(searchCategory.toLowerCase())
        );

        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.back} onPress={handleCategoryBackClick}>
                        <AntDesign name="back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                {filteredCategories.map((category) => (
                    <TouchableOpacity key={category.category_id} onPress={() => handleCategory(category)}>
                        <Text style={styles.dropdownItem}>{category.category_name}</Text>
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
                <Text style={styles.text}>Your Company Details</Text>
            </View>

            <Text style={styles.instructionText2}>Create a LocalLinkk Text Post, Step 1:</Text>

            <Text style={styles.instructionText}>Enter your company details. They will be used to generate your text advert.</Text>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="#999"
                value={companyName}
                onChangeText={setCompanyName}
            />

            <TouchableOpacity style={styles.categoryButton} onPress={handleCategoryClick}>
                <Text style={styles.categoryButtonText}>{selectedCategory || 'Select a Category'}</Text>
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={styles.dropdown}>
                    {renderCategoryDropdown()}
                </View>
            )}

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
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
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
                onChangeText={setTownCity}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backNextButton2} onPress={handleBackClick}>
                    <Text style={styles.backNextButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backNextButton} onPress={handleNextClick}>
                    <Text style={styles.backNextButtonText}>Next</Text>
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
        marginBottom: 35,
        marginTop: 10,
        textAlign: 'center',
    },
    instructionText2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#aaa',
        marginBottom: 5,
        marginTop: 10,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    categoryButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        marginBottom: 20,
    },
    categoryButtonText: {
        color: '#fff',
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
    dropdown: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
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
});

export default TEXTPost;
