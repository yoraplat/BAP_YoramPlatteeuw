import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons'

export const BuyScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
     <Text>Buy screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
});
