import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faCommentAlt, faMap, faPlusSquare, faUser } from '@fortawesome/free-solid-svg-icons'

// Screens
import { HomeScreen } from '../HomeScreen/HomeScreen';
import { LoginScreen } from '../AuthScreen/LoginScreen';
import { ProfileScreen } from '../ProfileScreen/ProfileScreen';


import { useAuth } from '../../Services';

function NewItemScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>New Item!</Text>
    </View>
  );
}

function ChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AppScreen() {
  const { currentUser } = useAuth();
  if (currentUser()) {
      return (
         <Tab.Navigator
           screenOptions= {({ route }) => ({
             tabBarIcon: ({ focused, color, size }) => {
               let iconName;
               iconName = focused 
                   ? color='rgba(148, 2, 3, 1)'
                   : color='rgba(217, 72, 73, 1)'
               if (route.name === 'Home') {
                   return <FontAwesomeIcon icon={faMap} size={size} color={color} />;
                 } else if (route.name === 'NewItem') {
                   return <FontAwesomeIcon icon={faPlusSquare}  size={size} color={color} />;
                 } else if (route.name === 'Chat') {
                   return <FontAwesomeIcon icon={faCommentAlt}  size={size} color={color} />;
                 } else if (route.name === 'Profile') {
                   return <FontAwesomeIcon icon={faUser}  size={size} color={color} />;
                 }
             }
           })}
         >
           <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: () => { return null}}}  />
           <Tab.Screen name="NewItem" component={NewItemScreen} options={{tabBarLabel: () => { return null}}} />
           <Tab.Screen name="Chat" component={ChatScreen} options={{tabBarLabel: () => { return null}}} />
           <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: () => { return null}}} />
         </Tab.Navigator>
     );
  } else {
      return (
        <LoginScreen/>
      )
  }
  }
