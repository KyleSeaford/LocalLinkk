'use client'

import HomeScreen from "@/screens/HomeScreen";
import HelpScreen from "@/screens/HelpScreen";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

const App = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Settings" component={Settings} />
</Stack.Navigator>
);

export default App;