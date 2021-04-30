import React, { useState, useEffect } from "react";
import { TextInput, View,  Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, ScrollView, Alert, Modal, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import logo from '../../../assets/ahs_logo.png';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import styles from './styles';
import { useAuth } from '../../../Services';
import theme from '../../../Theme/theme.style';
import * as firebase from 'firebase';

const window = Dimensions.get('window');

export default function ProfileTab({ callLogoutFunction }) {

    const { fetchUser, updateUser, deleteUserData } = useAuth();
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [onlyVegan, setOnlyVegan] = useState(false);
    const [onlyVeggie, setOnlyVeggie] = useState(false);
    const [inProgress, setInpProgress] = useState(false);

    const [passwordToggle, setPasswordToggle] = useState(false);
    const [dimensions, setDimensions] = useState(window);

    const [passwordUpdate, setPasswordUpdate] = useState({
        current: null,
        new: null,
        newRepeat: null
    });

    useEffect(() => {
        const fetchCurrent = async () => {
            await fetchUser().then((response) => {
                setEmail(response.email)
                setUsername(response.username)
                setAccountNumber(response.bank_account)
                setOnlyVegan(response.settings.only_vegan)
                setOnlyVeggie(response.settings.only_veggie)
            })
        }
        fetchCurrent();
    }, []);

    const changeVeggie = () => {
        if (onlyVeggie == false) {
            setOnlyVeggie(true)
        }

        if (onlyVeggie == true) {
            setOnlyVeggie(false)
        }

        if (onlyVegan == true) {
            setOnlyVegan(false)
        }
    }

    const changeVegan = () => {
        if (onlyVegan == false) {
            setOnlyVegan(true)
        }

        if (onlyVegan == true) {
            setOnlyVegan(false)
        }
        if (onlyVeggie == true) {
            setOnlyVeggie(false)
        }
    }

    const saveAccount = async () => {
        setInpProgress(true)
        const data = {
            email: email,
            username: username,
            account_number: accountNumber != undefined ? accountNumber : null,
            only_vegan: onlyVegan,
            only_veggie: onlyVeggie,
        }

        await updateUser(data).then(() => {
            setInpProgress(false)
        })
    }

    const changePassword = () => {
        if (passwordToggle == true) {
            setPasswordToggle(false)
        } else {
            setPasswordToggle(true)
        }
    }

    const savePassword = async () => {
        const currentPassword = passwordUpdate.current
        const newPassword = passwordUpdate.new
        const newRepeat = passwordUpdate.newRepeat

        if (currentPassword && newPassword && newRepeat) {
            if (newPassword == newRepeat) {
                await firebase.auth().currentUser.updatePassword(newPassword).then(() => {
                    changePassword()
                }).catch((error) => {
                    alert('Log opnieuw in om je wachtwoord te kunnen veranderen')
                    console.log(error)
                })
            } else {
                alert('Je gekozen wachtwoord is niet correct herhaald')
            }
        } else {
            alert("Gelieve alle velden in te vullen")
        }
    }

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
    }

    const logout = () => {
        callLogoutFunction()
    }

    const deleteAccount = async () => {
        await deleteUserData()
        firebase.auth().currentUser.delete()
            .then(() => {
                // logout()
            })
            .catch((error) => {
                console.log(error)
            })

    }
    return (
        <SafeAreaView style={styles.container} >
            <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.list}>
                <View style={styles.form}>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Account</Text>
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Email"
                            value={email}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            onChangeText={val => setEmail(val)}
                        />

                        <TextInput
                            style={styles.txtInput}
                            placeholder="Naam"
                            value={username}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            onChangeText={val => setUsername(val)}
                        />
                        <TextInput
                            style={styles.txtInput}
                            placeholder="IBAN nummer om betalingen te ontvangen"
                            value={accountNumber}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            onChangeText={val => setAccountNumber(val)}
                        />
                        <TouchableOpacity style={styles.passwordButton} onPress={() => changePassword()}>
                            <Text style={styles.submitButtonTxt}>Wachtwoord veranderen</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.title}>Instellingen</Text>
                        <CheckBox
                            title='Enkel veggie & vegan aanbiedingen tonen'
                            checked={onlyVeggie}
                            onPress={() => changeVeggie()}
                            containerStyle={{ backgroundColor: theme.NEUTRAL_BACKGROUND, width: '100%', padding: 0 }}
                            textStyle={{ color: theme.PRIMARY_COLOR }}
                            checkedColor={theme.PRIMARY_COLOR}
                        />
                        <CheckBox
                            title='Enkel vegan aanbiedingen tonen'
                            checked={onlyVegan}
                            onPress={() => changeVegan()}
                            containerStyle={{ backgroundColor: theme.NEUTRAL_BACKGROUND, width: '100%', padding: 0 }}
                            textStyle={{ color: theme.PRIMARY_COLOR }}
                            checkedColor={theme.PRIMARY_COLOR}
                        />
                    </View>

                    <TouchableOpacity disabled={inProgress ? true : false} style={styles.submitButton} onPress={() => saveAccount()}>
                        {inProgress
                            ? <ActivityIndicator size="large" color="white" />
                            : <Text style={styles.submitButtonTxt}>Opslaan</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={() => logout()}>
                        <Text style={styles.submitButtonTxt}>Uitloggen</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.form}>
                    <View style={styles.formItem, { marginTop: 20 }}>
                        <Text style={styles.title}>Over deze app</Text>
                        <Text style={styles.text}>Deze applicatie werd gemaakt in functie van een bachelorproef voor de opleiding Grafische en Digitale media aan de Arteveldehogeschool.</Text>
                        <Image style={styles.ahsLogo} source={logo} />
                    </View>
                </View>
                <View style={styles.form}>
                    <View style={styles.formItem, { marginTop: 20 }}>
                        <TouchableOpacity style={styles.deleteButton} onPress={() =>
                            Alert.alert(
                                'Account verwijderen',
                                'Ben je zeker dat je je account wil verwijderen?',
                                [
                                    {
                                        text: "Annuleren",
                                        style: "cancel"
                                    },
                                    { text: "Verwijderen", onPress: () => deleteAccount() }
                                ],
                                { cancelable: true }
                            )}>
                            <Text style={styles.submitButtonTxt}>Account verwijderen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={passwordToggle}
            >
                <View style={{ padding: 20, backgroundColor: 'rgba(12,12,12,0.3)', height: dimensions.height, flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: "column", height: 300, justifyContent: 'space-evenly', backgroundColor: theme.NEUTRAL_BACKGROUND, height: (dimensions.height / 2), padding: 20, borderRadius: 15 }}>
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Huidig wachtwoord"
                            value={passwordUpdate.current}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            secureTextEntry={true}
                            onChangeText={val => setPasswordUpdate({ ...passwordUpdate, current: val.trim() == '' ? null : val })}
                        />
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Nieuw wachtwoord"
                            value={passwordUpdate.new}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            secureTextEntry={true}
                            onChangeText={val => setPasswordUpdate({ ...passwordUpdate, new: val.trim() == '' ? null : val })}
                        />
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Nieuw wachtwoord herhalen"
                            value={passwordUpdate.newRepeat}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            secureTextEntry={true}
                            onChangeText={val => setPasswordUpdate({ ...passwordUpdate, newRepeat: val.trim() == '' ? null : val })}
                        />
                        <TouchableOpacity style={styles.passwordButton} onPress={() => savePassword()}>
                            <Text style={styles.submitButtonTxt}>Opslaan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => changePassword()}>
                            <Text style={styles.submitButtonTxt}>Annuleren</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </SafeAreaView>
    );
}