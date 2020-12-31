import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { ListItem } from './ListItem';



export default function ItemsList( {posts} ) {
    // const { fetchFood, fetchMeals, fetchAllPosts } = useFirestore();
    // const [food, setAllFood] = useState();
    // const [meals, setAllMeals] = useState();
    // const [allPosts, setAllPosts] = useState();

    // useEffect(() => {
    //     setAllPosts(fetchAllPosts);
    // }, []);

    // alert(posts)

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
    }

    const convertDate = (date) => {
        const months = {
            0: 'januari',
            1: 'februari',
            2: 'maart',
            3: 'april',
            4: 'mei',
            5: 'juni',
            6: 'juli',
            7: 'augustus',
            8: 'september',
            9: 'oktober',
            10: 'november',
            11: 'december'
        }
        const d = new Date(date * 1000);
        const day = d.getDay();
        const month = months[d.getMonth()];
        const hour = d.getHours();
        const minutes = d.getMinutes();
        return `${day} ${month}, ${hour}:${minutes}u`
    }

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView style={styles.list}>
                {posts && posts.map((post, index) => (
                    <ListItem
                        key={index}
                        title={post.title}
                        description={post.description}
                        pickup={convertDate(post.pickup.seconds)}
                        address={post.address.string}
                        amount={post.amount}
                        price={post.price > 0 ? "€" + post.price : "Gratis"}
                        hasImage={post.image ? true : false}
                    />
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