import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar, Image, StyleSheet, View } from "react-native";
import logo from '../../assets/inscreen_logo.png';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { TextInput, TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import theme from '../../Theme/theme.style';
import { CheckBox } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';

// Firebase
// import 'firebase/firestore';
// import 'firebase/auth';
// import uuid from 'uuid-random';

export const RegisterScreen = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [username, setUsername] = useState(null);
  const [policy, setPolicy] = useState(false);
  const [policyUrl, setPolicyUrl] = useState('https://www.privacypolicies.com/live/6d016f17-5829-4f11-9257-819d98bebe0d');

  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const RegisterUser = () => {
    try {
      // Check if passwords match
      if (passwordCheck.passwordCheck != null && password.password != null && passwordCheck.passwordCheck == password.password) {
        if (policy) {
          firebase.auth()
            .createUserWithEmailAndPassword(email.email, password.password)
            .then((user) => {
              firebase.firestore().collection('users').doc(user.user.uid).set({
                username: username.username,
                email: email.email,
                account_number: null,
                created_listings: null,
                bought_listings: null,
                settings: {
                  only_veggie: false,
                  only_vegan: false,
                }
              })
              navigation.navigate('Login')
            })
            .catch(error => alert(error))
        } else {
          alert('Gelieve de voorwaarden te accepteren')
        }
      } else {
        alert('Ingevulde wachtwoorden komen niet overeen')
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

  const changePolicy = () => {
    if (policy == false) {
      setPolicy(true)
    } else {
      setPolicy(false)
    }
  }

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={logo} />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          onChangeText={email => setEmail({ email })}
          placeholder={'Email'}
          placeholderTextColor={theme.TEXT_PLACEHOLDER}
        />
        <TextInput
          style={styles.input}
          onChangeText={username => setUsername({ username })}
          placeholder={'Naam'}
          placeholderTextColor={theme.TEXT_PLACEHOLDER}
        />
        <TextInput
          style={styles.input}
          onChangeText={password => setPassword({ password })}
          placeholder={'Wachtwoord'}
          secureTextEntry={true}
          placeholderTextColor={theme.TEXT_PLACEHOLDER}
        />
        <TextInput
          style={styles.input}
          onChangeText={passwordCheck => setPasswordCheck({ passwordCheck })}
          placeholder={'Wachtwoord Herhalen'}
          secureTextEntry={true}
          placeholderTextColor={theme.TEXT_PLACEHOLDER}
        />

        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(policyUrl)}>
          <Text style={{ color: theme.PRIMARY_COLOR, textDecorationLine: 'underline' }}>Voorwaarden</Text>
        </TouchableOpacity>
        <CheckBox
          title={'Ik accepteer de voorwaarden'}
          checked={policy}
          onPress={() => changePolicy()}
          containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
          textStyle={{ color: theme.PRIMARY_COLOR }}
          checkedColor={theme.PRIMARY_COLOR}
          style={{ alignSelf: 'flex-start' }}
        />

        <Button
          title={'Registreren'}
          buttonStyle={styles.loginBtn}
          onPress={() => RegisterUser()}
        />

        <View style={styles.loginOptions}>
          <Button
            title='Inloggen'
            buttonStyle={styles.optionTxt}
            type="clear"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
    marginTop: -70
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: '20%'
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
    borderColor: '#D94849',
    borderWidth: 0,
    fontSize: 15
  }

});
