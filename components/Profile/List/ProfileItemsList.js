import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { ProfileListItem } from './ProfileListItem';
import theme from '../../../Theme/theme.style';

export default function ProfileItemsList({ posts, type }) {

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
        <ScrollView style={styles.list}>
            { posts === null
                ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
                : posts == undefined
                    ? <Text style={styles.warningTxt}>{type == 'bought' ? 'Hier kan je gekochte aanbiedingen terug vinden' : 'Hier kan je jouw aangeboden items terug vinden' }</Text>
                    : posts && posts.map((post, index) => (
                        <ProfileListItem
                            postData={post}
                            indexKey={index}
                            key={index}
                            type={type}
                        />
                    ))
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    list: {
        width: "90%",
        top: 120,
        marginBottom: 120
    },
    warningTxt: {
        textAlign: "center",
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        backgroundColor: theme.SECONDARY_COLOR,
        padding: 10,
        color: theme.PRIMARY_COLOR,
        top: 20
    }
});