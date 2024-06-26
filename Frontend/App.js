import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SignupPage from './screens/signup';
import LoginScreen from './screens/login';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    };

    checkAuthStatus();
  }, []);

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
            component={HomeScreen}
            options={{ headerShown: false }}
          />
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
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
