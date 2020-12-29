import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { ListItem } from './ListItem';
import { useFirestore } from '../../Services';

export function ItemsList() {
    const { fetchAllPosts } = useFirestore();
    const [meals, setAllMeals] = useState();

    useEffect(() => {
        setAllMeals(fetchAllPosts())
    }, []);

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
        <SafeAreaView style={styles.container} >
            <ScrollView style={styles.list}>
                {meals && meals.map((meal, index) => (
                    // console.log(meal)
                    <ListItem key={index} title={meal.title} />
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ACC8FF',
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