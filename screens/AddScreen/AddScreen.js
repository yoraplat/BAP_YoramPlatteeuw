import React, { useState } from "react";
import { SafeAreaView, Text, StatusBar, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { useNavigation } from '@react-navigation/native';
import { NewFoodListing } from '../../components/Listings/NewFoodListing';
import { NewMealListing } from "../../components/Listings/NewMealListing";
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import theme from '../../Theme/theme.style';

export const AddScreen = () => {

  const [currentTab, setCurrentTab] = useState(1)

  const selectTab = (id) => {
    if (currentTab == 2) {
      setCurrentTab(1)

    }
    setCurrentTab(id)
  }

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const getStyle = function (id, buttonId) {
    if (id == 1 && buttonId == 1) {
      return {
        backgroundColor: 'rgba(148, 2, 3, 1)',
      }
    } if (id == 1 && buttonId == 2) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      }
    } if (id == 2 && buttonId == 1) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 1)',
      }
    } if (id == 2 && buttonId == 2) {
      return {
        backgroundColor: 'rgba(148, 2, 3, 1)',
      }
    }
  }
  const getStyleColor = function (id, buttonId) {
    if (id == 1 && buttonId == 1) {
      return {
        color: 'rgba(255, 255, 255, 1)'
      }
    } if (id == 1 && buttonId == 2) {
      return {
        color: 'rgba(148, 2, 3, 1)',
      }
    } else {
    } if (id == 2 && buttonId == 1) {
      return {
        color: 'rgba(148, 2, 3, 1)',
      }
    } if (id == 2 && buttonId == 2) {
      return {
        color: 'rgba(255, 255, 255, 1)',
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentTab == 1
        ? <NewFoodListing />
        : <NewMealListing />
      }
      <>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.overlayTopMiddleLeft, getStyle(currentTab, 1)]} onPress={() => selectTab(1)}>
            <Text style={[getStyleColor(currentTab, 1),styles.tabTxt]}>Voeding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.overlayTopMiddleRight, getStyle(currentTab, 2)]} onPress={() => selectTab(2)}>
            <Text style={[getStyleColor(currentTab, 2), styles.tabTxt]}>Maaltijd</Text>
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    position: 'absolute',
    width: '90%',
    justifyContent: "space-between"
  },
  overlayTopMiddleRight: {
    marginTop: StatusBar.currentHeight,
    top: 25,
    width: '48%',
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    
  },
  overlayTopMiddleLeft: {
    marginTop: StatusBar.currentHeight,
    top: 25,
    width: '48%',
    padding: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  tabTxt: {
    textAlign: 'center',
    fontFamily: "Poppins_700Bold",
  }
});
