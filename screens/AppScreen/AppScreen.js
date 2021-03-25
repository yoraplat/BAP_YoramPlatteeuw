import React, { useEffect, useState } from "react";
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

  const [user, setUser] = useState(currentUser());

  // useEffect(() => {
  //   (async function getUser() {
  //     setUser(await currentUser());
  //   })()
  // }, [currentUser]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user)
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
        user
          ? <TabNav />
          : <StackNav />
      }
    </>
  );
}


