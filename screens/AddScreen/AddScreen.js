import React, { useState } from "react";
import { SafeAreaView, Text, StatusBar, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { useNavigation } from '@react-navigation/native';
import { NewFoodListing } from '../../components/Listings/NewFoodListing';
import { NewMealListing } from "../../components/Listings/NewMealListing";
import { NewListing } from "../../components/Listings/NewListing";
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import theme from '../../Theme/theme.style';

export const AddScreen = () => {

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
      <NewListing/>
      <>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.title}>
            <Text style={styles.tabTxt}>Nieuw item toevoegen</Text>
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
  title: {
    marginTop: StatusBar.currentHeight,
    top: 25,
    width: '100%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: theme.PRIMARY_COLOR
    
  },
  // overlayTopMiddleLeft: {
  //   marginTop: StatusBar.currentHeight,
  //   top: 25,
  //   width: '48%',
  //   padding: 15,
  //   borderTopLeftRadius: 15,
  //   borderBottomLeftRadius: 15,
  // },
  tabTxt: {
    textAlign: 'center',
    fontFamily: "Poppins_700Bold",
    color: theme.WHITE
  }
});
