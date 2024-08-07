import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SignupPage from './screens/signup';
import LoginScreen from './screens/login';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/settingScreen';
import HelpScreen from './screens/helpScreen';

import PostTypeScreen from './screens/postTypeScreen';

import DurationScreen from './screens/durationScreen';
import PaymentScreen from './screens/paymentScreen';

import ScreenPostSize from './screens/PostSizeScreen';
import ScreenPostSizeEvents from './screens/PostSizeEventScreen';

import ScreenPostTEXT from './screens/PostTEXTScreen';
import ScreenPostTEXTLink from './screens/PostTEXTLinkScreen';

import ScreenPostTEXTEvent from './screens/PostTEXTScreenEvent';
import ScreenPostTEXTLinkEvent from './screens/PostTEXTLinkScreenEvent';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await AsyncStorage.getItem('LL-0a85ee01463d2b959ec02504285cfccc');
      setIsAuthenticated(authStatus === 'b326b5062b2f0e69046810717534cb09');
    };

    checkAuthStatus();
  }, []);

  const updateUserImage = (newImage) => {
    setUserImage(newImage);
  };

  if (isAuthenticated === null) {
    // Optionally, render a loading screen while checking auth status
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen
            name="LocalLinkk"
            options={{ headerShown: false }}
          >
            {(props) => <HomeScreen {...props} userImage={userImage} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="LocalLinkk - Sign Up"
            component={SignupPage}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="LocalLinkk - Log In"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Profile"
          options={{ headerShown: false }}
        >
          {(props) => <ProfileScreen {...props} userImage={userImage} updateUserImage={updateUserImage} />}
        </Stack.Screen>

        <Stack.Screen
          name="LocalLinkk - Settings"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Help"
          component={HelpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LocalLinkk - Post Type"
          component={PostTypeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LocalLinkk - Duration"
          component={DurationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LocalLinkk - Company Post"
          component={ScreenPostSize}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Text Post"
          component={ScreenPostTEXT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Text Post With Web Link"
          component={ScreenPostTEXTLink}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LocalLinkk - Event Post"
          component={ScreenPostSizeEvents}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Text Post Event"
          component={ScreenPostTEXTEvent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Text Post With Web Link Event"
          component={ScreenPostTEXTLinkEvent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
