import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar, Image, StyleSheet, View } from "react-native";
import * as firebase from 'firebase';
import logo from '../../assets/NoWaste_logo_big_logo_text.png';
import { TextInput } from "react-native-gesture-handler";
import { Button } from 'react-native-elements';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../Services';
import { RegisterScreen } from './RegisterScreen';
import AppScreen from "../AppScreen/AppScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../Theme/theme.style';

export const LoginScreen = () => {
  const { currentUser } = useAuth();
  const Stack = createStackNavigator();

  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }



  function Register() {
    return (
      <RegisterScreen />
    );
  }

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('@NoWaste_User', JSON.stringify(data));
      console.log(data.uid)
    } catch (error) {
      alert(error)
    }
  }

  function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const HandleLogin = () => {
      firebase.auth()
        .signInWithEmailAndPassword(email.email, password.password)
        .then(() => storeData(firebase.auth().currentUser), navigation.navigate('AppScreen'))
        .catch(error => console.log(error))
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={email.email}
            onChangeText={email => setEmail({ email })}
            placeholder={'Email'}
            placeholderTextColor={'white'}
          />
          <TextInput
            style={styles.input}
            value={password.password}
            onChangeText={password => setPassword({ password })}
            placeholder={'Wachtwoord'}
            secureTextEntry={true}
            placeholderTextColor={'white'}
          />
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
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AppScreen" component={AppScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
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
    backgroundColor: theme.TERTIARY_COLOR,
    borderColor: theme.TERTIARY_COLOR,
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
    borderColor: theme.TERTIARY_COLOR,
    borderWidth: 0,
    fontSize: 15
  }

});
