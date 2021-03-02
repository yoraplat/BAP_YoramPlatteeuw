import { default as React, useContext, useState, createContext } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import uuid from 'uuid-random';

const FirestoreContext = createContext();
const useFirestore = () => useContext(FirestoreContext);

const FirestoreProvider = ({ children }) => {

  const [allMeals, setAllMeals] = useState([]);
  const [allFood, setAllFood] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [boughtItemsId, setBoughtItemsId] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [createdItemsId, setCreatedItemsId] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);

  const [messages, setMessages] = useState([]);

  const db = firebase.firestore();

  const createPost = async (data) => {
    const newId = uuid();
    const uid = firebase.auth().currentUser.uid

    let postData = data;
    postData = { ...postData, id: newId, seller_id: uid }

    // Check if post has image
    // if (postData.image != false) {
    const imageResponse = await fetch(postData.image)
    const blob = await imageResponse.blob()
    firebase.storage().ref().child("images/" + newId + ".jpg").put(blob)
    // }

    // console.log("Creating post with id: " + newId)
    // Add post to users "created_listings"
    await db.collection('users').doc(uid).update({
      created_listings: firebase.firestore.FieldValue.arrayUnion(newId)
    })

    await db.collection('posts').doc(newId).set(postData)
    // await db.collection('posts').doc(newId).update({
    //   seller_id: uid
    // })
  }

  const imageDownloadUrl = async (id) => {
    const downloadUrl = await firebase.storage().ref().child("images/" + id + ".jpg").getDownloadURL()
    return downloadUrl
  }


  const fetchAllPosts = () => {
    const food = [];
    // Check for available posts
    db.collection('/posts').where('bought_at', '==', false).onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        food.push({ ...doc.data() })
      })
      setAllPosts(food)
    })
    return allPosts
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

  const buyItem = async (listingId) => {

    const uid = firebase.auth().currentUser.uid

    const current_bought = await db.collection('/users').doc(uid).get()
    const current_items = current_bought.data().bought_listings
    let bought_array = current_items
    bought_array.push(listingId)

    await db.collection('/users').doc(firebase.auth().currentUser.uid).update(
      { bought_listings: bought_array }
    ).then(async () => {

      // Only set bought_at when all meals have been bought
      // bought_at determines if post is still available or not
      const checkAmount = await db.collection('/posts').doc(listingId).get()
      if (checkAmount.data().amount <= 0) {
        db.collection('/posts').doc(listingId).update({
          bought_at: new Date,
        })
      }
    })
  }

  const createPickupCode = async (listingId) => {
    // Create a pickup-code for the bought item
    let partOne = (Math.random() * 46656) | 0;
    let partTwo = (Math.random() * 46656) | 0;
    partOne = ("000" + partOne.toString(36)).slice(-3);
    partTwo = ("000" + partTwo.toString(36)).slice(-3);
    let code = partOne + partTwo

    const data = {
      user_id: firebase.auth().currentUser.uid,
      listing_id: listingId,
      pickup_code: code,
      is_used: false,
      created_at: new Date()
    }

    let details

    await db.collection('/posts').doc(listingId).get().then(res => {
      let isTrue = "amount" in res.data()
      if (isTrue) {
        details = res.data()

        db.collection('/posts').doc(listingId).update({
          amount: firebase.firestore.FieldValue.increment(-1)
        })
      }
    })

    await db.collection('/codes').doc(code).set(data).then(() => {
      console.log('Pickup code created: ' + code)
      console.log('Creating chat with id: ' + code)
      // Create a new chat for the bought item
      createNewChat(code, details)
    })
  }

  const checkAvailable = async (listingId) => {
    const response = await db.collection('/posts').doc(listingId).get()
    let data = response.data()

    if (data.bought_at == false && data.amount > 0 || data.bought_at == false && data.amount == undefined) {

      if (data.amount == undefined) {
        return true
      } else {
        return data.amount
      }
    } else {
      return false
    }
  }

  const fetchBoughtItems = async () => {
    const uid = firebase.auth().currentUser.uid

    // Get id's of bought items
    await db.collection('/users').doc(uid).get()
      .then(snapshot => {
        const data = snapshot.data()
        setBoughtItemsId(data["bought_listings"])

        // Fetch all bought posts by id
        const boughtPosts = []
        const boughtPostsIds = []

        boughtItemsId.forEach(id => {

          // Prevent loading post multiple times if user has bought more than one item of a post
          if (!boughtPostsIds.includes(id)) {
            db.collection('/posts').doc(id).get()
              .then(snapshot => {
                const data = snapshot.data()
                boughtPosts.push(data)
              })
          }
          boughtPostsIds.push(id)
          boughtItemsId.push(id)
        });
        setBoughtItems(boughtPosts)
      })
    if (boughtItems) {
      return boughtItems
    } else {
      return false
    }
  }

  const fetchCreatedItems = async () => {
    const uid = firebase.auth().currentUser.uid
    await db.collection('/users').doc(uid).get()
      .then(snapshot => {
        const data = snapshot.data()
        setCreatedItemsId(data["created_listings"])

        // Fetch all created posts by id
        const createdItems = [];
        createdItemsId.forEach(id => {
          db.collection('/posts').doc(id).get()
            .then(snapshot => {
              const data = snapshot.data()
              createdItems.push(data)
            })
        });
        setCreatedItems(createdItems)
      })
    if (createdItems) {
      console.log(createdItems)
      return createdItems
    } else {
      return false
    }
  }

  const checkCode = async (code) => {
    const checkResponse = await db.collection('codes').doc(code).get()
    const data = checkResponse.data()

    if (data != undefined) {
      return data
    } else {
      return false
    }
  }

  const fetchCodes = async (listingId) => {
    const uid = firebase.auth().currentUser.uid
    const snapshot = await db.collection('codes').where('listing_id', '==', listingId).where('user_id', '==', uid).get();
    // if (snapshot.empty) {
    //   console.log('No matching documents.');
    //   return;
    // }
    let codesArray = []
    snapshot.forEach(doc => {
      codesArray.push(doc.data())
    })

    return codesArray
  }

  const updateCodeState = async (code, state) => {
    await db.collection('codes').doc(code).update({
      is_used: state,
    })
  }

  // CHAT FUNCTIONS
  const createNewChat = async (id, details) => {
    let uid = uuid()
    let user_id = firebase.auth().currentUser.uid;

    // Set new message notifications
    await db.collection('chats/' + id + '/messages').doc(uid).set({
      message: 'Hier kan je terecht met je vragen',
      sender_id: 'system',
      created_at: new Date,
    })

    const image = await imageDownloadUrl(details.id)

    // Create details doc
    await db.collection('chats/').doc(id).set({
      buyer_id: user_id,
      seller_id: details.seller_id,
      post_id: details.id,
      title: details.title,
      chat_id: id,
      finished: false,
      image_url: image
    })
  }

  const fetchAllChats = async () => {
    let uid = firebase.auth().currentUser.uid;
    // Find all chats for bought & sold items which are currently awaiting pickup

    // Find bought items
    const snapshot = await db.collection('codes').where('user_id', '==', uid).where('is_used', '==', false).get()

    // Find sold items
    const snapshot2 = await db.collection('chats').where('seller_id', '==', uid).where('finished', '==', false).get()

    let soldPosts = []
    snapshot2.forEach(doc => {
      soldPosts.push(doc.data())
    })

    let boughtPostCodes = []
    snapshot.forEach(doc => {
      boughtPostCodes.push(doc.data().pickup_code)
    })

    // create array of all user chats
    let chatHeads = []

    boughtPostCodes.forEach(async (code) => {
      const boughtChat = await db.collection('chats/').doc(code).get()
      chatHeads.push(boughtChat.data())
    })

    soldPosts.forEach((item) => {
      chatHeads.push(item)
    })

    // Prevent errors if there are no results
    if (chatHeads != null || chatHeads != undefined) {
      return chatHeads
    } else {
      return false
    }

  }

  const sendMessage = async (id, message) => {
    let uid = firebase.auth().currentUser.uid
    const newId = uuid();
    await db.collection('chats/' + id + '/messages').doc(newId).set({
      message: message,
      created_at: new Date,
      sender_id: uid
    })
  }

  // const fetchChat = async (chat_id) => {
  //   const messages = await db.collection('chats/' + chat_id + '/messages').get()
  //   // console.log(messages)

  //   let messageArray = []
  //   messages.forEach(doc => {
  //     messageArray.push(doc.data())
  //   })
  //   return messageArray
  // }

  const fetchChat = (chat_id) => {
    const messageArray = [];
    // Check for available posts
    db.collection('chats/' + chat_id + '/messages').orderBy('created_at').onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        // console.log(doc.data())
        messageArray.push({ ...doc.data() })
      })
      
    })
    return messageArray
  }

  return (
    <FirestoreContext.Provider value={{ sendMessage, fetchChat, fetchAllChats, fetchCodes, createNewChat, imageDownloadUrl, createPost, fetchFood, fetchMeals, fetchAllPosts, buyItem, fetchBoughtItems, fetchCreatedItems, checkAvailable, createPickupCode, checkCode, updateCodeState }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export {
  FirestoreContext,
  FirestoreProvider,
  useFirestore
}