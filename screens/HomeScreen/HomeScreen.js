import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StatusBar, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faMap, faSlidersH, faStream, faFilter, faSeedling } from '@fortawesome/free-solid-svg-icons'
// Components
import { Map } from "../../components/MapBox/Map";
import ItemsList from "../../components/MapBox/ItemsList";
import { useFirestore } from '../../Services';
import theme from '../../Theme/theme.style';

export const HomeScreen = () => {

  const [currentTab, setCurrentTab] = useState(1)
  const { fetchAllPosts } = useFirestore();
  const [allPosts, setAllPosts] = useState();
  const [qFilter, setQFilter] = useState(0);

  useEffect(() => {
    setAllPosts(fetchAllPosts);
  }, [fetchAllPosts]);

  const selectTab = (id) => {
    if (currentTab == 2) {
      setCurrentTab(1)
    }
    setCurrentTab(id)
  }

  const getStyle = function (id, buttonId) {
    if (id == 1 && buttonId == 1) {
      return {
        backgroundColor: theme.PRIMARY_COLOR,
      }
    } if (id == 1 && buttonId == 2) {
      return {
        backgroundColor: theme.WHITE,
      }
    } if (id == 2 && buttonId == 1) {
      return {
        backgroundColor: theme.WHITE,
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

  const quickFilter = () => {
    if (qFilter == 2) {
      setQFilter(0)
    } else {
      setQFilter(qFilter + 1)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentTab == 1
        ?
        <>
          <Map posts={allPosts} selectedQuickFilter={qFilter} />
        </>
        : <ItemsList posts={allPosts} />
      }

      <>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.overlayTopLeft, qFilter > 0 ? { backgroundColor: '#709B0B' } : null]} onPress={() => quickFilter()}>
            {
              qFilter == 0
                ?
                <FontAwesomeIcon icon={faFilter} style={{ color: theme.WHITE }} size={20} />
                : null
            }
            {
              qFilter == 1
                ? <FontAwesomeIcon icon={faLeaf} style={{ color: theme.WHITE }} size={25} />
                : null
            }
            {
              qFilter == 2
                ? <FontAwesomeIcon icon={faSeedling} style={{ color: theme.WHITE }} size={25} />
                : null

            }
          </TouchableOpacity>

          <View style={styles.tabsCenter}>
            <TouchableOpacity style={[styles.overlayTopMiddleLeft, getStyle(currentTab, 1)]} onPress={() => selectTab(1)}>
              <FontAwesomeIcon icon={faMap} style={getStyleColor(currentTab, 1)} size={35} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.overlayTopMiddleRight, getStyle(currentTab, 2)]} onPress={() => selectTab(2)}>
              <FontAwesomeIcon icon={faStream} style={getStyleColor(currentTab, 2)} size={35} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.overlayTopRight}>
            <FontAwesomeIcon icon={faSlidersH} style={{ color: theme.PRIMARY_COLOR }} size={35} />
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    // flexWrap: 'nowrap',
    position: 'absolute',
    width: '100%',
    justifyContent: "space-between",
    alignItems: "center",
    top: StatusBar.currentHeight,
  },
  tabsCenter: {
    width: '50%',
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "center"
  },
  overlayTopMiddleRight: {
    top: 25,
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTopMiddleLeft: {
    top: 25,
    padding: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTopLeft: {
    top: 30,
    left: '10%',
    padding: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: theme.PRIMARY_COLOR,
  },
  overlayTopRight: {
    top: 30,
    right: '10%',
    padding: 10,
    justifyContent: 'center',
  },

  overlayBottom: {
    position: 'absolute',
    bottom: StatusBar.currentHeight,
    backgroundColor: theme.WHITE,
  },
  textWhite: {
    color: theme.WHITE
  },
  textBlack: {
    color: theme.BLACK
  },
});
