import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as Sentry from 'sentry-expo';
// Screens
import AppScreen from './screens/AppScreen/AppScreen';

// import * as firebase from 'firebase';
import { FirestoreProvider } from './Services';
import { AuthProvider } from './Services';
import firebaseConfig from './Firebase/config'

Sentry.init({
  dsn: "https://9ddff79d729145a4a8bcf32941037497@o473614.ingest.sentry.io/5695623",
  enableInExpoDevelopment: true,
  debug: true
})

export default function App() {

  // firebase.initializeApp(firebaseConfig);
  // LogBox.ignoreAllLogs()

  try {
    return (
      <NavigationContainer>
        <FirestoreProvider>
          <AuthProvider>
            <AppScreen />
          </AuthProvider>
        </FirestoreProvider>
      </NavigationContainer>
    );
  } catch (e) {
    throw new Error(e.message)
  }
  
}
