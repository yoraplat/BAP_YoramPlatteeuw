import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import ProfileItemsList from '../List/ProfileItemsList'
import theme from '../../../Theme/theme.style';
import * as firebase from 'firebase';

export default function OfferedTab() {
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        let data
        const posts = []
        const uid = firebase.auth().currentUser.uid
        // Get all created items id from user profile
        // Use onSnapshot to listen for updates
        firebase.firestore().collection('users').doc(uid).onSnapshot(async res => {
            // data == list of post id's
            data = res.data().created_listings
            console.log('List of ids: ' + JSON.stringify(data))
            // push all posts to posts array
            for (let i = 0; i < data.length; i++) {
                await firebase.firestore().collection('posts').doc(data[i]).get().then(res => {
                    posts.push(res.data())
                })
            }
            setPosts(posts)
        })
    }, [posts]);

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
    }

    return (
        <ProfileItemsList posts={posts} type='offered' />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'flex-start',
        // marginTop: StatusBar.currentHeight,
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 120,
    },
    list: {
        width: "90%",
        flex: 1,
        top: 120,
        bottom: -120
    },
});