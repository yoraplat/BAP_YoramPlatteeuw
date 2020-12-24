import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar, Image, StyleSheet, View } from "react-native";
import logo from '../../assets/NoWaste_logo_big_logo_text.png';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';import { TextInput } from "react-native-gesture-handler";
import { Button } from 'react-native-elements';
import * as Firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

export const RegisterScreen = () => {
    const [email, setEmail ] = useState();
    const [password, setPassword ] = useState();
    const [username, setUsername ] = useState();

    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    const RegisterUser = () => {
        Firebase.auth()
                .createUserWithEmailAndPassword(email.email, password.password)
                .then(() => navigation.navigate('Login'))
                .catch(error => alert(error))
      }

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
  }

 return (

    <SafeAreaView style={styles.container}>
    <View style={styles.logoContainer}>
      <Image style={styles.logo} source={logo}/>
    </View>
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        // value={userData.email}
        onChangeText={email => setEmail({email})}
        placeholder={'Email'}
        placeholderTextColor={'white'}
        />
      <TextInput
        style={styles.input}
        // value={userData.name}
        onChangeText={username => setUsername({username})}
        placeholder={'Naam'}
        placeholderTextColor={'white'}
      />
      <TextInput
        style={styles.input}
        // value={userData.password}
        onChangeText={password => setPassword({password})}
        placeholder={'Wachtwoord'}
        secureTextEntry={true}
        placeholderTextColor={'white'}
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
    backgroundColor:"#ACC8FF",
    alignItems:'center',
  },    
  logoContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    top:'20%'
  },
  logo: {
    width: 300,
    height: 300,
    
  },
  text: {
    marginTop: 100
  },
  formContainer: {
    flex:1,
    width:'90%',
     top:'15%',
     flexDirection:'column',
     alignItems:'center'
  },
  input: {
    // backgroundColor:'lightgray'
    width:300,
    padding: 10,
    borderWidth:1,
    backgroundColor:'#D94849',
    borderColor:'#D94849',
    marginBottom: 15,
    fontFamily:'Poppins_400Regular'
  },
  loginBtn: {
    width: 300,
    marginTop:10,
    padding:10,
    textAlign:'center',
    backgroundColor:'rgba(148, 2, 3, 1)',
    fontFamily:'Poppins_700Bold'
  },
  loginOptions: {
    width:300,
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10,
  },
  optionTxt: {
    fontFamily:'Poppins_400Regular',
    color: 'rgba(148, 2, 3, 1)',
    borderColor: '#D94849',
    borderWidth: 0,
    fontSize: 15
  }

});
