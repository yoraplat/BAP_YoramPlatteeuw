import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, Text, View, StatusBar, StyleSheet, TouchableOpacity, Dimensions, Button } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faMap, faSlidersH, faStream, faFilter, faSeedling, faSort, faExchangeAlt, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native';
// Components
import { Map } from "../../components/MapBox/Map";
import ItemsList from "../../components/MapBox/ItemsList";
import { useFirestore } from '../../Services';
import { useAuth } from '../../Services';
import theme from '../../Theme/theme.style';
import { ScrollView } from "react-native-gesture-handler";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useScrollToTop } from '@react-navigation/native';

// Notifications
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  })
  const { user_id } = useAuth();
  const [allPosts, setAllPosts] = useState(null);

  const scrollToStart = useRef()
  // useScrollToTop(scrollToStart)

  // Notifications
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  // ---------------

  useEffect(() => {

    // Get user preferences
    (async () => {
      const uid = await firebase.auth().currentUser.uid
      firebase.firestore().collection('/users').doc(uid).onSnapshot((res) => {
        if (res.data().settings.only_vegan == true) {
          setSelectedFilters({ ...selectedFilters, [1]: true })
        } else if (res.data().settings.only_veggie == true) {
          setSelectedFilters({ ...selectedFilters, [0]: true })
        }
      })
    })()
    

    const current_date = new Date
    firebase.firestore().collection('/posts').where('bought_at', '==', false).orderBy('pickup', 'asc').onSnapshot((snapshot) => {
      let food = []
      snapshot.forEach((doc) => {
        if (doc.data().pickup.toDate() > current_date) {
          food.push({ ...doc.data() })
        }
      })
      setAllPosts(food)
    })

    // Notifications
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      // When app is active notifications will be catched here
    })
    // Interaction with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response)
      // When notification is clicked, interaction happens here. Also catches notification when app is inactive
      // Redirect user to the right screen
      navigation.navigate(response.notification.request.content.data.screen, {
        type: response.notification.request.content.data.type,
        id: response.notification.request.content.data.item_id
      })
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, [])


  const selectTab = (id) => {
    if (currentTab == 2) {
      setCurrentTab(1)
    }
    setCurrentTab(id)
    scrollToStart.current?.scrollTo({
      y: -1,
      animated: true
    })
  }

  const getStyle = function (id, buttonId) {
    if (id == 1 && buttonId == 1) {
      return {
        backgroundColor: theme.PRIMARY_COLOR,
      }
    } if (id == 1 && buttonId == 2) {
      return {
        backgroundColor: theme.TAB_BACKGROUND,
      }
    } if (id == 2 && buttonId == 1) {
      return {
        backgroundColor: theme.TAB_BACKGROUND,
      }
    } if (id == 2 && buttonId == 2) {
      return {
        backgroundColor: theme.PRIMARY_COLOR,
      }
    }
  }

  const getStyleColor = function (id, buttonId) {
    if (id == 1 && buttonId == 1) {
      return {
        color: theme.WHITE
      }
    } if (id == 1 && buttonId == 2) {
      return {
        color: theme.PRIMARY_COLOR,
      }
    } else {
    } if (id == 2 && buttonId == 1) {
      return {
        color: theme.PRIMARY_COLOR,
      }
    } if (id == 2 && buttonId == 2) {
      return {
        color: theme.WHITE,
      }
    }
  }

  const selectFilter = (id) => {
    let state
    if (selectedFilters[id] == false || selectedFilters[id] == undefined) {
      state = true
    } else {
      state = false
    }
    setSelectedFilters({ ...selectedFilters, [id]: state })
  }

  const setBgColor = (id) => {
    if (selectedFilters[id] == false || selectedFilters[id] == undefined) {
      return {
        // backgroundColor: theme.NEUTRAL_BACKGROUND,
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 2,
        color: theme.PRIMARY_COLOR
      }
    } else {
      return {
        // backgroundColor: theme.PRIMARY_COLOR,
        borderColor: theme.BUTTON_BACKGROUND,
        backgroundColor: theme.BUTTON_BACKGROUND,
        borderWidth: 2,
        color: theme.WHITE
      }
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // Add token to user data
      firebase.firestore().collection('users').doc(user_id()).set(
        { pushtoken: token },
        { merge: true }
      )
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.overlayTopMiddleLeft, getStyle(currentTab, 1)]} onPress={() => selectTab(1)}>
          <FontAwesomeIcon icon={faStream} style={[getStyleColor(currentTab, 1), styles.icon]} size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.overlayTopMiddleRight, getStyle(currentTab, 2)]} onPress={() => selectTab(2)}>
          <FontAwesomeIcon icon={faMap} style={[getStyleColor(currentTab, 2), styles.icon]} size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={scrollToStart} style={styles.filterList}>
          <FontAwesomeIcon icon={faFilter} style={styles.filterItemIcon} size={30} />
          <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(0)}>
            <Text style={[styles.filterItem, setBgColor(0)]}>Veggie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(1)}>
            <Text style={[styles.filterItem, setBgColor(1)]}>Vegan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(2)}>
            <Text style={[styles.filterItem, setBgColor(2)]}>Maaltijd</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(3)}>
            <Text style={[styles.filterItem, setBgColor(3)]}>Voeding</Text>
          </TouchableOpacity>
          {currentTab == 1 ?
            <>
              <FontAwesomeIcon icon={faSort} style={styles.filterItemIcon} size={30} />
              <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(4)}>
                <Text style={[styles.filterItem, setBgColor(4)]}>Prijs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(5)}>
                <Text style={[styles.filterItem, setBgColor(5)]}>Ophalen op</Text>
              </TouchableOpacity>
            </>
            : null
          }
        </ScrollView>
      </View>

      {/* <Text>{JSON.stringify(allPosts)}</Text> */}
      <View style={styles.listContainer}>
        {allPosts == undefined
          ? <Text style={styles.warningTxt}>Er zijn momenteel geen aanbiedingen, kom later eens terug</Text>
          :
          currentTab == 1
            ?
            <ItemsList posts={allPosts} selectedQuickFilter={selectedFilters} />
            : <>
              <Map posts={allPosts} selectedQuickFilter={selectedFilters} />
            </>

        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabsContainer: {
    flexDirection: "row",
    width: '90%',

    // top: StatusBar.currentHeight,
    // position: "absolute",
    zIndex: 999,

    marginBottom: 50
  },

  filterContainer: {
    flexDirection: "column",
    width: '95%',
    alignSelf: "flex-end",
    zIndex: 998
  },
  filterItemIcon: {
    color: theme.PRIMARY_COLOR,
    marginRight: 8,
    textAlign: "center",
    alignSelf: 'center'
  },
  listContainer: {
    // flex: 1,
    flexGrow: 2,
    width: '100%',
  },
  // Filter styling
  title: {
    fontSize: 20,
    color: theme.PRIMARY_COLOR,
  },
  filterList: {
    // marginTop: 10,
    // marginBottom: 10,
  },
  filterItem: {
    padding: 7,
    // borderColor: theme.PRIMARY_COLOR,
    // borderWidth: 2,
    borderRadius: 5,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: theme.TXT_INPUT_BACKGROUND,
    marginRight: 8,
  },

  filterBtnItem: {
    marginRight: 2.5,
  },

  overlayTopMiddleRight: {
    marginTop: StatusBar.currentHeight,
    top: 25,
    flexGrow: 1,
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,

  },
  overlayTopMiddleLeft: {
    marginTop: StatusBar.currentHeight,
    top: 25,
    padding: 15,
    flexGrow: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  icon: {
    alignSelf: "center"
  },
  warningTxt: {
    textAlign: "center",
    fontSize: 15,
    // fontFamily: 'Poppins_500Medium',
    backgroundColor: theme.SECONDARY_COLOR,
    padding: 10,
    color: theme.PRIMARY_COLOR,
    top: 20
  }
});
