import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar, View, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator } from "react-native";
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import theme from '../../Theme/theme.style';
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ListItem } from "../../components/Chat/ListItem";
import { useFirestore } from '../../Services';

import * as firebase from 'firebase';
import 'firebase/firestore';

export const ChatScreen = () => {

  const { fetchAllChats, fetchChat, sendMessage, checkUnread } = useFirestore()
  const [chats, setChats] = useState(null)
  const [loadingChats, setLoadingChats] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState(null)
  const [newMessage, setNewMessage] = useState(null)
  const [uid, setUid] = useState(null)

  // useEffect(() => {
  //   // Load all chats belonging to the user
  //   const uid = firebase.auth().currentUser.uid
  //   setUid(uid)
  //   firebase.firestore().collection('users').doc(uid).onSnapshot(async (res) => {
  //     const userChats = []
  //     for (const chat of res.data().chats) {
  //       await firebase.firestore().collection('chats').doc(chat).get().then((res) => {
  //         if (res.data().finished != true) {
  //           userChats.push(res.data())
  //         }
  //       })
  //     }
  //     setChats(userChats)
  //     setLoadingChats(false)
  //   })
  // }, [])

  useEffect(() => {
    let data
    const userChats = []
    const uid = firebase.auth().currentUser.uid
    firebase.firestore().collection('users').doc(uid).onSnapshot(async res => {
        data = res.data().chats
        if (data != null) {
          for (let i = 0; i < data.length; i++) {
              await firebase.firestore().collection('chats').doc(data[i]).get().then(res => {
                if (res.data().finished != true) {
                  userChats.push(res.data())
                }  
              })
          }
        }
        setChats(userChats)
        setLoadingChats(false)
    })
}, []);

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const selectChat = (index, chat_id) => {
    setSelectedChat(index)
    loadMessages(chat_id)
  }

  const loadMessages = (id) => {
    // Clear new chat notification
    firebase.firestore().collection('chats/').doc(id).update({
      last_message: {
        message_id: null,
        sender_id: null,
      }
    })
    firebase.firestore().collection('chats/' + id + '/messages').orderBy('created_at').onSnapshot((res) => {
      const messageList = []
      res.forEach(element => {
        messageList.push(element.data())
      })
      setMessages(messageList)
    })
  }

  const createMessage = () => {
    const id = chats[selectedChat].chat_id
    const message = newMessage
    sendMessage(id, message)
    // Clear input
    setNewMessage(null)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chatContainer}>
        <View style={styles.headerContainer}>
          {loadingChats
            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            : chats.length != 0 ?
              chats && chats.map((chat, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.headerItem} onPress={() => selectChat(index, chat.chat_id)}>
                    { chat.last_message.sender_id != uid && chat.last_message.sender_id !== null
                      ? <View style={styles.headerBadge}>
                        <Text style={styles.badgeTxt}>1</Text>
                      </View>
                      : null
                    }
                    <Text style={selectedChat == index ? styles.bigText : styles.text}>{chat.title.length >= 8 ? chat.title.substring(0, 8) + '...' : chat.title}</Text>
                    <Image source={{ uri: chat.image_url }} style={selectedChat == index ? styles.imageActive : styles.image} />
                  </TouchableOpacity>
                )
              })
              : <Text style={styles.text}>Er zijn momenteel geen gesprekken beschikbaar</Text>

          }
        </View>
      </ScrollView>
      <View style={styles.contentContainer}>
        <View style={styles.contentTitle}>
          {loadingChats
            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            : selectedChat != null
              ? <Text style={styles.chatTitle}>{chats[selectedChat].title}</Text>
              : <Text style={{ color: theme.WHITE }}>Kies een gesprek</Text>
          }
        </View>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={styles.contentChat}>
          {loadingChats
            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            : selectedChat != null
              ? <ListItem messages={messages} />
              : <Text>Selecteer een gesprek om de berichten te bekijken</Text>
          }
        </ScrollView>
        {/* Disable input when no chat is selected */}
        <View style={styles.submit}>
          <TextInput style={styles.chatInput} placeholderTextColor={theme.WHITE} placeholder={'Type je bericht hier'} value={newMessage} onChangeText={(val) => setNewMessage(val)} />
          <TouchableOpacity disabled={selectedChat == null ? true : false} onPress={() => createMessage()}>
            <FontAwesomeIcon icon={faPaperPlane} size={20} style={{ color: theme.WHITE }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.NEUTRAL_BACKGROUND,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '90%',
    marginTop: StatusBar.currentHeight,
    // flex: 1,
    top: 25,
  },
  chatContainer: {
    top: 35,
  },
  title: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: theme.PRIMARY_COLOR

  },
  tabTxt: {
    textAlign: 'center',
    fontFamily: "Poppins_700Bold",
    color: theme.WHITE,
  },

  headerContainer: {
    height: 110,
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
  },
  headerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50
  },
  imageActive: {
    width: 85,
    height: 85,
    borderRadius: 50
  },

  contentContainer: {
    flex: 1,
    width: '90%',
    flexGrow: 10,
    marginBottom: 10,
    borderRadius: 25,
    // backgroundColor: theme.SECONDARY_COLOR,
    backgroundColor: theme.NEUTRAL_BACKGROUND,

  },

  contentTitle: {
    // backgroundColor: theme.NEUTRAL_BACKGROUND,
    backgroundColor: theme.PRIMARY_COLOR,
    height: 50,
    justifyContent: 'center',
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  chatTitle: {
    color: theme.WHITE,
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  contentChat: {
    padding: 20,
    // backgroundColor: 'red'
  },
  chatItem: {
    // backgroundColor: theme.SECONDARY_COLOR,
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  chatItemUser: {
    // backgroundColor: theme.TAB_BACKGROUND,
    backgroundColor: "#c7eddc",
    padding: 15,
    borderRadius: 15,
    alignItems: "flex-end",
    marginBottom: 15,
  },
  chatInput: {
    alignSelf: "center",
    // width: '100%',
    padding: 10,
    paddingLeft: 35,
    // backgroundColor: theme.NEUTRAL_BACKGROUND,
    backgroundColor: 'transparent',
    color: theme.WHITE,
    // backgroundColor: "#eaeaea",
    borderBottomLeftRadius: 25,
  },
  submit: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: theme.PRIMARY_COLOR,
    // backgroundColor: "#eaeaea",
    justifyContent: "space-between",
    paddingRight: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerBadge: {
    // backgroundColor: 'red',
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 99,
    width: 25,
    height: 25,
    // backgroundColor: theme.RED,
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 50,
  },
  badgeTxt: {
    top: 2,
    textAlign: 'center',
    color: theme.WHITE
  },
  text: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  bigText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
  },
  noMessage: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: theme.PRIMARY_COLOR
  }
});
