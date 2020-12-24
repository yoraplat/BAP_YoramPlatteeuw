import { default as React, useContext, useState, useEffect, createContext } from 'react';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {

  const checkUserState = async () => {
    try {
      const value = await AsyncStorage.getItem('NoWaste_user')
      if(value != null) {
        return true;
      }
    } catch(e) {
      return false;
    }
  };
  
  const currentUser = () => {
    if(firebase.auth().currentUser != null) {
      return firebase.auth().currentUser;
    } else {
      return false;
    }
  };

  const logout = () => {
    firebase.auth().signOut();
  }

    return (
      <AuthContext.Provider value={{ checkUserState, currentUser, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

export {
  AuthContext,
  AuthProvider,
  useAuth
}