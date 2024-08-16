import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavbarSlide from './navbarSlide';

import menu from '../assets/menu.png';
import user from '../assets/transparent_picture.png';

const url = 'http://192.168.127.93:5500/';

const { width, height } = Dimensions.get('window');

const Navbar = () => {
    const navigation = useNavigation();
    const [showComponent, setShowComponent] = useState(false);
    const [location, setLocation] = useState('Unknown');
    const [userImage, setUserImage] = useState(null);

    useEffect(() => {
        fetchAndSetUserLocation();
    }, []);

    const fetchUsersLocation = async () => {
        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
            const response = await fetch(`${url}Users/users/locations/${userId}`);
            const userLOC = await response.json();

            const imageResponse = await fetch(`${url}Users/users/image/${userId}`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setUserImage(imageUrl);

            return userLOC.message;
        } catch (error) {
            console.error('Error fetching users location:', error);
            return 'Unknown';
        }
    };

    const fetchAndSetUserLocation = async () => {
        const userLocation = await fetchUsersLocation();
        setLocation(userLocation);
    };

    const handleClickMenu = () => {
        setShowComponent(!showComponent);
    };

    const handleProfileClick = () => {
        navigation.navigate('LocalLinkk - Profile');
    };

    const handleNameClick = () => {
        navigation.navigate('LocalLinkk');
    };

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={handleClickMenu}>
                    <Image source={menu} style={styles.menu} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleProfileClick}>
                    <Image source={userImage ? { uri: userImage } : user} style={styles.logo} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={handleNameClick}>
                        <Text style={styles.navTitle}>
                            {location} LocalLinkk
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showComponent && <NavbarSlide onClose={handleClickMenu} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#045757',
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
});

export default Navbar;
