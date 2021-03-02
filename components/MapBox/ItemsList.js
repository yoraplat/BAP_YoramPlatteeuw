import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { ListItem } from './ListItem';
import theme from '../../Theme/theme.style';

export default function ItemsList({ posts, selectedQuickFilter }) {

    const [quickFilter, setQuickFilter] = useState(selectedQuickFilter);
    const [data, setData] = useState(null);


    useEffect(() => {
        setQuickFilter(selectedQuickFilter);
        posts != undefined ? loadList() : '';
    }, [posts]);
    
    const loadList = () => {
        const postList = [];
        posts.forEach((post) => {
            
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
                image: post.image
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
                {data && data.map((post, index) => (
                    <ListItem
                        postData={post}
                        key={index}
                        count={index}
                    />
                ))}
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
    },
    list: {
        width: "100%",
        flex: 1,
    },
});