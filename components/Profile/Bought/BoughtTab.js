import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import ProfileItemsList from '../List/ProfileItemsList'
import { useFirestore } from '../../../Services';
import theme from '../../../Theme/theme.style';

export default function BoughtTab() {
    const [boughtItems, setBoughtItems] = useState(null)

    const { fetchBoughtItems } = useFirestore();
    useEffect(() => {
        const fetchData = () => {
            fetchBoughtItems().then((response) => {
                setBoughtItems(response)
            })
        }

        if (boughtItems == null || boughtItems.length < 1) {
            fetchData();
        }

    }, [boughtItems]);

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
        <ProfileItemsList posts={boughtItems} type="bought" />
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