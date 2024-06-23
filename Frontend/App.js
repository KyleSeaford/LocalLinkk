import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignupPage from './screens/signup';
import LoginScreen from './screens/login';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name="LocalLinkk - Sign Up" component={SignupPage} options={{ headerShown: false }} />
        <Stack.Screen name="LocalLinkk - Log In" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocalLinkk - Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocalLinkk - Profile" component={ProfileScreen} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
