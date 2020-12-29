import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

// Screens
import AppScreen from './screens/AppScreen/AppScreen';

// import * as firebase from 'firebase';
import { FirestoreProvider } from './Services';
import { AuthProvider } from './Services';
import firebaseConfig from './Firebase/config'

export default function App() {
  // firebase.initializeApp(firebaseConfig);


  return (
    <NavigationContainer>
      <FirestoreProvider>
        <AuthProvider>
          <AppScreen />
        </AuthProvider>
      </FirestoreProvider>
    </NavigationContainer>
  );
}
