import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StatusBar, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faMap, faSlidersH, faStream } from '@fortawesome/free-solid-svg-icons'
import { useFirestore } from '../../Services/service.firestore';
// Components
import { Map } from "../../components/MapBox/Map";
import { ItemsList } from "../../components/MapBox/ItemsList";

export const HomeScreen = () => {

  const [currentTab, setCurrentTab] = useState(1)

  const selectTab = (id) => {
    if (currentTab == 2) {
      setCurrentTab(1)

    }
    setCurrentTab(id)
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
        ? <Map />
        : <ItemsList />
      }
      <>
        <TouchableOpacity style={styles.overlayTopLeft}>
          <FontAwesomeIcon icon={faLeaf} style={{ color: 'rgba(255, 255, 255, 1)', backgroundColor: '#940203' }} size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.overlayTopMiddleLeft, getStyle(currentTab, 1)]} onPress={() => selectTab(1)}>
          <FontAwesomeIcon icon={faMap} style={getStyleColor(currentTab, 1)} size={35} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.overlayTopMiddleRight, getStyle(currentTab, 2)]} onPress={() => selectTab(2)}>
          <FontAwesomeIcon icon={faStream} style={getStyleColor(currentTab, 2)} size={35} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.overlayTopRight}>
          <FontAwesomeIcon icon={faSlidersH} style={{ color: 'rgba(148, 2, 3, 1)' }} size={35} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.overlayBottom}>
                <Text style={styles.textBlack}>Bottom Button</Text>
          </TouchableOpacity> */}
      </>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayTopLeft: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
    top: 30,
    left: '5%',
    padding: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(148, 2, 3, 1)',
  },
  overlayTopRight: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
    top: 30,
    right: '5%',
    padding: 10,
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  overlayTopMiddleRight: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
    top: 25,
    right: '31.5%',
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  overlayTopMiddleLeft: {
    position: 'absolute',
    marginTop: StatusBar.currentHeight,
    top: 25,
    left: '31.5%',
    padding: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    // backgroundColor: 'rgba(148, 2, 3, 1)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: StatusBar.currentHeight,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  textWhite: {
    color: 'rgba(255,255,255,1)'
  },
  textBlack: {
    color: 'rgba(0,0,0,1)'
  }
});