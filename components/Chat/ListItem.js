import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import theme from '../../Theme/theme.style';
import { useAuth } from '../../Services';


export function ListItem({ messages }) {


    const { user_id } = useAuth()

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
        <>
            {/* use chatItemUser for messages from user */}
            {messages && messages.map((message, index) => {
                return (
                    message.sender_id != 'system'
                        ?
                        <View style={message.sender_id == user_id ? styles.chatItemUser : styles.chatItem} key={index}>
                            <Text style={styles.text}>{message.message}</Text>
                            <Text style={styles.details}>{moment((message.created_at).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}</Text>
                        </View>
                        :
                        <View style={styles.chatItemSystem} key={index}>
                            <Text style={styles.text}>{message.message}</Text>
                        </View>

                )
            })}
        </>
    );
}

const styles = StyleSheet.create({
    chatItem: {
        // backgroundColor: theme.SECONDARY_COLOR,
        backgroundColor: "#e5e5e5",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    chatItemUser: {
        // backgroundColor: theme.TAB_BACKGROUND,
        backgroundColor: "#c7eddc",
        padding: 15,
        borderRadius: 15,
        alignItems: "flex-end",
        marginBottom: 15,
    },
    chatItemSystem: {
        backgroundColor: theme.TXT_INPUT_BACKGROUND,
        // padding: 15,
        // borderRadius: 15,
        alignItems: "center",
        marginBottom: 15,
    },
    text: {
        color: theme.BLACK,
        fontSize: 14,
        color: theme.PRIMARY_COLOR,
        fontFamily: "Poppins_400Regular",
    },
    details: {
        top: 2,
        fontFamily: 'Poppins_300Light',
        fontSize: 12,
    },
});