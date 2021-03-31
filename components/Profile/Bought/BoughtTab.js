import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import ProfileItemsList from '../List/ProfileItemsList'
import theme from '../../../Theme/theme.style';
import * as firebase from 'firebase';

export default function BoughtTab() {
    const [data, setData] = useState(null)

    useEffect(() => {
            let data
            const posts = []
            const uid = firebase.auth().currentUser.uid
            // Get all created items id from user profile
            // Use onSnapshot to listen for updates
            firebase.firestore().collection('users').doc(uid).onSnapshot(async res => {
                // data == list of post id's
                data = res.data().bought_listings
                // push all posts to posts array
                for (let i = 0; i < data.length; i++) {
                    await firebase.firestore().collection('posts').doc(data[i]).get().then(res => {
                        posts.push(res.data())
                    })
                }
                setData(posts)
            })
    }, []);

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    })
    if (!fontsLoaded) {
        return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
    }

    return (
        <ProfileItemsList posts={data} type="bought" />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 120,
    },
});