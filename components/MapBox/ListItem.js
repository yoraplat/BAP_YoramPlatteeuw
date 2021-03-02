import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faChevronCircleRight, faExpand, faShoppingBag, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useFirestore } from '../../Services';
import theme from '../../Theme/theme.style';
import Slider from 'react-native-slide-to-unlock';

export function ListItem({ postData, count }) {

    const [imageUrl, setImageUrl] = useState(null)
    const [imageVisible, setImageVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [infoState, setInfoState] = useState(false)
    const { buyItem, checkAvailable, createPickupCode, imageDownloadUrl } = useFirestore();

    useEffect(() => {
        (async () => {
            if (postData.image != false) {
                const response = await imageDownloadUrl(postData.id)
                setImageUrl(response)
            }
        })()
        console.log('loaded list item ' + count)
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
        return `${hour}:${minutes}u (${day} ${month})`
    }


    const data = {
        title: postData.title,
        id: postData.id,
        description: postData.description,
        pickup: convertDate(postData.pickup.seconds),
        address: postData.address,
        amount: !postData.amount ? 1 : postData.amount,
        veggie: postData.veggie,
        vegan: postData.vegan,
        price: postData.price > 0 ? "€" + postData.price : "Gratis",
        hasImage: postData.image ? true : false,
        // image: imageUrl
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

    const buy = () => {
        if (infoState == false) {
            setInfoState(true)
        } else {
            setInfoState(false)
        }
    }

    const confirmPurchase = async (listingId) => {
        try {
            // Check if still available
            console.log("Checking if available")
            const available = await checkAvailable(listingId)

            if (available != false) {
                // Create a pickup code
                await createPickupCode(listingId)
                console.log("Created pickup code")

                // Buy the item
                await buyItem(listingId)
                console.log("Bought item")

                // console.log("Creating code and buying item")
                setConfirmVisible(false)
            }


        } catch (e) {
            console.log(e.message)
            setConfirmVisible(false)
            // alert("Item is niet meer beschikbaar.")
        }
    }

    const showImage = async () => {
        if (imageVisible) {
            setImageVisible(false)
        } else {
            if (data.hasImage != false) {
                const response = await imageDownloadUrl(data.id)
                setImageUrl(response)
              }
            setImageVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* {data.hasImage
                    ? */}
                    <View style={styles.header}>
                        <ImageBackground source={{ uri: imageUrl }} style={styles.backgroundImage}>
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{data.title}</Text>
                                <Text style={styles.description}>{data.description}</Text>
                                <Text style={styles.description}>{data.amount} beschikbaar</Text>

                                <TouchableOpacity style={styles.imageSizeBtn} onPress={() => showImage()}>
                                    <FontAwesomeIcon icon={faExpand} style={{ color: theme.WHITE }} size={25} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                   {/* :

                    <View style={styles.emptyHeader}>
                        <View style={styles.emptyBackground}>
                            <View style={styles.overlay}>
                                <Text style={styles.title}>{data.title}</Text>
                                <Text style={styles.description}>{data.description}</Text>
                            </View>
                        </View>
                    </View>
                } */}
                <TouchableOpacity style={styles.info} onPress={() => buy()}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoTxt}>Ophalen om {data.pickup}</Text>
                        <Text style={styles.infoTxt}>{data.address}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoBtn}>
                            <Text style={styles.buttonTxt}>{data.price}</Text>
                            <FontAwesomeIcon icon={faShoppingBag} style={{ color: theme.WHITE }} size={25} />
                        </View>
                    </View>
                </TouchableOpacity>
                {infoState
                    ? <View style={styles.buyInfo}>
                        <Slider
                            onEndReached={() => {
                                setConfirmVisible(true)
                            }}
                            containerStyle={{
                                margin: 5,
                                backgroundColor: 'white',
                                borderRadius: 25,
                                padding: 5,
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}
                            sliderElement={
                                <FontAwesomeIcon icon={faChevronCircleRight} style={{ color: theme.PRIMARY_COLOR, backgroundColor: theme.WHITE }} size={30} />
                            }
                        >
                            <Text style={{ fontSize: 15 }}>Reserveren</Text>
                        </Slider>
                    </View>
                    : null
                }
            </View>

            {/* Image detail modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={imageVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setImageVisible(false)}>
                            <FontAwesomeIcon icon={faTimes} style={{ color: theme.TERTIARY_COLOR }} size={30} />
                        </TouchableOpacity>

                        <Image style={styles.image}
                            source={{ uri: imageUrl }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Complete order modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={confirmVisible}
            >
                <View style={styles.centeredViewConfirm}>
                    <View style={styles.modalViewConfirm}>
                        {data.price == 'Gratis'
                            ?
                            // Modal for free items 
                            <View style={styles.freeItem}>
                                <Text style={styles.freeItemTxt}>Ben je zeker dat je deze aanbieding wil reserveren?</Text>
                                <View style={styles.itemBtnList}>
                                    <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(data.id)}>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: theme.WHITE }} size={30} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemBtnNegative} onPress={() => setConfirmVisible(false)}>
                                        <FontAwesomeIcon icon={faTimes} style={{ color: theme.WHITE }} size={30} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            // Modal for paid items 
                            :
                            <View style={styles.freeItem}>
                                <Text style={styles.freeItemTxt}>TODO: pay for the offer</Text>
                                <View style={styles.itemBtnList}>
                                    <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(data.id)}>
                                        <FontAwesomeIcon icon={faCheck} style={{ color: theme.WHITE }} size={30} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemBtnNegative} onPress={() => setConfirmVisible(false)}>
                                        <FontAwesomeIcon icon={faTimes} style={{ color: theme.WHITE }} size={30} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                    </View>
                </View>
            </Modal>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
        marginBottom: 20
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    emptyBackground: {
        flex: 1,
    },
    emptyHeader: {
        height: 100
    },
    header: {
        height: 170
    },
    overlay: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        height: '100%',
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: "Poppins_700Bold",
        color: theme.WHITE,
        fontSize: 25
    },
    description: {
        fontFamily: "Poppins_400Regular",
        color: theme.WHITE,
        fontSize: 18
    },
    infoTxt: {
        fontFamily: "Poppins_400Regular",
        color: theme.WHITE,
        fontSize: 15,
    },
    info: {
        padding: 10,
        backgroundColor: theme.PRIMARY_COLOR,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    infoBtn: {
        flex: 1,
        alignItems: 'center',
    },
    buttonTxt: {
        color: theme.WHITE,
    },
    imageSizeBtn: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        flex: 3,
    },
    buyInfo: {
        backgroundColor: theme.PRIMARY_COLOR,
        padding: 10,
        color: 'white',
        marginTop: 2,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buyInfoText: {
        color: 'white',
        fontFamily: "Poppins_400Regular",
        fontSize: 17,
        width: '100%',
        flex: 1,
        textAlign: 'left',
    },
    image: {
        width: 360,
        height: 270,
    },

    // // Modal Styling
    centeredView: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredViewConfirm: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalViewConfirm: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
    },
    freeItem: {
        // height: 300,
        width: 300,
    },
    freeItemTxt: {
        fontFamily: "Poppins_400Regular",
        color: theme.PRIMARY_COLOR,
        fontSize: 18,
        padding: 20
    },
    itemBtnList: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: theme.NEUTRAL_BACKGROUND,
    },
    itemBtnPositive: {
        padding: 10,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: theme.TERTIARY_COLOR,
    },
    itemBtnNegative: {
        padding: 10,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: theme.RED,

    },

    // modalView: {
    // shadowColor: '#000',
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // },
    closeBtn: {
        alignSelf: 'flex-end',
        zIndex: 999,
        position: 'absolute',
        padding: 5
    }
});