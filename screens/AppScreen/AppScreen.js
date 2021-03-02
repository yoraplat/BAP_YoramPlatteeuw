import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faCommentAlt, faMap, faPlusSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import theme from '../../Theme/theme.style';

// Screens
import { HomeScreen } from '../HomeScreen/HomeScreen';
import { LoginScreen } from '../AuthScreen/LoginScreen';
import { ProfileScreen } from '../ProfileScreen/ProfileScreen';
import { ChatScreen } from '../ChatScreen/ChatScreen';
import { AddScreen } from '../AddScreen/AddScreen';
import { useAuth } from '../../Services';


const Tab = createBottomTabNavigator();

export default function AppScreen() {

  const { currentUser } = useAuth();

  const [user, setUser] = useState(currentUser());

  useEffect(() => {
    (async function getUser() {
      // console.log(await currentUser())
      setUser(await currentUser());
    })();
  }, [currentUser]);

  return (
    user ?
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused
              ? color = theme.FOCUS
              : color = theme.NO_FOCUS
            if (route.name === 'Home') {
              return <FontAwesomeIcon icon={faMap} size={size} color={color} />;
            } else if (route.name === 'NewItem') {
              return <FontAwesomeIcon icon={faPlusSquare} size={size} color={color} />;
            } else if (route.name === 'Chat') {
              return <FontAwesomeIcon icon={faCommentAlt} size={size} color={color} />;
            } else if (route.name === 'Profile') {
              return <FontAwesomeIcon icon={faUser} size={size} color={color} />;
            }
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="NewItem" component={AddScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: () => { return null } }} />
      </Tab.Navigator>
      :
      <LoginScreen />
  );
}
