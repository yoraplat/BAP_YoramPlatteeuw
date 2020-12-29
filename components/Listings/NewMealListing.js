import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, SafeAreaView, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import styles from "./styles";
import { TextInput } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { CheckBox } from 'react-native-elements';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFirestore } from '../../Services/service.firestore';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Geocoder from 'react-native-geocoding';

export function NewMealListing() {

    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(1);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState(null);
    const [address, setAddress] = useState(null);
    const [description, setDescription] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [veggie, setVeggie] = useState(false);
    const [vegan, setVegan] = useState(false);
    const [terms, setTerms] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [geocodeResult, setGeocodeResult] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const { createPost } = useFirestore();


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                let { mediaPermission } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                let { locationPermission } = await Location.requestPermissionsAsync();
                if (mediaPermission || locationPermission !== 'granted') {
                    //   alert('Om deze app te kunnen gebruiken ');
                }
            }
        })();
        // (async () => {
        //     await Location.getCurrentPositionAsync({})
        //         .then(async location => {
        //             setUserLocation(location)
        //             console.log(userLocation)
        //             setInProgress(false)
        //         })
        //         .then(async () => {
        //             const address = await Location.geocodeAsync({
        //                 latitude: userLocation.coords.latitude,
        //                 longitude: userLocation.coords.longitude
        //             });

        //             alert(address)
        //         }

        //         )

        // })();
    }, []);

    const changeTerms = () => {
        if (terms == false) {
            setTerms(true)
        } else {
            setTerms(false)
        }
    }
    const changeVeggie = () => {
        if (veggie == false) {
            setVeggie(true)
        } else {
            setVeggie(false)
            setVegan(false)
        }
    }

    const changeVegan = () => {
        if (vegan == false) {
            setVegan(true)
            setVeggie(true)
        } else {
            setVegan(false)
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });
    if (!fontsLoaded) {
        return <SafeAreaView style={styles.container} ><AppLoading /></SafeAreaView>
    }

    const Geocode = async () => {
        setInProgress(true);
        let error = null;
        try {
            let result = await Location.geocodeAsync(address);
            setGeocodeResult(result);
            setInProgress(false);

            return geocodeResult
        } catch (e) {
            error = e.message;
            return false
        }
    }

    const makePost = async () => {

        const location = await Geocode();

        if (location != false) {
            const newPost = {
                type: "meal",
                title: title,
                description: description,
                price: price,
                amount: amount,
                diet: {
                    veggie: veggie,
                    vegan: vegan,
                },
                pickup: date,
                address: {
                    string: address,
                    latitude: JSON.stringify(location[0].latitude),
                    longitude: JSON.stringify(location[0].longitude),
                },
                create_at: new Date(),
            }
            // alert(JSON.stringify(newPost))

            if (newPost.title && newPost.description && newPost.pickup && newPost.address !== null) {
                if (terms == true) {
                    try {
                        createPost(newPost.type, newPost)
                    } catch (e) {
                        alert(e)
                    }
                } else {
                    alert('Gelieve de voorwaarden te accepteren.')
                }
            } else {
                alert('Gelieve alle velden in te vullen.')
            }
        } else {
            alert('Gelieve een geldig adres in te geven.')
        }

    }

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView contentContainerStyle={styles.list}>
                <View style={styles.form}>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Beschrijving</Text>
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Titel"
                            placeholderTextColor={'#C48086'}
                            onChangeText={val => setTitle(val)}
                        />
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Korte Beschrijving"
                            placeholderTextColor={'#C48086'}
                            onChangeText={val => setDescription(val)}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Prijs</Text>
                        {price == 0
                            ? <Text style={styles.subtitle}>Gratis</Text>
                            : <Text style={styles.subtitle}>€{price}</Text>
                        }
                        <Slider
                            style={styles.slider}
                            step={0.5}
                            onValueChange={val => setPrice(val)}
                            minimumValue={0}
                            maximumValue={10}
                            thumbTintColor="#940203"
                            minimumTrackTintColor="#940203"
                            maximumTrackTintColor="#D94849"
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Aantal Maaltijden</Text>
                        <Text style={styles.subtitle}>{amount}x</Text>
                        <Slider
                            style={styles.slider}
                            step={1}
                            onValueChange={val => setAmount(val)}
                            minimumValue={1}
                            maximumValue={10}
                            thumbTintColor="#940203"
                            minimumTrackTintColor="#940203"
                            maximumTrackTintColor="#D94849"
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Voedingswijze</Text>
                        <CheckBox
                            title='Vegetarisch'
                            checked={veggie}
                            onPress={() => changeVeggie()}
                        />
                        <CheckBox
                            title='Veganistisch'
                            checked={vegan}
                            onPress={() => changeVegan()}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Afhaal moment</Text>
                        <TouchableOpacity style={styles.bigButton} onPress={showDatepicker}>
                            <Text style={styles.bigButtonText}>{date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()}</Text>
                            <FontAwesomeIcon icon={faCalendarAlt} size={25} style={{ color: '#C48086' }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bigButton} onPress={showTimepicker}>
                            <Text style={styles.bigButtonText}>{date.getHours() + ':' + date.getMinutes()}</Text>
                            <FontAwesomeIcon icon={faClock} size={25} style={{ color: '#C48086' }} />
                        </TouchableOpacity>
                        <View>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.title}>Adres</Text>
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Adres"
                            placeholderTextColor={'#C48086'}
                            // value='Muinkkaai 20, 9000 Gent'
                            onChangeText={val => setAddress(val)}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <CheckBox
                            title='De aangeboden voeding voldoet aan de voorwaarden'
                            checked={terms}
                            onPress={() => changeTerms()}
                        />
                    </View>

                    <TouchableOpacity disabled={inProgress ? true : false} style={styles.submitButton} onPress={() => makePost()}>
                        {inProgress
                            ? <ActivityIndicator size="large" color="white" />
                            : <Text style={styles.submitButtonTxt}>Voeding Aanbieden</Text>
                        }
                    </TouchableOpacity>



                </View>
            </ScrollView>
        </SafeAreaView>
    );
}