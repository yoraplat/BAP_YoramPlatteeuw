import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSeedling, faLeaf, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import { useFirestore } from '../../../Services';
import theme from '../../../Theme/theme.style';

export function BoughtItem({ postData, type }) {

    const { checkCode, updateCodeState, fetchCodes, checkPickup } = useFirestore();
    const [code, setCode] = useState(null)
    const [codeList, setCodeList] = useState(null)
    const [checkingCode, setCheckingCode] = useState(false)
    const [checkResult, setCheckResult] = useState(null)
    const [status, setStatus] = useState(null)

    useEffect(() => {

        // Fetch pickup codes
        if (type == 'bought') {
            const fetch = async () => {
                const data = await fetchCodes(postData.id)
                setCodeList(data)
            }
            if (codeList == null || codeList.length < 1) {
                fetch();
            }
        }
    }, [codeList]);

    const confirmPickup = async () => {
        try {
            setCheckingCode(true)
            await checkCode(code).then((response) => {

                if (response != false && response.is_used != true && response.listing_id == postData.id) {
                    setCheckResult(response)
                    updateCodeState(code, true)
                } else {
                    setCheckResult(false)
                    console.log("Code is not valid for this post")
                }
                setCheckingCode(false)
            })
        } catch (e) {
            console.log(e.message)
        }
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


    const check_status = async () => {
        let item_status
        // Check if pickup date had passed and skip checking pickup codes
        let date = postData.pickup.toDate()
        let current_date = new Date
        // Check if pickup date has past
        if (date < current_date) {
            item_status = true
        }
        // Check if post has been bought
        if (postData.bought_at != false) {
            // Check if all pickup codes for certain post are used
            const status_response = await checkPickup(postData.id)
            item_status = status_response
        }
        return item_status
    }

    if (postData) {
        const fetch = async () => {
            const res = await check_status()
            setStatus(res)
        }
        fetch()
    }

    return (
        <>
            { status == null || status == false
                ? <View style={styles.listItem}>
                    {postData != null ?
                        <>
                            <View style={styles.topLine}>
                                <Text style={styles.title}>{postData.title} <Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>(€{postData.price})</Text></Text>
                                {postData.veggie == true && postData.vegan == false
                                    ? <FontAwesomeIcon icon={faLeaf} style={{ color: 'green', left: 10 }} size={30} />
                                    : <></>
                                }
                                {postData.vegan == true
                                    ? <FontAwesomeIcon icon={faSeedling} style={{ color: 'green', left: 10 }} size={30} />
                                    : <></>
                                }
                            </View>

                            <Text style={styles.description}>{postData.description}</Text>
                            <View style={styles.info}>
                                <View style={styles.infoList}>
                                    <Text style={styles.infoItem}>{moment((postData.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'HH:mm[u]')}</Text>
                                    <Text style={styles.infoItem}>{postData.address}</Text>
                                    <Text style={styles.infoItem}>Type: {postData.type == 'meal' ? 'Maaltijd' : 'Voeding'}</Text>
                                    <View style={styles.infoItemCode}>
                                        {type == 'bought'
                                            ? <Text style={styles.infoCode}>
                                                {codeList == null ?
                                                    <ActivityIndicator size="small" color={theme.PRIMARY_COLOR} />
                                                    : codeList.map((item, index) => <Text key={index}> {item.pickup_code} </Text>)}
                                            </Text>

                                            : <View style={styles.validateContainer}>
                                                <TextInput
                                                    style={styles.infoInput}
                                                    placeholder="CODE"
                                                    onChangeText={val => setCode(val)}
                                                />
                                                <TouchableOpacity style={styles.validateBtn} onPress={() => confirmPickup()}>
                                                    {checkingCode
                                                        ? <Text style={styles.validateBtnTxt}><ActivityIndicator size="small" color="white" /></Text>
                                                        : checkResult == null
                                                            ? <Text style={styles.validateBtnTxt}>Valideren</Text>
                                                            : checkResult.is_used == true
                                                                ? <Text style={styles.validateBtnTxt}>Al gebruikt</Text>
                                                                : checkResult == false
                                                                    ? <FontAwesomeIcon icon={faTimes} style={styles.checkIcon} />
                                                                    : <FontAwesomeIcon icon={faCheck} style={styles.checkIcon} />
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                    {
                                        <Text style={[styles.infoItem, styles.regularFont]}>Toon deze code bij het afhalen van je aankoop, vergeet ook geen potjes mee te nemen om je maaltijd/voeding in te bewaren</Text>
                                    }
                                </View>
                            </View>
                        </>
                        : <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
                    }
                </View>
                : <View style={styles.listItem}>
                    {postData != null
                        ?
                        <>
                            <View style={styles.topLine}>
                                <Text style={styles.title}>{postData.title} <Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>(€{postData.price})</Text></Text>
                                {postData.veggie == true && postData.vegan == false
                                    ? <FontAwesomeIcon icon={faLeaf} style={{ color: 'green', left: 10 }} size={30} />
                                    : <></>
                                }
                                {postData.vegan == true
                                    ? <FontAwesomeIcon icon={faSeedling} style={{ color: 'green', left: 10 }} size={30} />
                                    : <></>
                                }
                            </View>

                            <Text style={styles.description}>{postData.description}</Text>
                            <View style={styles.info}>
                                <View style={styles.infoList}>
                                    <Text style={styles.infoItem}>{moment((postData.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}</Text>
                                    <Text style={styles.infoItem}>{postData.address}</Text>
                                    <Text style={[styles.infoItem, styles.regularFont]}>Dit item is niet meer beschikbaar</Text>
                                </View>
                            </View>
                            <View style={styles.disabledOverlay}>
                            </View>
                        </>
                        : <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
                    }
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        top: 20
    },
    disabledOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15
    },
    title: {
        fontFamily: "Poppins_700Bold",
        color: theme.PRIMARY_COLOR,
        fontSize: 21,
    },
    description: {
        fontSize: 12,
        // marginTop: 2.5,
        marginBottom: 5,
        fontFamily: 'Poppins_400Regular',
        color: theme.GREY
    },
    infoList: {
        // maxWidth: "80%",
        alignItems: "flex-start",
        alignContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: 'column',

    },
    infoItem: {
        marginTop: 2.5,
        fontFamily: "Poppins_500Medium"
    },
    buttonList: {
        // backgroundColor:"green"
        marginTop: -20,
    },
    info: {
        // justifyContent: "space-around",
        // flexDirection: "row",
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
    topLine: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    infoCode: {
        backgroundColor: theme.TXT_INPUT_BACKGROUND,
        paddingVertical: 7,
        paddingHorizontal: 10,
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: theme.PRIMARY_COLOR,
        marginTop: 10,
        borderRadius: 10,
    },
    infoInput: {
        backgroundColor: theme.TXT_INPUT_BACKGROUND,
        paddingVertical: 7,
        // paddingHorizontal: 10,
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: theme.PRIMARY_COLOR,
        marginTop: 10,
        borderRadius: 10,
        minWidth: 100,
        textAlign: "center",
        paddingTop: 15
    },
    regularFont: {
        marginTop: 5,
        fontFamily: "Poppins_400Regular",
        fontSize: 12
    },
    validateContainer: {
        flexDirection: 'column',
    },
    validateBtn: {
        backgroundColor: theme.BUTTON_BACKGROUND,
        alignItems: 'center',
        padding: 5
    },
    validateBtnTxt: {
        textAlign: 'center',
        color: theme.BUTTON_TXT_COLOR,
        fontSize: 15,
        // padding: 5,
    },
    checkIcon: {
        textAlign: 'center',
        color: theme.BUTTON_TXT_COLOR,
        fontSize: 15,
    },
});