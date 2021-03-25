import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faChevronCircleRight, faExpand, faShoppingBag, faShoppingBasket, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useFirestore } from '../../Services';
import { useAuth } from '../../Services';
import theme from '../../Theme/theme.style';
import Slider from 'react-native-slide-to-unlock';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/nl-be';


export function ListItem({ postData, count }) {
    moment.locale('nl');

    const [imageUrl, setImageUrl] = useState(null)
    const [imageVisible, setImageVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [infoState, setInfoState] = useState(false)
    const { buyItem, checkAvailable, createPickupCode, imageDownloadUrl, createPayment } = useFirestore();
    const { user_id } = useAuth();
    // Payment
    const [awaitingPayment, setAwaitingPayment] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState()
    const [paymentId, setPaymentId] = useState(null)

    useEffect(() => {
        (async () => {
            if (postData.image != false) {
                const response = await imageDownloadUrl(postData.id)
                setImageUrl(response)
            }
        })()

        if (paymentId) {
            firebase.firestore().collection('payments').doc(paymentId).onSnapshot((doc) => {
                const data = doc.data().status
                setPaymentStatus(data)
                if (data == 'paid') {
                    finishPayment()
                }
            })
        }
    }, [paymentId, postData])

    const data = {
        title: postData.title,
        id: postData.id,
        description: postData.description,
        pickup: postData.pickup,
        address: postData.address,
        amount: !postData.amount ? 1 : postData.amount,
        veggie: postData.veggie,
        vegan: postData.vegan,
        price: postData.price > 0 ? "€" + postData.price : "Gratis",
        hasImage: postData.image ? true : false,
        seller_id: postData.seller_id,
        // seller: user_id(),
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


    const confirmPurchase = async (listingId, type) => {

        try {

            // Check if still available
            const available = await checkAvailable(listingId)

            if (available != false) {
                // If transaction needed create payment and redirect user to payment url
                if (type == 'paid') {
                    setAwaitingPayment(true)
                    setPaymentStatus('open')
                    createPayment(data).then((res) => {
                        console.log('status after creating payment: ' + res)
                        setPaymentId(res)
                    })
                } else {
                    // Create a pickup code
                    // Add payment id to code doc
                    await createPickupCode(listingId)
                    console.log("Created pickup code")

                    // Buy the item
                    await buyItem(listingId)
                    console.log("Bought item")

                    setConfirmVisible(false)

                }
            }
        } catch (e) {
            console.log(e.message)
            setConfirmVisible(false)
            setAwaitingPayment(false)
            alert("Item is niet meer beschikbaar.")
        }
    }

    const finishPayment = async () => {
        await createPickupCode(data.id)
        await buyItem(data.id)
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
                    <ImageBackground source={{ uri: imageUrl }} style={styles.backgroundImage} imageStyle={{borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
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
                <TouchableOpacity style={styles.info} onPress={() => buy()}>
                    <View style={styles.infoItem}>
                        {/* <Text style={styles.infoTxt}>Ophalen op {moment((postData.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}</Text> */}
                        <Text style={styles.infoTxt}>Ophalen op {moment((data.pickup).toDate()).format('D MMMM [om] HH:mm[u]')}</Text>
                        <Text style={styles.infoTxt}>{data.address}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoBtn}>
                            <Text style={styles.buttonTxt}>{data.price}</Text>
                            <FontAwesomeIcon icon={faShoppingBag} style={{ color: theme.WHITE }} size={25} />
                        </View>
                    </View>
                </TouchableOpacity>
                {infoState ?
                    data.seller_id != user_id()
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
                        : <Text style={styles.warningTxt}>Je kan je eigen aanbiedingen niet kopen. Bedankt voor je bijdrage aan een betere wereld!</Text>
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
                                    <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(data.id, 'free')}>
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
                                <Text style={styles.freeItemTxt}>Bevestig je aankoop</Text>
                                <View style={styles.itemConfirmDetails}>
                                    <Text style={styles.confirmDetailsBig}>{data.title}</Text>
                                    <Text style={styles.confirmDetails}>Prijs: {data.price}</Text>
                                    <Text style={styles.confirmDetails}>Adres: {data.address}</Text>
                                    <Text style={styles.confirmDetails}>Op te halen op {moment((data.pickup).toDate()).format('D MMMM [om] HH:mm[u]')}</Text>
                                </View>
                                {paymentStatus != 'paid' && paymentStatus != null
                                    ? <Text style={styles.statusTxt}>Wachten op betaling <ActivityIndicator size="small" color={theme.PRIMARY_COLOR} /></Text>
                                    : paymentStatus == 'paid'
                                        ? <Text style={styles.statusTxt}>Item is betaald</Text>
                                        : null
                                }
                                <View style={styles.itemBtnList}>
                                    {
                                        paymentStatus != 'paid'
                                            ? <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(data.id, 'paid')}>
                                                <FontAwesomeIcon icon={faCheck} style={{ color: theme.WHITE }} size={30} />
                                            </TouchableOpacity>
                                            : paymentStatus == 'open' ?
                                                <TouchableOpacity style={styles.itemBtnPositive}>
                                                    <FontAwesomeIcon style={{ color: theme.WHITE }} icon={faShoppingBasket} size={30} />
                                                </TouchableOpacity>
                                                : null
                                    }
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
        marginBottom: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        borderRadius: 15,
    },
    emptyBackground: {
        flex: 1,
    },
    emptyHeader: {
        height: 100
    },
    header: {
        height: 170,
    },
    overlay: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        height: '100%',
        padding: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        // backgroundColor: theme.NEUTRAL_BACKGROUND,
        backgroundColor: theme.TXT_INPUT_BACKGROUND,
    },
    freeItem: {
        // height: 300,
        width: 300,
    },
    freeItemTxt: {
        fontFamily: "Poppins_500Medium",
        color: theme.PRIMARY_COLOR,
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
    },
    statusTxt: {
        fontFamily: "Poppins_400Regular",
        color: theme.PRIMARY_COLOR,
        fontSize: 15,
        padding: 10,
        textAlign: 'center',
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
    closeBtn: {
        alignSelf: 'flex-end',
        zIndex: 999,
        position: 'absolute',
        padding: 5
    },
    warningTxt: {
        backgroundColor: theme.PRIMARY_COLOR,
        color: theme.SECONDARY_COLOR,
        marginTop: 2,
        padding: 10,
        textAlign: 'center'
    },

    // Modal details
    itemConfirmDetails: {
        padding: 15
    },
    confirmDetails: {
        fontFamily: "Poppins_400Regular",
        paddingBottom: 5,
    },
    confirmDetailsBig: {
        fontFamily: "Poppins_500Medium",
        fontSize: 15,
        paddingBottom: 5,
    },
});