import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { ListItem } from './ListItem';
import theme from '../../Theme/theme.style';
// Calculate distance between coordinates
import haversine from 'haversine';

export default function ItemsList({ posts, selectedQuickFilter, location }) {
    const [data, setData] = useState(null);
    const quickFilter = selectedQuickFilter

    useEffect(() => {
        posts != undefined ? loadList() : ''
    }, [posts, selectedQuickFilter]);

    const loadList = () => {
        const postList = [];
        // Create a post object from each array item

        posts.forEach((post) => {
            // Calculate distance from user to offer location
            const coordinates = {
                latitude: post.coordinates.latitude,
                longitude: post.coordinates.longitude
            }
            const currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            let calcDistance = haversine(coordinates, currentLocation, { unit: 'meter' })

            const postObject = {
                title: post.title,
                description: post.description,
                type: post.type,
                price: post.price > 0 ? post.price : 'Gratis',
                amount: post.amount == undefined ? 1 : post.amount,
                pickup: post.pickup,
                veggie: post.veggie,
                vegan: post.vegan,
                latitude: parseFloat(post.coordinates.latitude),
                longitude: parseFloat(post.coordinates.longitude),
                address: post.address,
                id: post.id,
                image: post.image,
                seller_id: post.seller_id,
                distance: calcDistance
            };

            // Filtering for veggie/vegan meals/food
            // Veggie == vegan, vegan != veggie
            if (quickFilter[0] == true && post.veggie == true) {

                // meals
                if (quickFilter[0] == true && post.veggie == true && quickFilter[2] == true && post.type == 'meal') {
                    postList.push(postObject)
                }
                // food
                if (quickFilter[0] == true && post.veggie == true && quickFilter[3] == true && post.type == 'food') {
                    postList.push(postObject)
                }

                // All veggie/vegan
                if (quickFilter[0] == true && quickFilter[2] == false && quickFilter[3] == false && post.veggie == true) {
                    postList.push(postObject)
                }
            }

            // Filtering for vegan meals/food
            if (quickFilter[1] == true && post.vegan == true) {

                // meals
                if (quickFilter[2] == true && post.type == 'meal') {
                    postList.push(postObject)
                }
                // food
                if (quickFilter[3] == true && post.type == 'food') {
                    postList.push(postObject)
                }

                // All veggie/vegan
                if (quickFilter[2] == false && quickFilter[3] == false) {
                    postList.push(postObject)
                }
            }

            // only meals
            if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == true && quickFilter[3] == false) {
                if (post.type == 'meal') {
                    postList.push(postObject)
                }
            }

            // only food
            if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == false && quickFilter[3] == true) {
                if (post.type == 'food') {
                    postList.push(postObject)
                }
            }

            // No filters selected
            if (quickFilter[0] == false && quickFilter[1] == false && quickFilter[2] == false && quickFilter[3] == false) {
                postList.push(postObject)
            }


        });

        // Ordering
        // Distance
        if (quickFilter[4] == true) {
            function orderByDistance(a, b) {
                return a.distance - b.distance
            }
            postList.sort(orderByDistance);
        }

        // Price
        if (quickFilter[5] == true) {
            function orderByPrice(a, b) {
                return (a.price != "Gratis" ? a.price : 0) - (b.price != "Gratis" ? b.price : 0)
            }
            postList.sort(orderByPrice);
        }
        // Date
        if (quickFilter[6] == true) {
            function orderByDate(a, b) {
                return a.pickup.toMillis() - b.pickup.toMillis()
            }
            postList.sort(orderByDate);
        }

        setData(postList)
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

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView style={styles.list}>
                {posts != undefined && posts.length != 0
                    ?
                    data && data.map((post, index) => (
                        <ListItem
                            postData={post}
                            key={index}
                            count={index}
                        />
                    ))
                    : <Text style={styles.warningTxt}>Er zijn momenteel geen aanbiedingen beschikbaar, kom later eens terug.</Text>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: StatusBar.currentHeight,
        marginTop: -30
    },
    list: {
        width: "100%",
        flex: 1,
    },
    warningTxt: {
        textAlign: "center",
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        backgroundColor: theme.SECONDARY_COLOR,
        padding: 10,
        color: theme.PRIMARY_COLOR
    }
});