import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import menu from '../assets/menu.png';
import user from '../assets/user-icon.png';

const Navbar = () => {
    const handleProfileClick = () => {
        console.log("Profile clicked!");
    };

    const handleMenuClick = () => {
        console.log("Menu clicked!");
    }

    const handleNameClick = () => {
        console.log("Name clicked!");
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
                        <Text style={styles.navTitle}>Macclesfield LocalLinkk</Text>  
                        {/* change Macclesfield to the user selected location */}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#045757',
    },
    navBar: {
        // need to make it so its only like this on mobile, web it will be directly at the top
        // needs to change to 0 on web
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#044343',
    },
    menu: {
        // needs to change to 0 on web
        marginTop: 50,
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 5,
    },
    logo: {
        // needs to change to 0 on web
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
        // needs to change to 0 on web
        marginTop: 50,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
  });

export default Navbar;
