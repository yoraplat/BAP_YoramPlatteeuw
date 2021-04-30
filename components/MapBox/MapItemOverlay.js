import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { faShoppingBasket, faTimesCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import overlayStyles from './overlayStyles'
import theme from '../../Theme/theme.style';
import { useAuth } from '../../Services';
import { useFirestore } from '../../Services';
import { ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

export function MapItemOverlay({ post, closeOverlayFunction }) {

    const { buyItem, checkAvailable, createPickupCode, imageDownloadUrl, createPayment } = useFirestore();
    const [confirmVisible, setConfirmVisible] = useState(false)
    const { user_id } = useAuth();
    const [imageUrl, setImageUrl] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)

    useEffect(() => {
        (async () => {
            if (post.image != false) {
                const response = await imageDownloadUrl(post.id)
                setImageUrl(response)
            }
        })()
    }, [post])

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

    const buy = () => {
        setConfirmVisible(true)
    }

    const confirmPurchase = async (listingId, type) => {
        try {
            // Check if still available
            const available = await checkAvailable(listingId)
            if (available != false) {
                // If transaction needed create payment and redirect user to payment url
                if (type == 'paid') {
                    setPaymentStatus('open')
                    createPayment(post).then((res) => {
                        paymentListener(res)
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
            alert("Item is niet meer beschikbaar.")
        }
    }

    const paymentListener = (id) => {
        // Listen for change in payment status
        firebase.firestore().collection('payments').doc(id).onSnapshot((doc) => {
            const data = doc.data()
            setPaymentStatus(data.status)
            if (data.status == 'paid') {
                finishPayment()
            }
        })
    }

    const finishPayment = async () => {
        await createPickupCode(post.id)
        await buyItem(post.id)
    }

    return (
        <View style={overlayStyles.mapOverlay}>
            <ImageBackground source={{ uri: imageUrl }} imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15}} style={styles.backgroundImage}>
                <View style={overlayStyles.overlay}>
                    <View style={{ padding: 15 }}>
                        <View style={[overlayStyles.topLine, { marginBottom: 5 }]}>
                            <Text style={overlayStyles.overlayTitle}>{post.title} <Text style={overlayStyles.overlaySubtitle}>({post.price != 'Gratis' ? '€' + post.price : post.price})</Text></Text>
                            <TouchableOpacity style={overlayStyles.closeBtn} onPress={() => closeOverlay()}>
                                <FontAwesomeIcon icon={faTimesCircle} style={{ color: theme.PRIMARY_COLOR }} size={30} />
                            </TouchableOpacity>
                        </View>
                        <Text style={overlayStyles.overlayDescription}>{post.description}</Text>

                        <View style={overlayStyles.info}>
                            {post.veggie == true && post.vegan == false
                                ? <Text style={overlayStyles.infoItem}>Veggie</Text>
                                : null
                            }
                            {post.vegan == true
                                ? <Text style={overlayStyles.infoItem}>Vegan</Text>
                                : null
                            }
                            <Text style={overlayStyles.infoItem}>Ophalen op {moment((post.pickup).toDate()).format('DD/MM [om] HH:mm[u]')}</Text>
                            <Text style={overlayStyles.infoItem}>Adres: {post.address}</Text>
                            <Text style={[overlayStyles.infoItem, { fontFamily: 'Poppins_300Light' }]}>{post.amount} beschikbaar</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            {
                user_id() == post.seller_id ?
                    <TouchableOpacity style={{ backgroundColor: theme.PRIMARY_COLOR, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10 }} disabled={true}>
                        <Text style={{ textAlign: 'center', color: theme.WHITE, fontSize: 15, fontFamily: 'Poppins_500Medium' }}>Je kan je eigen aanbieding niet kopen</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ backgroundColor: theme.PRIMARY_COLOR, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 10 }} onPress={() => buy()}>
                        <Text style={{ textAlign: 'center', color: theme.WHITE, fontSize: 15, fontFamily: 'Poppins_500Medium' }}>Reserveren</Text>
                    </TouchableOpacity>
            }


            {/* Complete order modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={confirmVisible}
            >
                <View style={styles.centeredViewConfirm}>
                    <View style={styles.modalViewConfirm}>
                        {post.price == 'Gratis'
                            ?
                            // Modal for free items 
                            <View style={styles.freeItem}>
                                <Text style={styles.freeItemTxt}>Ben je zeker dat je deze aanbieding wil reserveren?</Text>
                                <View style={styles.itemBtnList}>
                                    <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(post.id, 'free')}>
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
                                    <Text style={styles.confirmDetailsBig}>{post.title}</Text>
                                    <Text style={styles.confirmDetails}>{post.description}</Text>
                                    <Text style={styles.confirmDetails}>Prijs: €{post.price}</Text>
                                    <Text style={styles.confirmDetails}>Adres: {post.address}</Text>
                                    <Text style={styles.confirmDetails}>Op te halen op {moment((post.pickup).toDate()).format('D MMMM [om] HH:mm[u]')}</Text>
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
                                            ? <TouchableOpacity style={styles.itemBtnPositive} onPress={() => confirmPurchase(post.id, 'paid')}>
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
    centeredView: {
        backgroundColor: theme.TRANSPARENT_POPUP,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredViewConfirm: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalViewConfirm: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
    },
    freeItem: {
        width: 320,
    },
    freeItemTxt: {
        fontFamily: "Poppins_500Medium",
        color: theme.PRIMARY_COLOR,
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 15,
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
        color: theme.WHITE,
        marginTop: 2,
        padding: 10,
        textAlign: 'center'
    },

    // Modal details
    itemConfirmDetails: {
        padding: 15,
        marginTop: -15
    },
    confirmDetails: {
        fontFamily: "Poppins_400Regular",
        paddingBottom: 5,
    },
    imagePreview: {
        width: '100%',
        height: 250,
        marginTop: 10
    },
    confirmDetailsBig: {
        fontFamily: "Poppins_500Medium",
        fontSize: 15,
        paddingBottom: 5,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    }
});
