import { default as React, useContext, useState, useEffect, createContext } from 'react';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  const currentUser = () => {
    const value = AsyncStorage.getItem('@NoWaste_User')
    if (value != null) {
      return value;
    } else {
      return null;
    }
  };

  const fetchUser = async () => {
    const uid = firebase.auth().currentUser.uid
    const user = await firebase.firestore().collection('/users').doc(uid).get()
    const data = user.data()
    return data
  };

  const updateUser = async (data) => {
    const uid = firebase.auth().currentUser.uid
    const user = await firebase.firestore().collection('/users').doc(uid).update({
      account_number: data.account_number,
      email: data.email,
      username: data.username,
      settings: {
        only_vegan: data.only_vegan,
        only_veggie: data.only_veggie,
      }
    })
  }

  const user_id = () => {
    const uid = firebase.auth().currentUser.uid
    return uid
  }

  const logout = () => {
    AsyncStorage.removeItem('@NoWaste_User');
    firebase.auth().signOut();
  }

  return (
    <AuthContext.Provider value={{ user_id, currentUser, logout, fetchUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthContext,
  AuthProvider,
  useAuth
}