import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, TextInput, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { setBreadcrumbs } from './breadcrumbs';

const url = 'http://192.168.127.93:5500/';

const { width, height } = Dimensions.get('window');

const NavbarSlide = ({ onClose }) => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('Business');
    const slideAnim = useState(new Animated.Value(-width))[0];

    const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [searchLocation, setSearchLocation] = useState('');

    const [activeButton, setActiveButton] = useState('All');
    const [breadcrumbPath, setBreadcrumbPath] = useState('Category / Genre');
    const [userImage, setUserImage] = useState(null);

    const [categories, setCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);


    const [genres, setGenres] = useState([]);
    const [searchGenre, setSearchGenre] = useState('');
    const [genreDropdownVisible, setGenreDropdownVisible] = useState(false);

    useEffect(() => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
        fetchCategories();
        fetchLocations();
        fetchGenres();
    }, [menuVisible]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${url}Categories/category/0/children`);
            const data = await response.json();
            AsyncStorage.setItem('LL-b0b5ccb4a195a07fd3eed14affb8695f', JSON.stringify(data));
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCategoriechildren = async (category_id) => {
        try {
            const response = await fetch(`${url}Categories/category/${category_id}/children`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${url}Genres/genre/0/children`);
            const data = await response.json();
            AsyncStorage.setItem('LL-f90f211700b6afeaafe2f8016ddfad3d', JSON.stringify(data));
            setGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const fetchGenreChildren = async (genre_id) => {
        try {
            const response = await fetch(`${url}Genres/genre/${genre_id}/children`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching genre children:', error);
            return [];
        }
    };

    const fetchLocations = async () => {
        try {
            // Fetch locations from location API
            const response = await fetch(`${url}Locations/locations?ismajor=true`);
            const Locations = await response.json();
    
            // Extract location names
            const locationNames = Locations.map(location => location.name);
            console.log('Location names:', locationNames);
    
            // Extract unique locations using Set
            const uniqueLocations = Array.from(new Set(locationNames));
            setLocations(uniqueLocations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleCategoryClick = () => {
        setBreadcrumbs('');
        setGenreDropdownVisible(false);
        setLocationDropdownVisible(false);
        AsyncStorage.removeItem('LL-c4ef352f74e502ef5e7bc98e6f4e493d');
        AsyncStorage.removeItem('LL-7f80095aea4d66af1121f1fbe916066d');
        setDropdownVisible(!dropdownVisible);
    };

    const handleGenreClick = () => {
        setBreadcrumbs('');
        setDropdownVisible(false);
        setLocationDropdownVisible(false);
        AsyncStorage.removeItem('LL-7f80095aea4d66af1121f1fbe916066d');
        AsyncStorage.removeItem('LL-c4ef352f74e502ef5e7bc98e6f4e493d');
        setGenreDropdownVisible(!genreDropdownVisible);
    };

    const handleLocationClick = () => {
        setBreadcrumbs('');
        AsyncStorage.removeItem('LL-7f80095aea4d66af1121f1fbe916066d');
        AsyncStorage.removeItem('LL-c4ef352f74e502ef5e7bc98e6f4e493d');
        setDropdownVisible(false);
        setGenreDropdownVisible(false);
        setLocationDropdownVisible(!locationDropdownVisible);
        setDropdownVisible(false); 
    };
    
    const ChangeUsersLocation = async (newLocation) => {
        try {
            const userId = await AsyncStorage.getItem('LL-8e44f0089b076e18a718eb9ca3d94674');
            const response = await fetch(`${url}Users/users/locations/change/${userId}/${newLocation}`, {
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
        // set location in navbar top and close dropdown
        //setLocation(selectedLocation);
        setLocationDropdownVisible(false);
        ChangeUsersLocation(selectedLocation);
        setMenuVisible(!menuVisible);
    };

    const handleCategory = (category) => {
        setBreadcrumbs('');
        console.log(`Category clicked: ${category.category_name}`);
        console.log('Category ID:', category.category_id);
        AsyncStorage.setItem('LL-c4ef352f74e502ef5e7bc98e6f4e493d', category.category_id.toString());
        // Fetch and set children categories
        fetchCategoriechildren(category.category_id).then(children => {
            if (children.length > 0) {
                setCategories(children);
                console.log('Parent category:', category);
                console.log('Children categories:', children);
                setBreadcrumbPath(`prev => ${prev} >> ${category.category_name}`);
            } else {
                console.log('No children categories found');
                console.log(breadcrumbPath);
                setBreadcrumbs(`${breadcrumbPath} >> ${category.category_name}`);
                setDropdownVisible(false);
                setMenuVisible(false);
            }
        }); 
    };

    const handleGenre = (genre) => {
        setBreadcrumbs('');
        console.log(`Genre clicked: ${genre.genre_name}`);
        console.log('Genre ID:', genre.genre_id);
        AsyncStorage.setItem('LL-7f80095aea4d66af1121f1fbe916066d', genre.genre_id.toString());
        fetchGenreChildren(genre.genre_id).then(children => {
            if (children.length > 0) {
                setGenres(children);
                console.log('Parent genre:', genre);
                console.log('Children genres:', children);
                setBreadcrumbPath(`prev => ${prev} >> ${genre.genre_name}`);
            } else {
                console.log('No children genres found');
                console.log(breadcrumbPath);
                setBreadcrumbs(`${breadcrumbPath} >> ${genre.genre_name}`);
                setGenreDropdownVisible(false);
                setMenuVisible(false);
            }
        });
    };

    const handleButtonClick = (buttonName) => {
        console.log(`${buttonName} clicked!`);
        setActiveButton(buttonName);
    };

    const handleSettingsClick = () => {
        console.log("Settings clicked!");
        //navigation.navigate('LocalLinkk - Settings');
        navigation.navigate('LocalLinkk - Settings', { screen: 'SettingScreen' });
        setBreadcrumbs('');
        setMenuVisible(!menuVisible);
    };

    const handleHelpClick = () => {
        console.log("Help clicked!");
        navigation.navigate('LocalLinkk - Help', { screen: 'HelpScreen' });
        setBreadcrumbs('');
        setMenuVisible(!menuVisible);
    };

    const handlePostClick = () => {
        console.log("Post clicked!");
        navigation.navigate('LocalLinkk - Post Type');
        setBreadcrumbs('');
        setMenuVisible(!menuVisible);
    };

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

    const handleBackClick = () => {
        console.log('Back clicked!');
        AsyncStorage.getItem('LL-b0b5ccb4a195a07fd3eed14affb8695f').then(data => {
            setCategories(JSON.parse(data));
        });
        setBreadcrumbs('');
        AsyncStorage.getItem('LL-f90f211700b6afeaafe2f8016ddfad3d').then(data => {
            setGenres(JSON.parse(data));
        }
        );
        setBreadcrumbs('');
    };

    const renderCategoryDropdown = () => {
        const filteredCategories = categories.filter(category =>
            category.category_name.toLowerCase().includes(searchCategory.toLowerCase())
        );

        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.back} onPress={handleBackClick}>
                        <AntDesign name="back" size={24} color="black" />                    
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Category"
                        value={searchCategory}
                        onChangeText={setSearchCategory}
                    />
                </View>
                {filteredCategories.map((category) => (
                    <TouchableOpacity key={category.category_id} onPress={() => handleCategory(category)}>
                        <Text style={styles.dropdownItem}>{category.category_name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    const renderGenreDropdown = () => {
        const filteredGenres = genres.filter(genre =>
            genre.genre_name.toLowerCase().includes(searchGenre.toLowerCase())
        );
    
        return (
            <ScrollView style={styles.dropdownScroll}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.back} onPress={handleBackClick}>
                        <AntDesign name="back" size={24} color="black" />                    
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Genre"
                        value={searchGenre}
                        onChangeText={setSearchGenre}
                    />
                </View>
                {filteredGenres.map((genre) => (
                    <TouchableOpacity key={genre.genre_id} onPress={() => handleGenre(genre)}>
                        <Text style={styles.dropdownItem}>{genre.genre_name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

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
                    <Text style={styles.sectionItem}>Select a Category And Your Location</Text>
                    <TouchableOpacity onPress={handleLocationClick}>
                        <View style={styles.menuContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Location</Text>
                            <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

                    {locationDropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderLocationDropdown()}
                        </View>
                    )}

                    <TouchableOpacity onPress={handleCategoryClick}>
                        <View style={styles.menuContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Category</Text>
                            <MaterialIcons name="category" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderCategoryDropdown()}
                        </View>
                    )}
                </View>
            );
        } else if (activeSection === 'Events') {
            return (
                <View>
                    <Text style={styles.sectionItem}>Select a Genre And Your Location</Text>
                    <TouchableOpacity onPress={handleLocationClick}>
                        <View style={styles.menuContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Location</Text>
                            <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

                    {locationDropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderLocationDropdown()}
                        </View>
                    )}

                    <TouchableOpacity onPress={handleGenreClick}>
                        <View style={styles.menuContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Genres</Text>
                            <MaterialIcons name="event" size={25} color="black" />                        
                        </View>
                    </TouchableOpacity>

                    {genreDropdownVisible && (
                        <View style={styles.dropdown}>
                            {renderGenreDropdown()}
                        </View>
                    )}
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

                    <View style={styles.postContainer2}>
                        <TouchableOpacity onPress={handlePostClick}>
                            <Text style={styles.postContainerTEXT2}>Create a New Post</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menu2Container2}>
                        <TouchableOpacity onPress={handleSettingsClick} style={styles.menuItemContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Settings</Text>
                            <FontAwesome5 name="cogs" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleHelpClick} style={styles.menuItemContainer2}>
                            <Text style={styles.menuContainerTEXT2}>Help</Text>
                            <Entypo name="help-with-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
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

    back: {
        marginRight: 10,
    },
    menuContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    menu2Container2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 0,
        padding: 10,
    },
    inlineButtonsContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15,
        padding: 5,
    },
    postContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
    },
    postContainerTEXT2: {
        fontSize: 20,
        color: 'black',
        borderColor: 'black',
        padding: 5,
    },
    menuItemContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    menuContainerTEXT2: {
        fontSize: 20,
        color: '#222222',
        padding: 3,
    },
    menuContainerTEXT2: {
        fontSize: 20,
        color: '#222222',
        padding: 5,
        marginLeft: 20,
    },
    slideOutMenu2: {
        position: 'absolute',
        top: 110,
        left: 0,
        width: width * 0.75, // size of menu
        height: '100%',
        backgroundColor: '#E4E4E4',
        padding: 5,
        zIndex: 1000,
    },
    menuItem2: {
        fontSize: 18,
        color: '#222222',
        marginBottom: 20,
        padding: 10,
    },
    dropdown2: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginTop: 0,
        margin: 10,
        borderRadius: 5,
        maxHeight: height * 0.5, // Adjust max height as needed
    },
    dropdownScroll2: {
        maxHeight: height * 0.6, // Adjust max height for scrollable content
    },
    dropdownItem2: {
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    activeButton2: {
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
    },
    activeButton2: {
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
        padding: 0,
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        padding: 5,
        marginBottom: 0,
    },
    searchContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput2: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    searchIcon2: {
        padding: 10,
    },
});

export default NavbarSlide;
