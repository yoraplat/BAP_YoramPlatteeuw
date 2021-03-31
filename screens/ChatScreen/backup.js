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

export const backup = () => {

  const { fetchAllChats, fetchChat, sendMessage, checkUnread } = useFirestore()
  const [availableChats, setAvailableChats] = useState(null)
  const [chatMessages, setChatMessages] = useState(null)
  const [headerLoading, setHeaderLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(0)
  const [newMessage, setNewMessage] = useState('')

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const fetch = async () => {
    await fetchAllChats().then((data) => {
      setAvailableChats(data)
      setHeaderLoading(false)
      selectChat(0, data[0].chat_id)
      console.log('data ' + JSON.stringify(data))
    })
  }
  useEffect(() => {

    if (availableChats == null || availableChats.length < 1) {
      fetch()
    }
  }, [fetchAllChats, fetchChat, chatMessages])



  const selectChat = (index, id) => {
    console.log("selected chat: " + id)
    loadMessages(id)
    setSelectedChat(index)
    checkUnread(id)
  }

  const loadMessages = async (id) => {
    // Clear unread message if last sender_id != currentUser
    const messages = await fetchChat(id)
    setChatMessages(messages)
  }

  const createMessage = () => {
    // Empty messages array
    setChatMessages(null)

    // Get id of current chat
    let id = availableChats[selectedChat].chat_id

    // Create data object with created_at, message, sender_id
    let message = newMessage
    sendMessage(id, message)

    // Reload messages, otherwise the messages array becomes a copy + a new message
    loadMessages(id)

    // Reset input field
    setNewMessage('')
  }


  return (    
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chatContainer}>
        <View style={styles.headerContainer}>
          {headerLoading
            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            : availableChats && availableChats.map((chat, index) => {
              return (
                <TouchableOpacity key={index} style={styles.headerItem} onPress={() => selectChat(index, chat.chat_id)}>
                  <View style={styles.headerBadge}>
                    <Text style={styles.badgeTxt}>1</Text>
                  </View>
                  <Text style={selectedChat == index ? styles.bigText : styles.text}>{chat.title.length >= 8 ? chat.title.substring(0, 8) + '...' : chat.title}</Text>
                  <Image source={{ uri: chat.image_url }} style={selectedChat == index ? styles.imageActive : styles.image} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
      <View style={styles.contentContainer}>
        <View style={styles.contentTitle}>
          {/* <Text style={styles.chatTitle}>{availableChats[selectedChat].title}</Text> */}
          <Text style={styles.chatTitle}>Title</Text>
        </View>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={styles.contentChat}>
          {headerLoading
            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
            : <ListItem messages={chatMessages} />
            // : <Text>{JSON.stringify(chatMessages)}</Text>
          }
        </ScrollView>
        <View style={styles.submit}>
          <TextInput style={styles.chatInput} placeholderTextColor={theme.WHITE} placeholder={'Type je bericht hier'} value={newMessage} onChangeText={(val) => setNewMessage(val)} />
          <TouchableOpacity onPress={() => createMessage()}>
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
