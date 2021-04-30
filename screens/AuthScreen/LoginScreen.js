import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, Image, StyleSheet, View, ScrollView } from "react-native";
import * as firebase from 'firebase';
import logo from '../../assets/inscreen_logo.png';
import { TextInput } from "react-native-gesture-handler";
import { Button } from 'react-native-elements';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../Theme/theme.style';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('@NoWaste_User', JSON.stringify(data));
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const HandleLogin = () => {
    if (email && password) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          storeData(firebase.auth().currentUser)
          setErrorMsg(null)
        })
        .catch(e => {
          console.log(e.code)
          switch (e.code) {
            case "auth/invalid-email":
              setErrorMsg("Het email adres is niet geldig")
              break
            case "auth/user-not-found":
              setErrorMsg("Geen gebruiker gevonden")
              break
            case "auth/wrong-password":
              setErrorMsg("Email adres of wachtwoord is niet correct")
              break
          }
        })
    } else {
      setErrorMsg('Vul je email adres en wachtwoord in')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={email => setEmail(email.trim() == '' ? null : email)}
            placeholder={'Email'}
            placeholderTextColor={theme.TEXT_PLACEHOLDER}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={password => setPassword(password.trim() == '' ? null : password)}
            placeholder={'Wachtwoord'}
            secureTextEntry={true}
            placeholderTextColor={theme.TEXT_PLACEHOLDER}
          />

          {
            errorMsg
              ? <Text>{errorMsg}</Text>
              : null
          }
          <Button
            title={'Inloggen'}
            buttonStyle={styles.loginBtn}
            onPress={() => HandleLogin()}
          />

          <View style={styles.loginOptions}>
            <Button
              title='Registreren'
              buttonStyle={styles.optionTxt}
              type="clear"
              onPress={() => navigation.navigate('Register')}
            />
            <Button
              title='Wachtwoord vergeten'
              buttonStyle={styles.optionTxt}
              type="clear"
              onPress={() => navigation.navigate('Reset')}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: '20%',
  },
  logo: {
    width: 300,
    height: 300,
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
    fontFamily: 'Poppins_700Bold',
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
    fontSize: 15
  },
  list: {
    // flex: 1,
    width: '90%',
    paddingBottom: 120
  }

});
