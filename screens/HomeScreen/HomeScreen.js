import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, Text, View, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMap, faStream, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
// Components
import { Map } from "../../components/MapBox/Map";
import ItemsList from "../../components/MapBox/ItemsList";
import { useAuth } from '../../Services';
import theme from '../../Theme/theme.style';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as Sentry from 'sentry-expo';

// Location
import * as Location from 'expo-location';

// Notifications
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Sentry.enableInExpoDevelopment = true
Sentry.init({
  dsn: "https://9ddff79d729145a4a8bcf32941037497@o473614.ingest.sentry.io/5695623",
  enableInExpoDevelopment: true,
  debug: true
})
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const HomeScreen = ({ route }) => {

  const navigation = useNavigation();
  const [locationRes, setLocationRes] = useState();
  const [currentTab, setCurrentTab] = useState(1)
  const [toggleFilter, setToggleFilter] = useState(0)
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

  // Notifications
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const routeParam = route.params;
  // ---------------

  async function getUid() {
    return firebase.auth().currentUser.uid
  }

  async function getLocation() {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      return;
    }
    // Check if a location has been set, this prevents hitting the Location rate limit
    if (locationRes == null || undefined) {
      try {
        await Location.getCurrentPositionAsync({})
          .then(location => {
            setLocationRes(location);
          })
      } catch (e) {
        console.log(e.message)
        // Backup for testing purposes, Location doesn't work well on emulator
        setLocationRes({
          "timestamp": 1617121013162,
          "mocked": false,
          "coords": {
            "altitude": 51.09091275651065,
            "heading": 0,
            "latitude": 51.0449596,
            "longitude": 3.728977,
            "altitudeAccuracy": 3,
            "speed": 0,
            "accuracy": 27.375
          }
        })
      }
    }
  }

  useEffect(() => {
    // Reload items on focus. Without refresh, new posts don't have the matching image
      try {
        getUid().then(uid => {
          getLocation()
          firebase.firestore().collection('/users').doc(uid).onSnapshot((res) => {
            // TypeError: undefined is not an object (evaluating 't.data().settings.only_vegan')
            let res_data = res.data()
            try {
              if (res_data.settings.only_vegan == true) {
                setSelectedFilters({ ...selectedFilters, [1]: true })
              } else if (res_data.settings.only_veggie == true) {
                setSelectedFilters({ ...selectedFilters, [0]: true })
              }
            } catch (e) {
              console.log(e.message)
            }
          })
        })
      } catch (e) {
        console.log(e.message)
      }

      const current_date = new Date
      firebase.firestore().collection('/posts').where('bought_at', '==', false).onSnapshot((snapshot) => {
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
      // unsubscribe
    }
  }, [])


  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }
  const selectTab = (id) => {
    if (currentTab == 2) {
      setCurrentTab(1)
    }
    setCurrentTab(id)
    setToggleFilter(0)
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
    // Only allow one sorting option
    if (id == 4 || id == 5 || id == 6) {
      if (selectedFilters[id] == false || selectedFilters[id] == undefined) {
        id == 4 ? setSelectedFilters({ ...selectedFilters, 4: true, 5: false, 6: false }) : null
        id == 5 ? setSelectedFilters({ ...selectedFilters, 4: false, 5: true, 6: false }) : null
        id == 6 ? setSelectedFilters({ ...selectedFilters, 4: false, 5: false, 6: true }) : null
      } else {
        setSelectedFilters({ ...selectedFilters, 4: false, 5: false, 6: false })
      }
    } else {
      // For filters
      let state
      if (selectedFilters[id] == false || selectedFilters[id] == undefined) {
        state = true
      } else {
        state = false
      }
      setSelectedFilters({ ...selectedFilters, [id]: state })
    }
  }

  const setBgColor = (id) => {
    if (selectedFilters[id] == false || selectedFilters[id] == undefined) {
      return {
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 2,
        color: theme.PRIMARY_COLOR
      }
    } else {
      return {
        borderColor: theme.BUTTON_BACKGROUND,
        backgroundColor: theme.BUTTON_BACKGROUND,
        borderWidth: 2,
        color: theme.WHITE
      }
    }
  }

  const setFilterBg = (id) => {
    if (toggleFilter == id) {
      return {
        backgroundColor: theme.PRIMARY_COLOR,
        color: theme.PRIMARY_COLOR
      }
    } else {
      return {
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

  const toggleAdvanced = (type) => {
    if (type == 'filter') {
      if (toggleFilter == 0) {
        setToggleFilter(1)
      } else if (toggleFilter == 2) {
        setToggleFilter(1)
      } else {
        setToggleFilter(0)
      }
    }
    if (type == 'sort') {
      if (toggleFilter == 0) {
        setToggleFilter(2)
      } else if (toggleFilter == 1) {
        setToggleFilter(2)
      } else {
        setToggleFilter(0)
      }
    }
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
        <View style={styles.filterBtnContainer}>
          {currentTab != 2 ?
            <>
              <TouchableOpacity style={[styles.filterBtn, setFilterBg(1)]} onPress={() => toggleAdvanced('filter')}>
                <Text style={styles.filterTxt}>Filteren</Text>
                <FontAwesomeIcon icon={toggleFilter == 1 ? faAngleUp : faAngleDown} size={15} color={theme.WHITE} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterBtn, setFilterBg(2)]} onPress={() => toggleAdvanced('sort')}>
                <Text style={styles.filterTxt}>Sorteren</Text>
                <FontAwesomeIcon icon={toggleFilter == 2 ? faAngleUp : faAngleDown} size={15} color={theme.WHITE} />
              </TouchableOpacity>
            </>
            : null
          }
        </View>

        <View style={styles.filterItemsContainer}>
          {
            toggleFilter == 1
              ? <>
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
              </>
              : null
          }

          {
            toggleFilter == 2
              ? <>
                <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(4)}>
                  <Text style={[styles.filterItem, setBgColor(4)]}>Afstand</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(5)}>
                  <Text style={[styles.filterItem, setBgColor(5)]}>Prijs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtnItem} onPress={() => selectFilter(6)}>
                  <Text style={[styles.filterItem, setBgColor(6)]}>Ophalen op</Text>
                </TouchableOpacity>
              </>
              : null
          }

        </View>

      </View>

      <View style={styles.listContainer}>
        {allPosts == undefined || locationRes == undefined || locationRes == null
          ? <Text style={styles.warningTxt}>{locationRes != null ? 'Er zijn momenteel geen aanbiedingen, kom later eens terug' : 'Er is een probleem opgetreden bij het ophalen van je locatie'}</Text>
          :
          currentTab == 1
            ?
            <ItemsList posts={allPosts} location={locationRes} selectedQuickFilter={selectedFilters} />
            : <>
              <Map posts={allPosts} location={locationRes} selectedQuickFilter={selectedFilters} />
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
    zIndex: 999,
    marginBottom: 35,
  },

  // filterContainer: {
  //   flexDirection: "column",
  //   width: '95%',
  //   alignSelf: "flex-end",
  //   zIndex: 998
  // },
  filterContainer: {
    width: '90%',
  },
  filterBtnContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  filterItemIcon: {
    color: theme.PRIMARY_COLOR,
    marginRight: 8,
    textAlign: "center",
    alignSelf: 'center'
  },
  listContainer: {
    flexGrow: 2,
    width: '100%',
  },
  // Filter styling
  title: {
    fontSize: 20,
    color: theme.PRIMARY_COLOR,
  },
  filterList: {
  },

  filterItem: {
    padding: 5,
    borderRadius: 5,
    fontSize: 13,
    textAlign: "center",
    backgroundColor: theme.TXT_INPUT_BACKGROUND,
    marginRight: 8,
  },

  filterBtnItem: {
    marginRight: 2.5,
  },

  overlayTopMiddleRight: {
    marginTop: StatusBar.currentHeight,
    top: 15,
    flexGrow: 1,
    padding: 7,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,

  },
  overlayTopMiddleLeft: {
    marginTop: StatusBar.currentHeight,
    top: 15,
    padding: 7,
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
  },

  filterBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor: theme.PRIMARY_COLOR,
    backgroundColor: theme.TEXT_PLACEHOLDER,
    width: '49%',
    alignItems: 'center',
    // borderRadius: 15
  },
  filterTxt: {
    color: theme.WHITE,
    padding: 2.5,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    marginRight: 10
  },
  filterItemsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 15
  }
});
