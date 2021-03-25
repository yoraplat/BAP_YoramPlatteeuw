import { default as React, useContext, useState, createContext, useEffect } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import uuid from 'uuid-random';
import * as WebBrowser from 'expo-web-browser';

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
  // Chat
  const [boughtChats, setBoughtChats] = useState([]);
  const [offeredChats, setOfferedChats] = useState([]);

  // Payments
  const [status, setStatus] = useState(null);

  const db = firebase.firestore();
  const fn = firebase.functions();

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


  const fetchAllPosts = async () => {
    // Check for available posts
    // let food = []
    db.collection('/posts').where('bought_at', '==', false).onSnapshot((snapshot) => {
      let food = []
      snapshot.forEach((doc) => {
        food.push({ ...doc.data() })
      })
      return food
    })

    // await db.collection('/posts').where('bought_at', '==', false).get().then((snapshot) => {
    //   food = []
    //   snapshot.forEach((doc) => {
    //     food.push({ ...doc.data() })
    //   })
    // })

    // Prevent endless fetching for non existing data
    // if (!food.length) {
    //   return undefined
    // } else {
    //   return food
    // }
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

  const createPayment = async (data) => {
    let parsedPrice = parseFloat(data.price.replace('€', '')).toFixed(2)

    // Used to create a callback id, the payment can be found in the db with the same doc id 
    let payment_uid = uuid();

    try {
      // payment info
      // Price should be in xx.xx format
      const paymentObject = {
        "item_id": data.id,
        "description": "aankoop NoWaste item met payment uid: " + payment_uid,
        "payment_uid": payment_uid,
        "price": parsedPrice,
        "redirectUrl": 'https://us-central1-nowaste-58a45.cloudfunctions.net/mollieRedirect',
        "webhookUrl": 'https://us-central1-nowaste-58a45.cloudfunctions.net/mollieCallback?id=' + payment_uid,
        "buyer_id": firebase.auth().currentUser.uid
      }

      // This function returns a mollie payment url
      const makePayment = firebase.functions().httpsCallable('mollieCheckout')

      await makePayment(paymentObject).then(result => {
        payment_uid = result.data.payment_uid
        WebBrowser.openBrowserAsync(result.data.uri)
      })
      return payment_uid

    } catch (e) {
      console.log(e.message)
    }
  }

  const buyItem = async (listingId) => {
    const uid = firebase.auth().currentUser.uid

    // const current_bought = await db.collection('/users').doc(uid).get()
    // const current_items = current_bought.data().bought_listings
    // let bought_array = current_items
    // bought_array.push(listingId)

    await db.collection('/users').doc(firebase.auth().currentUser.uid).update(
      { bought_listings: firebase.firestore.FieldValue.arrayUnion(listingId) }
    ).then(async () => {

      // Only set bought_at when all meals have been bought
      // bought_at determines if post is still available or not
      const checkAmount = await db.collection('/posts').doc(listingId).get()
      if (checkAmount.data().amount <= 0 || !checkAmount.data().amount) {
        db.collection('/posts').doc(listingId).update({
          bought_at: new Date,
        })
      }
    })
  }

  const listenForPaymentUpdate = (id) => {
    // Listen for status updates
    db.collection('payments').doc(id).onSnapshot((doc) => {
      const data = doc.data().status
      return data
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
      details = res.data()
      if (isTrue) {
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

        })

        setBoughtItems(boughtPosts)
      })
    if (!boughtItems.length) {
      return undefined
    } else {
      return boughtItems
    }
  }

  const fetchCreatedItems = async () => {
    const uid = firebase.auth().currentUser.uid
    await db.collection('/users').doc(uid).get()
      .then(snapshot => {
        const data = snapshot.data()
        setCreatedItemsId(data["created_listings"])

        // Fetch all created posts by id
        const created = [];
        createdItemsId.forEach(id => {
          db.collection('/posts').doc(id).get()
            .then(snapshot => {
              const data = snapshot.data()
              created.push(data)
            })
        })
        setCreatedItems(created)
      })
    if (!createdItems.length) {
      return undefined
    } else {
      return createdItems
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
    await db.collection('chats').doc(code).update({
      finished: true,
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

    // Update USER data with id added to chats
    await db.collection('users').doc(user_id).update({ chats: firebase.firestore.FieldValue.arrayUnion(id) })
    // Update SELLER data with id added to chats
    await db.collection('users').doc(details.seller_id).update({ chats: firebase.firestore.FieldValue.arrayUnion(id) })
  }

  // const fetchAllChats = async () => {
  //   let uid = firebase.auth().currentUser.uid;
  //   // Find all chats for bought & sold items which are currently awaiting pickup

  //   // Find bought items
  //   const snapshot = await db.collection('codes').where('user_id', '==', uid).where('is_used', '==', false).get()

  //   // Find sold items
  //   const snapshot2 = await db.collection('chats').where('seller_id', '==', uid).where('finished', '==', false).get()

  //   const soldPosts = []
  //   snapshot2.forEach(doc => {
  //     soldPosts.push(doc.data())
  //   })

  //   const boughtPostCodes = []
  //   snapshot.forEach(doc => {
  //     boughtPostCodes.push(doc.data().pickup_code)
  //   })

  //   // create array of all user chats
  //   const chatHeads = []

  //   boughtPostCodes.forEach(async (code) => {
  //     const boughtChat = await db.collection('chats/').doc(code).get()
  //     chatHeads.push(boughtChat.data())
  //   })

  //   soldPosts.forEach((item) => {
  //     chatHeads.push(item)
  //   })

  //   // Prevent errors if there are no results
  //   // if (chatHeads != null || chatHeads != undefined) {
  //   //   console.log(chatHeads)
  //   //   return chatHeads
  //   // } else {
  //   //   console.log('false')
  //   //   return false
  //   // }
  //   setChatItems(chatHeads)
  //   return chatItems

  //   // console.log('Service: ' + JSON.stringify(chatItems))
  //   // if (chatItems.length) {
  //   //   return chatItems
  //   // } else {
  //   //   return undefined
  //   // }

  // }

  const fetchAllChats = () => {
    let uid = firebase.auth().currentUser.uid

    // Listen for updates in users chats array
    db.collection('users').doc(uid).onSnapshot((res) => {
      const userChats = []
      const chats = res.data().chats
      chats.forEach(async (chat) => {
        await db.collection('chats').doc(chat).get().then((res) => {
          userChats.push(res.data())
        })
      })
      console.log(userChats)
      return userChats
    })
  }

  const sendMessage = async (id, message) => {
    let uid = firebase.auth().currentUser.uid
    const newId = uuid()
    await db.collection('chats/' + id + '/messages').doc(newId).set({
      message: message,
      created_at: new Date,
      sender_id: uid
    })
  }

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

  const checkUnread = async (id) => {
    await db.collection('chats').doc(id).get().then((res) => {
      const data = res.data()
      if (data.last_message.sender_id != firebase.auth().currentUser.uid) {
        db.collection('chats').doc(id).update({
          last_message: {
            message_id: null,
            sender_id: null,
          }
        })
      }
    })
  }

  const checkPickup = async (post_id) => {
    let response = null
    await firebase.firestore().collection('codes').where('listing_id', '==', post_id).get().then((res) => {
      // console.log(res.data().length)
      let used_codes = []
      let total_codes = []

      res.forEach(code => {
        total_codes.push(code.data().pickup_code)
      })

      res.forEach(code => {
        if (code.data().is_used == true) {
          used_codes.push(code.data().pickup_code)
        }
      })

      if (used_codes.length == total_codes.length) {
        response = true
      } else {
        response = false
      }

    })
    return response
  }

  const resetPassword = async (email) => {
    try {
      const mailObject = {
        "email": email,
      }

      const sendMail = firebase.functions().httpsCallable('passwordReset')
      await sendMail(mailObject)
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <FirestoreContext.Provider value={{ resetPassword, checkPickup, checkUnread, listenForPaymentUpdate, createPayment, sendMessage, fetchChat, fetchAllChats, fetchCodes, createNewChat, imageDownloadUrl, createPost, fetchFood, fetchMeals, fetchAllPosts, buyItem, fetchBoughtItems, fetchCreatedItems, checkAvailable, createPickupCode, checkCode, updateCodeState }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export {
  FirestoreContext,
  FirestoreProvider,
  useFirestore
}