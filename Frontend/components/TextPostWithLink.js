import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEXTLinkPost = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchCategory, setSearchCategory] = useState('');
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [website, setWebsite] = useState("");
    const [townCity, setTownCity] = useState("");
    const [advertText, setAdvertText] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [advertPreview, setAdvertPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [charCount, setCharCount] = useState(0);

    const url = 'http://192.168.127.93:5500/';

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleBackToHomeClick = () => {
        AsyncStorage.removeItem('advertPreview');
        navigation.navigate('LocalLinkk - Home');
    };

    const handleContinueClick = () => {
        console.log('Continue clicked!');
        AsyncStorage.removeItem('advertPreview');
        navigation.navigate('LocalLinkk - Duration');
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
        if (!companyName || !selectedCategory || !email || !phoneNumber || !website || !townCity || !advertText) {
            setErrorMessage('Please fill in all fields');
            return;
        };
    
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        };
    
        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage('Invalid phone number');
            return;
        };
    
        if (!validateWebsite(website)) {
            setErrorMessage('Invalid website URL');
            return;
        };
    
        setIsLoading(true); // Start loading indicator
        setErrorMessage(''); // Clear any previous error messages
        setAdvertPreview(null); // Clear previous preview
    
        try {
            const { lat, lng } = await getCoordinates(townCity);
            console.log(`Proceeding with details: ${companyName}, ${selectedCategory}, ${email, phoneNumber, website, townCity}`);
            console.log(`Coordinates: Latitude ${lat}, Longitude ${lng}`);
    
            const advert_type = 'TextCustom';
            const details = JSON.stringify({ companyName, selectedCategory, email, phoneNumber, website, townCity, advertText, lat, lng, advert_type });
            await AsyncStorage.setItem('details', details);

            const postAdvert = async (details) => {
                try {
                    const category_id = categories.find(category => category.category_name === selectedCategory).category_id;
                    const userID = await AsyncStorage.getItem('userId');
                    const response = await fetch(`${url}Companies/company?Company%20Name=${companyName}&Category%20Id=${category_id}&Latitude=${lat}&Longitude=${lng}&Company%20Email=${email}&Company%20Phone=${phoneNumber}&Company%20Website=${website}&Advert%20Type=${advert_type}&Advert%20Text=${advertText}&User%20Id=${userID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(details),
                    });
                    const data = await response.json();
                    console.log('company added:', data);
                    await AsyncStorage.setItem('companyID', data.company_id);
                    await AsyncStorage.removeItem('details');
                    return data;
                }
                catch (error) {
                    console.error('Error posting advert:', error);
                    await AsyncStorage.removeItem('details');
                }
            };

            const companyData = await postAdvert();

            if (companyData) {
                const showPreview = async () => {
                    try {
                        await AsyncStorage.getItem('companyID').then(async companyIdData => {
                            const companyID = companyIdData;
                            console.log('Company ID:', companyID);
                            
                            const response = await fetch(`${url}Companies/company/${companyID}/advertPreview`);
                            const advertData = await response.json();
                            console.log('Advert preview:', advertData);
                            await AsyncStorage.setItem('advertPreview', JSON.stringify(advertData));
                            await AsyncStorage.removeItem('companyID');
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
        AsyncStorage.removeItem('details');
        navigation.goBack();
    };

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

    const handleAdvertTextChange = (text) => {
        if (text.length <= 84) {
            setAdvertText(text);
            setCharCount(text.length);
        }
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

    const renderAdvertPreview = (advertPreview) => {
        const renderPreviewLine = (line, index) => {
            const regex = /(https?:\/\/[^\s]+)/g;
            const parts = line.split(regex);
            return (
                <Text key={index} style={styles.previewText}>
                    {parts.map((part, i) => (
                        regex.test(part) ? (
                            <Text key={i} style={styles.linkText} onPress={() => Linking.openURL(part)}>
                                {part}
                            </Text>
                        ) : (
                            part
                        )
                    ))}
                </Text>
            );
        };

        return advertPreview.split('\n').map((line, index) => renderPreviewLine(line, index));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToHomeClick}>
                    <Octicons name="home" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.text}>Your Company Details</Text>
            </View>

            <Text style={styles.instructionText}>Enter your company details. They will be used to generate your text advert with your HyperLink.</Text>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="#999"
                value={companyName}
                onChangeText={setCompanyName}
            />

            <TouchableOpacity style={styles.categoryButton} onPress={handleCategoryClick}>
                <Text style={styles.categoryButtonText}>
                    {selectedCategory ? selectedCategory : "Select Category"}
                </Text>
            </TouchableOpacity>

            {dropdownVisible && renderCategoryDropdown()}

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
                onChangeText={(text) => setTownCity(text.charAt(0).toUpperCase() + text.slice(1))}
                autoCapitalize="words"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                    style={styles.input2}
                    placeholder="Advert Text"
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
                        {renderAdvertPreview(advertPreview)}
                    </View>
                    <View style={styles.PostButton}>
                        <TouchableOpacity style={styles.backNextButton} onPress={handleContinueClick}>
                            <Text style={styles.backNextButtonText}>Continue</Text>
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
        marginTop: 0,
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
        marginVertical: 20,
        marginTop: 5,
        marginBottom: 5,
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
    },
    previewText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    linkText: {
        color: '#4CAF50',
        textDecorationLine: 'underline',
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
