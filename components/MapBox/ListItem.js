import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

export function ListItem( title ) {

    
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
        <View style={styles.listItem}>
            <Text style={styles.title}>{title}<Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>(€3)</Text></Text>
            <Text style={styles.description}>Vegetarische groenten spaghetti</Text>
            <View style={styles.info}>
                <View style={styles.infoList}>
                    <Text style={styles.infoItem}>6 maart, 18:25u</Text>
                    <Text style={styles.infoItem}>1,3 km</Text>
                    <Text style={styles.infoItem}>Belfortstraat, 9000 Gent</Text>
                    <Text style={[styles.infoItem, { fontFamily: 'Poppins_300Light' }]}>3 beschikbaar</Text>
                </View>

                <View style={styles.buttonList}>
                    <TouchableOpacity style={styles.button}>
                        <FontAwesomeIcon icon={faImage} style={{ color: 'white' }} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <FontAwesomeIcon icon={faShoppingBasket} style={{ color: 'white' }} size={30} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 15,
        marginBottom: 20
    },
    title: {
        fontFamily: "Poppins_700Bold",
        color: "rgba(148, 2, 3, 1)",
        fontSize: 21,
    },
    description: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        fontFamily: 'Poppins_400Regular',
        color: "#707070"
    },
    infoList: {
        maxWidth: "80%",
        alignItems: "flex-start",
        alignContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: 'row',

    },
    infoItem: {
        width: "50%",
        marginTop: 10,
        fontFamily: "Poppins_500Medium"
    },
    buttonList: {
        // backgroundColor:"green"
        marginTop: -20,
    },
    info: {
        justifyContent: "space-around",
        flexDirection: "row",
    },
    button: {
        backgroundColor: "rgba(148, 2, 3, 1)",
        width: 50,
        height: 50,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    }
});