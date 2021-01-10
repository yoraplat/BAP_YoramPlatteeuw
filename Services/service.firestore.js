import { default as React, useContext, useState, createContext } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import uuid from 'uuid-random';

const FirestoreContext = createContext();
const useFirestore = () => useContext(FirestoreContext);

const FirestoreProvider = ({ children }) => {

  const [allMeals, setAllMeals] = useState([]);
  const [allFood, setAllFood] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  const db = firebase.firestore();

  const createPost = async (data) => {
    const newId = uuid();
    data.id = newId;
    await db.collection('posts').doc(newId).set(data)
      .then(() => {
        // setInProgress(false);
        console.log("Created post")
      })
  }

  const fetchAllPosts = () => {
    // const meals = [];
    const food = [];
    db.collection('/posts').onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        food.push({ ...doc.data() })
      })
      setAllPosts(food)
    })

    // db.collection('/posts/types/food').onSnapshot((snapshot) => {
    //   snapshot.forEach((doc) => food.push({ ...doc.data() }))
    //   const allItems = meals.concat(food);
    //   setAllPosts(Object.values(allItems))
    // })

    return allPosts


    // db.collection('/posts/types/meal').onSnapshot((snapshot) => {
    //   const data = [];
    //   snapshot.forEach((doc) => data.push({ ...doc.data() }))
    //   setAllPosts(Object.values(data))
    // })
    // return allPosts
  }

  const fetchMeals = () => {
    db.collection('/posts/types/meal').onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data() }))
      setAllMeals(Object.values(data))
    })
    return allMeals
  }

  const fetchFood = () => {
    db.collection('/posts/types/food').onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data() }))
      setAllFood(Object.values(data))
    })
    return allFood
  }

  return (
    <FirestoreContext.Provider value={{ createPost, fetchFood, fetchMeals, fetchAllPosts }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export {
  FirestoreContext,
  FirestoreProvider,
  useFirestore
}