import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as Sentry from 'sentry-expo';
// Screens
import AppScreen from './screens/AppScreen/AppScreen';

// import * as firebase from 'firebase';
import { FirestoreProvider } from './Services';
import { AuthProvider } from './Services';
import firebaseConfig from './Firebase/config'

export default function App() {

  Sentry.enableInExpoDevelopment = true
  Sentry.init({
    dsn: "https://a2fad81482694d9cbb34a2cecef73a9a@o473614.ingest.sentry.io/5695615",
    enableInExpoDevelopment: true,
    debug: true
  })

  // firebase.initializeApp(firebaseConfig);
  // LogBox.ignoreAllLogs()

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
