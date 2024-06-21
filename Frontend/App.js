import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import Navbar from './components/navbar';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        <Stack.Screen name="LocalLinkk - Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LocalLinkk - Profile" component={ProfileScreen} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
