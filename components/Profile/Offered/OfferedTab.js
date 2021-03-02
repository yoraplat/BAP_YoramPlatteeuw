import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, StatusBar, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLeaf, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import ProfileItemsList from '../List/ProfileItemsList'
import { useFirestore } from '../../../Services';
import theme from '../../../Theme/theme.style';

export default function OfferedTab() {

    const [createdItems, setCreatedItems] = useState(null)

    const { fetchCreatedItems } = useFirestore();
    useEffect(() => {
        const fetchData = () => {
            fetchCreatedItems().then((response) => {
                setCreatedItems(response);
                console.log(response)
            })
        }

        if (createdItems == null || createdItems.length < 1) {
            fetchData();
        }

    }, [createdItems]);

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
        <ProfileItemsList posts={createdItems} type='offered' />
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