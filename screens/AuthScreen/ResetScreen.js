import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar, Image, StyleSheet, View } from "react-native";
import * as firebase from 'firebase';
import logo from '../../assets/NoWasteV2_logo_big_logo_text.png';
import { TextInput } from "react-native-gesture-handler";
import { Button } from 'react-native-elements';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useAuth, useFirestore } from '../../Services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../Theme/theme.style';

export const ResetScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { resetPassword } = useFirestore();

  const [email, setEmail] = useState('')
  const [mailSend, setMailSend] = useState(false)

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const sendMail = () => {
    if (email) {
      if (mailSend == false) {
        resetPassword(email)
        setMailSend(true)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={email => setEmail(email.trim() == '' ? null : email)}
          placeholder={'Email'}
          placeholderTextColor={theme.TEXT_PLACEHOLDER}
        />
        {
          mailSend
            ? <Text style={styles.optionTxt}>Een email wordt verzonden naar het ingegeven adres als deze gelinkt is aan een bestaande gebruiker</Text>
            : null
        }
        <Button
          title={'Wachtwoord wijzigen'}
          buttonStyle={styles.loginBtn}
          onPress={() => sendMail()}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
  },
  text: {
    marginTop: 100
  },
  formContainer: {
    flex: 1,
    width: '90%',
    top: '15%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    // backgroundColor:'lightgray'
    width: 300,
    padding: 10,
    borderWidth: 1,
    backgroundColor: theme.NEUTRAL_BACKGROUND,
    borderColor: theme.NEUTRAL_BACKGROUND,
    marginBottom: 15,
    fontFamily: 'Poppins_400Regular'
  },
  loginBtn: {
    width: 300,
    marginTop: 10,
    padding: 10,
    textAlign: 'center',
    backgroundColor: theme.PRIMARY_COLOR,
    fontFamily: 'Poppins_700Bold'
  },
  loginOptions: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionTxt: {
    fontFamily: 'Poppins_400Regular',
    color: theme.PRIMARY_COLOR,
    // borderColor: theme.TERTIARY_COLOR,
    borderWidth: 0,
    fontSize: 15,
    width: '80%'
  }

});
