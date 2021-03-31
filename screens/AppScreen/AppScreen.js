import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faCommentAlt, faMap, faPlusSquare, faRegistered, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import theme from '../../Theme/theme.style';
import * as firebase from 'firebase';
// Screens
import { HomeScreen } from '../HomeScreen/HomeScreen';
import { LoginScreen } from '../AuthScreen/LoginScreen';
import { RegisterScreen } from '../AuthScreen/RegisterScreen';
import { ProfileScreen } from '../ProfileScreen/ProfileScreen';
import { ChatScreen } from '../ChatScreen/ChatScreen';
import { AddScreen } from '../AddScreen/AddScreen';
import { ResetScreen } from '../AuthScreen/ResetScreen';

import { useAuth } from '../../Services';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppScreen() {

  const { currentUser, logout } = useAuth();

  const [user, setUser] = useState(undefined);

  // Wait for user to load before returning any screen
  useEffect(() => {
    firebase.auth().onAuthStateChanged((res) => {
      setUser(res)
    })
  }, [])

  const TabNav = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused
              ? color = theme.FOCUS
              : color = theme.NO_FOCUS
            if (route.name === 'Home') {
              return <FontAwesomeIcon icon={faMap} size={size} color={color} />
            } else if (route.name === 'NewItem') {
              return <FontAwesomeIcon icon={faPlusSquare} size={size} color={color} />
            } else if (route.name === 'Chat') {
              return <FontAwesomeIcon icon={faCommentAlt} size={size} color={color} />
            } else if (route.name === 'Profile') {
              return <FontAwesomeIcon icon={faUser} size={size} color={color} />
            }
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="NewItem" component={AddScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: () => { return null } }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: () => { return null } }} />
      </Tab.Navigator>
    )
  }

  const StackNav = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
        <Tab.Screen name="Reset" component={ResetScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    )
  }

  return (
    <>
      {
        user === undefined
          ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            <Text style={{ top: 10, color: theme.PRIMARY_COLOR }}>Laden</Text>
          </View>
          : user
            ? <TabNav />
            : <StackNav />
      }
    </>
  );
}


