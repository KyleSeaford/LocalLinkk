import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://192.168.127.93:5500/';

const { width, height } = Dimensions.get('window');

const NavbarSlide = ({ onClose }) => {
    const [menuVisible, setMenuVisible] = useState(true);
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

    return (
        <Modal
            transparent={true}
            visible={menuVisible}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.slideOutMenu, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconContainerTEXT}>LocalLinkk Settings</Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="close" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {/* Add your menu items here */}
                    <Text style={styles.menuItem}>Menu Item 1</Text>
                    <Text style={styles.menuItem}>Menu Item 2</Text>
                    {/* ... */}
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
    menuItem: {
        fontSize: 18,
        color: '#222222',
        marginBottom: 20,
        padding: 10,
    },
});

export default NavbarSlide;
