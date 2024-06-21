import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import menu from '../assets/menu.png';
import user from '../assets/user-icon.png';


const { width } = Dimensions.get('window');

const Navbar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-width))[0]; // Initial value for sliding menu

    const handleMenuClick = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(slideAnim, {
            toValue: menuVisible ? -width : 0,
            duration: 600, // Adjust the duration as needed
            useNativeDriver: true,
        }).start();
    };

    const handleProfileClick = () => {
        console.log("Profile clicked!");
    };

    const handleNameClick = () => {
        console.log("Name clicked!");
    };

    const handleAllClick = () => {
        console.log("All clicked!");
    }

    const handleBusinessesClick = () => {
        console.log("Businesses clicked!");
    }

    const handleEventsClick = () => {
        console.log("Events clicked!");
    }

    const handleMapClick = () => {
        console.log("Map clicked!");
    };

    const handleCategoryClick = () => {
        console.log("Category clicked!");
    };

    const handleSettingsClick = () => {
        console.log("Settings clicked!");
    }

    const handleHelpClick = () => {
        console.log("Help clicked!");
    }

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
                        Macclesfield LocalLinkk</Text>
                        {/* change Macclesfield to the user selected location */}
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
                        <TouchableOpacity onPress={handleAllClick}>
                            <Text style={styles.menuContainerTEXT}>All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBusinessesClick}>
                            <Text style={styles.menuContainerTEXT}>Businesses</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleEventsClick}>
                            <Text style={styles.menuContainerTEXT}>Events</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleMapClick}>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuContainerTEXT}>Location</Text>
                            <FontAwesome6 name="map-location-dot" size={24} color="#1a1a1a" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCategoryClick}>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuContainerTEXT}>Category</Text>
                            <MaterialIcons name="category" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

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
                    
                    {/* Add more menu items as needed */}
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
        marginTop: 550,
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    menuContainerTEXT: {
        fontSize: 20,
        color: '#222222',
        marginRight: 10, // Space between text and icon
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
        // 0.15 on web, 0.75 on mobile
        width: width *  0.75, // size of menu
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
});

export default Navbar;
