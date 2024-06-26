import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

import menu from '../assets/menu.png';
import user from '../assets/user-icon.png';

const { width, height } = Dimensions.get('window');

const Navbar = () => {
    const navigation = useNavigation();

    // server url
    const url = 'http://192.168.127.223/';

    // local url for testing
    const url2 = 'http://192.168.127.93:5500/';


    const fetchUsersLocation = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`${url2}Users/users/locations/${userId}`);
            const userLOC = await response.json();
            return userLOC.message;
        } catch (error) {
            console.error('Error fetching users location:', error);
            return 'Unknown'; // Return a default value in case of an error
        }
    }

    const [menuVisible, setMenuVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [activeButton, setActiveButton] = useState('All');
    const [searchLocation, setSearchLocation] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    const slideAnim = useState(new Animated.Value(-width))[0];

    useEffect(() => {
        fetchCategories();
        fetchLocations();
        fetchAndSetUserLocation();
    }, []);

    const fetchAndSetUserLocation = async () => {
        const userLocation = await fetchUsersLocation();
        setLocation(userLocation);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${url}Categories/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLocations = async () => {
        // get all locations
        try {
            const response = await fetch(`${url2}Users/users/locations`);
            const Locations = await response.json();
            // Extract unique locations using Set
            const uniqueLocations = Array.from(new Set(Locations.map(user => user.userLocation)));
            setLocations(uniqueLocations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };
    
    const handleMenuClick = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(slideAnim, {
            toValue: menuVisible ? -width : 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    };

    const handleProfileClick = () => {
        navigation.navigate('LocalLinkk - Profile');
    };

    const handleNameClick = () => {
        navigation.navigate('LocalLinkk - Home');
    };

    const handleCategoryClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLocationClick = () => {
        setLocationDropdownVisible(!locationDropdownVisible);
    };

    const ChangeUsersLocation = async (newLocation) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await fetch(`${url2}Users/users/locations/change/${userId}/${newLocation}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userLocation: newLocation }),
            });
            const data = await response.json();
            console.log('Location updated:', data.message);
            setLocation(newLocation);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    }

    const handlePredefinedLocationClick = (selectedLocation) => {
        console.log(`Selected location: ${selectedLocation}`);
        setLocation(selectedLocation);
        setLocationDropdownVisible(false);
        ChangeUsersLocation(selectedLocation);
    };

    const handleCategory = (category) => {
        console.log(`Category clicked: ${category.category_name}`);
        setDropdownVisible(false); // Close the category dropdown after clicking
    };

    const handleButtonClick = (buttonName) => {
        console.log(`${buttonName} clicked!`);
        setActiveButton(buttonName);
    };

    const handleSettingsClick = () => {
        console.log("Settings clicked!");
    };

    const handleHelpClick = () => {
        console.log("Help clicked!");
    };

    const handlePostClick = () => {
        console.log("Post clicked!");
    };

    const handleLogOutClick = () => {
        AsyncStorage.clear();
        setMenuVisible(!menuVisible);
        navigation.navigate('LocalLinkk - Log In');
    }

    const renderLocationDropdown = () => {
        const filteredLocations = locations.filter(location =>
            location.toLowerCase().includes(searchLocation.toLowerCase())
        );

        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Location"
                        value={searchLocation}
                        onChangeText={setSearchLocation}
                    />
                    <Ionicons name="search" size={24} color="#1a1a1a" style={styles.searchIcon} />
                </View>
                {filteredLocations.map((location, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePredefinedLocationClick(location)}>
                        <Text style={styles.dropdownItem}>{location}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    const renderCategoryDropdown = () => {
        const filteredCategories = categories.filter(category =>
            category.category_name.toLowerCase().includes(searchCategory.toLowerCase())
        );

        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Category"
                        value={searchCategory}
                        onChangeText={setSearchCategory}
                    />
                    <Ionicons name="search" size={24} color="#1a1a1a" style={styles.searchIcon} />
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
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={handleMenuClick}>
                    <Image
                        source={menu}
                        style={styles.menu}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleProfileClick}>
                    <Image
                        source={user}
                        style={styles.logo}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={handleNameClick}>
                        <Text style={styles.navTitle}>
                            {location} LocalLinkk
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="slide"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Animated.View style={[styles.slideOutMenu, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconContainerTEXT}>LocalLinkk Settings</Text>
                        <TouchableOpacity onPress={handleMenuClick}>
                            <Ionicons name="close" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            onPress={() => handleButtonClick('All')}
                            style={[styles.button, activeButton === 'All' ? styles.activeButton : null]}
                        >
                            <Text style={styles.menuContainerTEXT}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleButtonClick('Businesses')}
                            style={[styles.button, activeButton === 'Businesses' ? styles.activeButton : null]}
                        >
                            <Text style={styles.menuContainerTEXT}>Businesses</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleButtonClick('Events')}
                            style={[styles.button, activeButton === 'Events' ? styles.activeButton : null]}
                        >
                            <Text style={styles.menuContainerTEXT}>Events</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleLocationClick}>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuContainerTEXT}>Location</Text>
                            <FontAwesome5 name="map-marker-alt" size={24} color="#1a1a1a" />
                        </View>
                    </TouchableOpacity>

                    {locationDropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderLocationDropdown()}
                        </View>
                    )}

                    <TouchableOpacity onPress={handleCategoryClick}>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuContainerTEXT}>Category</Text>
                            <MaterialIcons name="category" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderCategoryDropdown()}
                        </View>
                    )}

                    <View style={styles.postContainer}>
                        <TouchableOpacity onPress={handlePostClick}>
                            <Text style={styles.postContainerTEXT}>Create a New Post</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={handleLogOutClick} style={styles.menuItemContainer}>
                            <Text style={styles.menuContainerTEXT}>Log Out</Text>
                            <Ionicons name="log-out" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menu2Container}>
                        <TouchableOpacity onPress={handleSettingsClick} style={styles.menuItemContainer}>
                            <Text style={styles.menuContainerTEXT}>Settings</Text>
                            <FontAwesome5 name="cogs" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleHelpClick} style={styles.menuItemContainer}>
                            <Text style={styles.menuContainerTEXT}>Help</Text>
                            <Entypo name="help-with-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#045757',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        padding: 10,
        borderBottomWidth: 1,
    },
    iconContainerTEXT: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#222222',
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    menu2Container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 0,
    },
    postContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 420,
    },
    postContainerTEXT: {
        fontSize: 20,
        color: 'black',
        borderColor: '#4CBB17',
        borderWidth: 2,
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#4CBB17',
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    menuContainerTEXT: {
        fontSize: 20,
        color: '#222222',
    },
    navBar: {
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#044343',
    },
    menu: {
        marginTop: 50,
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 2,
    },
    logo: {
        marginTop: 50,
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    navTitle: {
        marginTop: 50,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    slideOutMenu: {
        position: 'absolute',
        top: 110,
        left: 0,
        width: width * 0.75, // size of menu
        height: '100%',
        backgroundColor: '#E4E4E4',
        padding: 5,
        zIndex: 1000,
    },
    menuItem: {
        fontSize: 18,
        color: '#222222',
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginTop: 0,
        margin: 10,
        borderRadius: 5,
        maxHeight: height * 0.4, // Adjust max height as needed
    },
    dropdownScroll: {
        maxHeight: height * 0.5, // Adjust max height for scrollable content
    },
    dropdownItem: {
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    activeButton: {
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
        padding: 5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    searchIcon: {
        padding: 10,
    },
});

export default Navbar;

