import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFonts, Poppins_500Medium, Poppins_300Light, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import styles from "./styles";
import { TextInput } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { faCalendarAlt, faCamera, faClock } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFirestore } from '../../Services';
import * as Location from 'expo-location';
import theme from '../../Theme/theme.style';

// Firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

export function NewFoodListing() {

    const [post, setPost] = useState({
        price: 0,
        image: false,
        pickup: new Date(),
        title: null,
        address: null,
        description: null,
        veggie: false,
        vegan: false,
        terms: false,
        bought_at: false,
        coordinates: false,
        type: 'food'
    });

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [inProgress, setInProgress] = useState(false);

    const { createPost } = useFirestore();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                let { mediaPermission } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                let { locationPermission } = await Location.requestPermissionsAsync();
                if (mediaPermission || locationPermission !== 'granted') {
                    //   alert('Om deze app te kunnen gebruiken hebben we toegang nodig tot je locatie en foto\'s');
                }
            }
        })();
    }, []);

    const changeTerms = () => {
        if (post.terms == false) {
            setPost({ ...post, terms: true })
        } else {
            setPost({ ...post, terms: false })
        }
    }
    const changeVeggie = () => {
        if (post.veggie == false) {
            setPost({ ...post, veggie: true })
        } else {
            setPost({ ...post, veggie: false, vegan: false })
        }
    }

    const changeVegan = () => {
        if (post.vegan == false) {
            setPost({ ...post, veggie: true, vegan: true })
        } else {
            setPost({ ...post, vegan: false })
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || post.pickup;
        setShow(Platform.OS === 'ios');
        setPost({ ...post, pickup: currentDate })
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

    const pickImage = async () => {
        // let result = await ImagePicker.launchImageLibraryAsync({
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setPost({ ...post, image: result.uri })
        }
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

    const makePost = async () => {
        setInProgress(true);
            await Location.geocodeAsync(post.address).then((result) => {
                // Quick fix for testing purposes, geocode doesn't always work on virtual device
                console.log(result)
                const response = result

                // const response = {
                //     "accuracy": 0,
                //     "altitude": 0,
                //     "altitudeAccuracy": 0,
                //     "heading": 0,
                //     "latitude": 51.0547962,
                //     "longitude": 3.7077666,
                //     "speed": 0,
                // }


                if (Object.keys(response).length > 0) {
                    // Validate all fields
                    let validation = [];
                    for (let key in post) {
                        if (post[key] === null || post[key] === "") {
                            validation.push(false)
                        } else {
                            validation.push(true)
                        }
                    }


                    // When validated create the post
                    const isValid = arr => arr.every(Boolean)
                    if (isValid(validation)) {
                        console.log("All fields are filled in, creating post")

                        let data = post
                        let dataToPost = { ...data, coordinates: response[0] }
                        // console.log(dataToPost)

                        // let dataToPost = post

                        // Takes too long if coordinates are added
                        createPost(dataToPost).then(() => {
                            setInProgress(false);
                        })
                    }
                    setInProgress(false);

                } else {
                    alert("Dit adres kon niet gevonden worden.")
                    setInProgress(false);
                }
            })
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
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setTitle(val)}
                            onChangeText={val => setPost({ ...post, title: val })}
                        />

                        <TextInput
                            style={styles.txtInput}
                            placeholder="Korte Beschrijving"
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setDescription(val)}
                            onChangeText={val => setPost({ ...post, description: val })}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Prijs</Text>
                        {post.price == 0
                            ? <Text style={styles.subtitle}>Gratis</Text>
                            : <Text style={styles.subtitle}>€{post.price}</Text>
                        }
                        <Slider
                            style={styles.slider}
                            step={0.5}
                            onValueChange={val => setPost({ ...post, price: val })}
                            minimumValue={0}
                            maximumValue={10}
                            thumbTintColor={theme.PRIMARY_COLOR}
                            minimumTrackTintColor={theme.PRIMARY_COLOR}
                            maximumTrackTintColor={theme.TERTIARY_COLOR}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Voedingswijze</Text>
                        <CheckBox
                            title='Vegetarisch'
                            checked={post.veggie}
                            onPress={() => changeVeggie()}
                        />
                        <CheckBox
                            title='Veganistisch'
                            checked={post.vegan}
                            onPress={() => changeVegan()}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Foto</Text>
                        <TouchableOpacity style={styles.bigButton} onPress={pickImage}>
                            {post.image != false
                                ? <Text style={styles.bigButtonText}>Afbeelding Toegevoegd</Text>
                                : <Text style={styles.bigButtonText}>Foto Toevoegen</Text>
                            }
                            <FontAwesomeIcon icon={faCamera} size={25} style={{ color: theme.TEXT_PLACEHOLDER }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Afhaal moment</Text>
                        <TouchableOpacity style={styles.bigButton} onPress={showDatepicker}>
                            <Text style={styles.bigButtonText}>{post.pickup.getDate() + '/' + post.pickup.getMonth() + '/' + post.pickup.getFullYear()}</Text>
                            <FontAwesomeIcon icon={faCalendarAlt} size={25} style={{ color: theme.TEXT_PLACEHOLDER }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bigButton} onPress={showTimepicker}>
                            <Text style={styles.bigButtonText}>{post.pickup.getHours() + ':' + post.pickup.getMinutes()}</Text>
                            <FontAwesomeIcon icon={faClock} size={25} style={{ color: theme.TEXT_PLACEHOLDER }} />
                        </TouchableOpacity>
                        <View>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={post.pickup}
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
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setAddress(val)}
                            onChangeText={val => setPost({ ...post, address: val })}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <CheckBox
                            title='De aangeboden voeding voldoet aan de voorwaarden'
                            checked={post.terms}
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