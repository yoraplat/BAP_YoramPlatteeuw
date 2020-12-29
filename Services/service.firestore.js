import { default as React, useContext, useState, createContext } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import uuid from 'uuid-random';

const FirestoreContext = createContext();
const useFirestore = () => useContext(FirestoreContext);

const FirestoreProvider = ({ children }) => {

  const [allPosts, setAllPosts] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [allFood, setAllFood] = useState([]);

  const db = firebase.firestore();

  const createPost = (type, data) => {
    db.collection('posts' + '/types/' + type).doc(uuid()).set(
      data
    )
  }

  const fetchAllPosts = () => {
    db.collection('/posts/types/meal').onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ ...doc.data() }))
      setAllMeals(Object.values(data))
    })
    return allMeals
  }

  const fetchMeals = async () => {
    let meals = [];
    await db.collection('posts/types/meals').get()
      .then(forEach((doc) => {
        meals.push(doc.data());
      }));
    alert(meals);

    setAllMeals(meals)

    // return allMeals
  }

  const fetchFood = async () => {
    let food = [];
    const snapshotFood = await db.collection('posts/types/food').get();
    snapshotFood.forEach((doc) => {
      food.push(doc.data());
    });

    setAllFood(food)

    return allFood
  }

  return (
    <FirestoreContext.Provider value={{ createPost, fetchAllPosts }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export {
  FirestoreContext,
  FirestoreProvider,
  useFirestore
}