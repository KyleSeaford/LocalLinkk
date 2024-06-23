import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

import menu from '../assets/menu.png';
import user from '../assets/user-icon.png';

const { width } = Dimensions.get('window');

const Navbar = () => {
    const navigation = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState('');
    const [predefinedLocations, setPredefinedLocations] = useState([
        'Macclesfield',
        'Manchester',
        'London',
        'Birmingham',
        'Liverpool',
        'Leeds',
        'Sheffield',
    ]);
    const [activeButton, setActiveButton] = useState('All');

    const slideAnim = useState(new Animated.Value(-width))[0];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://192.168.127.223/Categories/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
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
        console.log("Navigated to Profile");
    };

    const handleNameClick = () => {
        navigation.navigate('LocalLinkk - Home');
        console.log("Navigated to LocalLinkk");
    };

    const handleCategoryClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLocationClick = () => {
        setLocationDropdownVisible(!locationDropdownVisible);
    };

    const handlePredefinedLocationClick = (selectedLocation) => {
        console.log(`Selected location: ${selectedLocation}`);
        setLocation(selectedLocation);
        setLocationDropdownVisible(false);
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
                            {predefinedLocations.map((location, index) => (
                                <TouchableOpacity key={index} onPress={() => handlePredefinedLocationClick(location)}>
                                    <Text style={styles.dropdownItem}>{location}</Text>
                                </TouchableOpacity>
                            ))}
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
                            {categories.map((category) => (
                                <TouchableOpacity key={category.category_id} onPress={() => handleCategory(category)}>
                                    <Text style={styles.dropdownItem}>{category.category_name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <View style={styles.postContainer}>
                        <TouchableOpacity onPress={handlePostClick}>
                            <Text style={styles.postContainerTEXT}>Create a New Post</Text>
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
        marginTop: 490,
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
        margin: 10,
        borderRadius: 5,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    activeButton: {
        backgroundColor: '#d3d3d3', // Highlight color for active button
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
});

export default Navbar;
