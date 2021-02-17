import React, { useState, useEffect } from "react";
import { TextInput, View, Button, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import styles from './styles';
import { useAuth } from '../../../Services';
import theme from '../../../Theme/theme.style';

export default function ProfileTab({ callLogoutFunction }) {

    const { fetchUser, updateUser } = useAuth();
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [onlyVegan, setOnlyVegan] = useState(false);
    const [onlyVeggie, setOnlyVeggie] = useState(false);
    const [inProgress, setInpProgress] = useState(false);

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
            // setOnlyVeggie(true)
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

        // console.log(data)
        await updateUser(data).then(() => {
            setInpProgress(false)
        })
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
    return (
        <SafeAreaView style={styles.container} >
            <ScrollView contentContainerStyle={styles.list}>
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
                            placeholder="Rekeningnummer"
                            value={accountNumber}
                            placeholderTextColor={theme.TXT_PLACEHOLDER}
                            onChangeText={val => setAccountNumber(val)}
                        />
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonTxt}>Wachtwoord veranderen</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.title}>Instellingen</Text>
                        <CheckBox
                            title='Enkel veggie & vegan aanbiedingen tonen'
                            checked={onlyVeggie}
                            onPress={() => changeVeggie()}
                        />
                        <CheckBox
                            title='Enkel vegan aanbiedingen tonen'
                            checked={onlyVegan}
                            onPress={() => changeVegan()}
                        />
                    </View>

                    <TouchableOpacity disabled={inProgress ? true : false} style={styles.submitButton} onPress={() => saveAccount()}>
                        {/* <TouchableOpacity style={styles.submitButton}> */}
                        {inProgress
                            ? <ActivityIndicator size="large" color="white" />
                            : <Text style={styles.submitButtonTxt}>Opslaan</Text>
                        }
                        {/* <Text style={styles.submitButtonTxt}>Opslaan</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonTxt}>Uitloggen</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.title}>Gemiddelde feedback</Text>
                    <View style={styles.starList}>
                        <FontAwesomeIcon style={styles.starListItem} icon={faStar} color={theme.PRIMARY_COLOR} />
                        <FontAwesomeIcon style={styles.starListItem} icon={faStar} color={theme.PRIMARY_COLOR} />
                        <FontAwesomeIcon style={styles.starListItem} icon={faStar} color={theme.PRIMARY_COLOR} />
                        <FontAwesomeIcon style={styles.starListItem} icon={faStar} color={theme.PRIMARY_COLOR} />
                        <FontAwesomeIcon style={styles.starListItem} icon={faStar} color={theme.PRIMARY_COLOR} />
                    </View>
                </View>
                <Button
                    title="Logout"
                    onPress={() => logout()}
                />
            </ScrollView>
        </SafeAreaView>
    );
}