import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSeedling, faLeaf, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import { useFirestore } from '../../../Services';
import theme from '../../../Theme/theme.style';

export function ProfileListItem({ postData, indexKey, type }) {

    const { checkCode, updateCodeState, fetchCodes } = useFirestore();

    const [code, setCode] = useState(null)
    const [codeList, setCodeList] = useState(null)
    const [checkingCode, setCheckingCode] = useState(false)
    const [checkResult, setCheckResult] = useState(null)

    useEffect(() => {

        // Fetch pickup codes
        const fetch = async () => {
            const data = await fetchCodes(postData.id)
            setCodeList(data)
        }
        // fetch()
        if (codeList == null || codeList.length < 1) {
            fetch();
        }
    }, [codeList]);

    const data = {
        title: postData.title,
        description: postData.description,
        pickup: postData.pickup,
        bought_at: postData.bought_at,
        address: postData.address,
        amount: postData.amount,
        veggie: postData.veggie,
        vegan: postData.vegan,
        price: postData.price > 0 ? "€" + postData.price : "Gratis",
        hasImage: postData.image ? true : false,
        id: postData.id,
        type: postData.type == "food" ? "Voeding" : "Maaltijd"
    }

    const confirmPickup = async () => {
        try {
            setCheckingCode(true)

            await checkCode(code).then((response) => {
                setCheckResult(response)
                setCheckingCode(false)

                if (response != false && response.is_used != true) {
                    updateCodeState(code, true)
                }
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



    return (
        <View style={styles.listItem}>
            <View style={styles.topLine}>
                <Text style={styles.title}>{data.title} <Text style={{ fontFamily: "Poppins_300Light", fontSize: 17 }}>({data.price})</Text></Text>
                {data.veggie == true && data.vegan == false
                    ? <FontAwesomeIcon icon={faLeaf} style={{ color: 'green', left: 10 }} size={30} />
                    : <></>
                }
                {data.vegan == true
                    ? <FontAwesomeIcon icon={faSeedling} style={{ color: 'green', left: 10 }} size={30} />
                    : <></>
                }
            </View>

            <Text style={styles.description}>{data.description}</Text>
            <View style={styles.info}>
                <View style={styles.infoList}>
                    <Text style={styles.infoItem}>{moment((data.pickup).toDate()).format('DD/MM/YYYY' + ', ' + 'hh:mm')}</Text>
                    <Text style={styles.infoItem}>{data.address}</Text>
                    <Text style={styles.infoItem}>Type: {data.type}</Text>
                    {/* {
                        data.amount
                            ? <Text style={styles.infoItem}>Nog af te halen: {data.amount}</Text>
                            : null
                    } */}
                    {data.amount > 1
                        ? <Text style={[styles.infoItem, { fontFamily: 'Poppins_300Light' }]}>Aantal: {data.amount}</Text>
                        : null
                    }
                    <View style={styles.infoItemCode}>
                        {type == 'bought'
                            ? <Text style={styles.infoCode}>
                                {codeList == null ?
                                    <ActivityIndicator size="small" color={theme.PRIMARY_COLOR} />
                                    : codeList.map((item) => <Text> {item.pickup_code} </Text>)}
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
                    {/* <View style={styles.infoItemCode}>
                        {
                            data.bought_at
                                ? <Text style={styles.infoCode}>
                                    {codeList == null ?
                                        <ActivityIndicator size="small" color={theme.PRIMARY_COLOR} />
                                        : codeList.map((item) => <Text> {item.pickup_code} </Text>)}
                                </Text>
                                :
                                <View style={styles.validateContainer}>
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
                    </View> */}
                    {
                        data.bought_at
                            ? <Text style={[styles.infoItem, styles.regularFont]}>Toon deze code bij het afhalen van je aankoop</Text>
                            : <Text style={[styles.infoItem, styles.regularFont]}>Vraag de code aan de persoon die je aanbieding komt ophalen, vul deze code hier in</Text>
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: theme.NEUTRAL_BACKGROUND,
        padding: 20,
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
        backgroundColor: theme.PRIMARY_COLOR,
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