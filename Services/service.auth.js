import { default as React, useContext, useState, useEffect, createContext } from 'react';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {

  const currentUser = () => {
    
      const value = AsyncStorage.getItem('@NoWaste_User')
      if(value != null) {
        return value;
      } else {
        return null;
      }
  };
  
  // const currentUser = () => {
  //   if(firebase.auth().currentUser != null) {
  //     return firebase.auth().currentUser;
  //   } else {
  //     return false;
  //   }
  // };

  const logout = () => {
    AsyncStorage.removeItem('@NoWaste_User');
    firebase.auth().signOut();
  }

    return (
      <AuthContext.Provider value={{currentUser, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

export {
  AuthContext,
  AuthProvider,
  useAuth
}