import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://192.168.127.93:5500/';

const { width, height } = Dimensions.get('window');

const NavbarSlide = ({ onClose }) => {
    const [menuVisible, setMenuVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('Business');
    const slideAnim = useState(new Animated.Value(-width))[0];

    useEffect(() => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [menuVisible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: -width,
            duration: 600,
            useNativeDriver: true,
        }).start(() => {
            setMenuVisible(false);
            onClose();
        });
    };

    const handleMenuClick = () => {
        handleClose();
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const renderSectionContent = () => {
        if (activeSection === 'Business') {
            return (
                <View>
                    <Text style={styles.sectionItem}>Business Item 1</Text>
                    {/* Add more business items here */}
                </View>
            );
        } else if (activeSection === 'Events') {
            return (
                <View>
                    <Text style={styles.sectionItem}>Event Item 2</Text>
                    {/* Add more event items here */}
                </View>
            );
        }
    };

    return (
        <Modal
            transparent={true}
            visible={menuVisible}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.slideOutMenu, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.menuContainer}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconContainerTEXT}>LocalLinkk Settings</Text>
                            <TouchableOpacity onPress={handleMenuClick}>
                                <Ionicons name="close" size={24} color="#1a1a1a" />
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity
                            onPress={() => handleSectionClick('Business')}
                            style={[styles.button, activeSection === 'Business' ? styles.activeButton : null]}
                        >
                            <Text style={styles.menuContainerTEXT}>Business</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSectionClick('Events')}
                            style={[styles.button, activeSection === 'Events' ? styles.activeButton : null]}
                        >
                            <Text style={styles.menuContainerTEXT}>Events</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.contentContainer}>
                        {renderSectionContent()}
                    </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    slideOutMenu: {
        position: 'absolute',
        top: 110,
        left: 0,
        width: width * 0.75,
        height: '100%',
        backgroundColor: '#E4E4E4',
        padding: 5,
        zIndex: 1000,
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 0,
    },
    activeButton: {
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
    },
    menuItem: {
        fontSize: 18,
        color: '#222222',
        marginBottom: 20,
        padding: 10,
    },
    menuContainer: {
        padding: 10,
    },
    menuContainerTEXT: {
        fontSize: 20,
        color: '#222222',
        padding: 3,
    },
    contentContainer: {
        padding: 10,
    },
    sectionItem: {
        fontSize: 18,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default NavbarSlide;
