import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingBasket, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useFirestore } from '../../Services';
import theme from '../../Theme/theme.style';

export function ListItem({ postData }) {

    const { imageDownloadUrl } = useFirestore()
    const [imageUrl, setImageUrl] = useState(null)
    const [imageVisible, setImageVisible] = useState(false)

    useEffect(() => {
        (async () => {
            const response = await imageDownloadUrl(postData.id)
            setImageUrl(response)

        })()
    }, [])

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

    const data = {
        title: postData.title,
        description: postData.description,
        pickup: convertDate(postData.pickup.seconds),
        address: postData.address.string,
        amount: postData.amount,
        veggie: postData.veggie,
        vegan: postData.vegan,
        price: postData.price > 0 ? "€" + postData.price : "Gratis",
        hasImage: postData.image ? true : false,
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

    const buyItem = () => {
        console.log(postData)
    }

    const showImage = () => {
        if (imageVisible) {
            setImageVisible(false)
        } else {
            setImageVisible(true)
        }
    }

    return (
        <View style={styles.listItem}>
            <Text style={styles.title}>{data.title} <Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>({data.price})</Text></Text>
            <Text style={styles.description}>{data.description}</Text>
            <View style={styles.info}>
                <View style={styles.infoList}>
                    <Text style={styles.infoItem}>{data.pickup}</Text>
                    <Text style={styles.infoItem}>1,3 km</Text>
                    <Text style={styles.infoItem}>{data.address}</Text>
                    <Text style={[styles.infoItem, { fontFamily: 'Poppins_300Light' }]}>{data.amount} beschikbaar</Text>
                </View>

                <View style={styles.buttonList}>
                    {data.hasImage
                        ?
                        <TouchableOpacity style={styles.button}>
                            <FontAwesomeIcon icon={faImage} style={{ color: theme.WHITE }} size={30} onPress={() => showImage()} />
                        </TouchableOpacity>
                        : <></>
                    }

                    {imageVisible
                        ?
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={imageVisible}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={styles.closeBtn} onPress={() => setImageVisible(false)}>
                                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: theme.PRIMARY_COLOR }} size={30} />
                                    </TouchableOpacity>

                                    <Image style={styles.image}
                                        source={{ uri: imageUrl }}
                                    />
                                </View>
                            </View>
                        </Modal>
                        : <></>
                    }

                    <TouchableOpacity style={styles.button}>
                        <FontAwesomeIcon icon={faShoppingBasket} onPress={() => buyItem()} style={{ color: theme.WHITE }} size={30} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
        padding: 10,
        borderRadius: 15,
        marginBottom: 20
    },
    title: {
        fontFamily: "Poppins_700Bold",
        color: theme.PRIMARY_COLOR,
        fontSize: 21,
    },
    description: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        fontFamily: 'Poppins_400Regular',
        color: theme.GREY
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
        backgroundColor: theme.PRIMARY_COLOR,
        width: 50,
        height: 50,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    image: {
        width: 250,
        height: 175
    },

    // Modal Styling
    centeredView: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
        borderRadius: 20,
        padding: 20,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        top: -5
    }
});