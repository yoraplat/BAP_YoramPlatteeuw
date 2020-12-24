import { default as React, useContext, useState, createContext } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

const FirestoreContext = createContext();
const useFirestore = () => useContext(FirestoreContext);

const FirestoreProvider = ({children}) => {
    
  const dbh = firebase.firestore();
  
    const createData = (collection, doc, data) => {
      dbh.collection(collection).doc(doc).set(
        data
        // {
        // employment: "plumber",
        // outfitColor: "red",
        // specialAttack: "fireball"
      // }
      )
    }
    
    return (
      <FirestoreContext.Provider value={{ createData }}>
        {children}
      </FirestoreContext.Provider>
    );
};

export {
  FirestoreContext,
  FirestoreProvider,
  useFirestore
}