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
            <View style={{ padding: 15}}>
                <View style={[overlayStyles.topLine, {marginBottom: 5}]}>
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
                    <Text style={overlayStyles.infoItem}>Ophalen op {moment((post.pickup).toDate()).format('DD/MM [om] HH:mm[u]')}</Text>
                    <Text style={overlayStyles.infoItem}>Adres: {post.address}</Text>
                    <Text style={[overlayStyles.infoItem, { fontFamily: 'Poppins_300Light' }]}>{post.amount} beschikbaar</Text>
                    {/* <TouchableOpacity style={overlayStyles.basketBtn} onPress={() => buyItem()}>
                    <FontAwesomeIcon icon={faShoppingBasket} style={{ color: theme.BUTTON_TXT_COLOR }} size={30} />
                </TouchableOpacity> */}
                </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: theme.PRIMARY_COLOR, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10 }} onPress={() => buyItem()}>
                <Text style={{ textAlign: 'center', color:theme.WHITE, fontSize: 15, fontFamily: 'Poppins_500Medium'}}>Reserveren</Text>
            </TouchableOpacity>
        </View>
    );
}
