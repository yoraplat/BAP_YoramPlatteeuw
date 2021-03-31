import React, { useState } from "react";
import { Image, View, Text, SafeAreaView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { faSeedling, faLeaf, faShoppingBasket, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import overlayStyles from './overlayStyles'
import theme from '../../Theme/theme.style';

export function MapItemOverlay({ post, closeOverlayFunction, openModalFunction }) {

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <SafeAreaView style={overlayStyles.container} ><AppLoading /></SafeAreaView>
    }

    const closeOverlay = () => {
        closeOverlayFunction()
    }


    const buyItem = () => {
        openModalFunction()
    }

    return (
        <View style={overlayStyles.mapOverlay}>
            <View style={overlayStyles.topLine}>
                <Text style={overlayStyles.overlayTitle}>{post.title} <Text style={overlayStyles.overlaySubtitle}>({post.price != 'Gratis' ? '€' + post.price : post.price})</Text></Text>
                <TouchableOpacity style={overlayStyles.closeBtn} onPress={() => closeOverlay()}>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: theme.PRIMARY_COLOR }} size={30} />
                </TouchableOpacity>
            </View>
            <Text style={overlayStyles.overlayDescription}>{post.description}</Text>

            <View style={overlayStyles.info}>
                {post.veggie == true && post.vegan == false
                    ? <Text >Veggie</Text>
                    : null
                }
                {post.vegan == true
                    ? <Text >Vegan</Text>
                    : null
                }
                <View style={overlayStyles.infoList}>
                    <Text style={overlayStyles.infoItem}>Ophalen: {moment((post.pickup).toDate()).format('HH:mm[u] [op] DD/MM ')}</Text>
                    <Text style={overlayStyles.infoItem}>{post.address}</Text>
                    <Text style={[overlayStyles.infoItem,{fontFamily: 'Poppins_300Light'}]}>{post.amount} beschikbaar</Text>
                {/* <TouchableOpacity style={overlayStyles.basketBtn} onPress={() => buyItem()}>
                    <FontAwesomeIcon icon={faShoppingBasket} style={{ color: theme.BUTTON_TXT_COLOR }} size={30} />
                </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );
}
