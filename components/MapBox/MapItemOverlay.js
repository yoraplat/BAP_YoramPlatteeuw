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
                <Text style={overlayStyles.overlayTitle}>{post.title} <Text style={overlayStyles.overlaySubtitle}>({post.price})</Text></Text>
                {post.veggie == true && post.vegan == false
                    ? <FontAwesomeIcon icon={faLeaf} style={{ color: 'green' }} size={30} />
                    : <></>
                }
                {post.vegan == true
                    ? <FontAwesomeIcon icon={faSeedling} style={{ color: 'green' }} size={30} />
                    : <></>
                }
                <TouchableOpacity style={overlayStyles.closeBtn} onPress={() => closeOverlay()}>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: theme.PRIMARY_COLOR }} size={30} />
                </TouchableOpacity>
            </View>
            <Text style={overlayStyles.overlayDescription}>{post.description}</Text>

            <View style={overlayStyles.info}>
                <View style={overlayStyles.infoList}>
                    <Text style={overlayStyles.infoItem}>{moment((post.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'HH:mm[u]')}</Text>
                    <Text style={[overlayStyles.infoItem, overlayStyles.small]}>1,3 km</Text>
                    <Text style={overlayStyles.infoItem}>{post.address}</Text>
                    <Text style={[overlayStyles.infoItemImage, overlayStyles.right, { fontFamily: 'Poppins_300Light' }]}>{post.amount} beschikbaar</Text>
                </View>
                <TouchableOpacity style={overlayStyles.basketBtn} onPress={() => buyItem()}>
                    <FontAwesomeIcon icon={faShoppingBasket} style={{ color: theme.BUTTON_TXT_COLOR }} size={30} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
