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
import ScreenPostSize from './screens/PostSizeScreen';
import ScreenPostTEXT from './screens/PostTEXTScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
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
            name="LocalLinkk - Home"
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
          name="LocalLinkk - Post"
          component={ScreenPostSize}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalLinkk - Text Post"
          component={ScreenPostTEXT}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
