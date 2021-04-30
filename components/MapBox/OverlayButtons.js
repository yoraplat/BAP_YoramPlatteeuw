import * as React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faSlidersH } from '@fortawesome/free-solid-svg-icons'

export function OverlayButtons() {

  return (
    <>
      <TouchableOpacity style={styles.overlayTopLeft}>
        <FontAwesomeIcon icon={faLeaf} style={{ color: 'rgba(255, 255, 255, 1)' }} size={25} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.overlayTopRight}>
        <FontAwesomeIcon icon={faSlidersH} style={{ color: 'rgba(148, 2, 3, 1)' }} size={35} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
    backgroundColor: 'rgba(148, 2, 3, 1)',
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