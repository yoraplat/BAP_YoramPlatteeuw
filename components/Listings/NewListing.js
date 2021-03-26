import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';

export function NewListing() {

    // Current date + 2 days
    const current_date = new Date()
    current_date.setDate(current_date.getDate() + 2)

    const [post, setPost] = useState({
        price: 0,
        image: null,
        pickup: current_date,
        title: null,
        address: null,
        description: null,
        veggie: false,
        vegan: false,
        terms: null,
        bought_at: false,
        coordinates: false,
        type: 'food'
    });

    const navigation = useNavigation();
    const [selectedAmount, setSelectedAmount] = useState(1);
    const [isMeal, setIsMeal] = useState(false);
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
        if (post.terms == null) {
            setPost({ ...post, terms: true })
        } else {
            setPost({ ...post, terms: null })
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

    const setMeal = () => {
        if (isMeal) {
            setIsMeal(false)
            setPost({ ...post, type: 'food' })
        } else {
            setIsMeal(true)
            setPost({ ...post, type: 'meal' })
        }
    }

    const makePost = async () => {
        setInProgress(true)
        // Validate all inputs before continuing
        const validation = []
        Object.values(post).map((value, index) => {
            if (value !== null) {
                validation.push('valid')
            } else {
                validation.push('invalid')
            }
        })

        const isValid = arr => arr == 'valid' || arr === false
        // Continue if validation is successful
        if (validation.every(isValid)) {
            // Fetch address geo data
            await Location.geocodeAsync(post.address).then((result) => {
                const response = result

                if (Object.keys(response).length > 0) {
                    let data = post
                    let dataToPost;
                    if (post.type == 'meal') {
                        dataToPost = { ...data, coordinates: response[0], amount: selectedAmount }
                    } else {
                        dataToPost = { ...data, coordinates: response[0] }
                    }

                    createPost(dataToPost).then(() => {
                        setInProgress(false);
                    })
                    setInProgress(false);

                    // Clear all inputs
                    setPost({
                        price: 0,
                        image: null,
                        pickup: new Date(),
                        title: null,
                        address: null,
                        description: null,
                        veggie: false,
                        vegan: false,
                        terms: null,
                        bought_at: false,
                        coordinates: false,
                        type: 'food'
                    })

                    // Navigate profile screen
                    // Pass parameter to got to the offerd tab
                    navigation.navigate('Profile', {
                        type: 'offered'
                    })
                } else {
                    alert("Dit adres kon niet gevonden worden.")
                    setInProgress(false);
                }
            })
        }
        else {
            alert("Gelieve alle velden correct in te vullen")
            setInProgress(false)
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
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setTitle(val)}
                            value={post.title}
                            onChangeText={val => setPost({ ...post, title: val.trim() == '' ? null : val })}
                            maxLength={35}
                        />

                        <TextInput
                            style={styles.txtInput}
                            placeholder="Korte Beschrijving"
                            value={post.description}
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setDescription(val)}
                            onChangeText={val => setPost({ ...post, description: val.trim() == '' ? null : val })}
                            maxLength={90}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <View style={{ flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' }}>
                            <Switch
                                trackColor={{ false: theme.NO_FOCUS, true: theme.FOCUS }}
                                thumbColor={"#f4f3f4"}
                                onValueChange={() => setMeal()}
                                value={isMeal}
                            />
                            <Text style={styles.text}>Dit is een maaltijd</Text>
                        </View>
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
                    {isMeal
                        ?
                        <View style={styles.formItem}>
                            <Text style={styles.title}>Aantal Porties</Text>
                            <Text style={styles.subtitle}>{selectedAmount}x</Text>
                            <Slider
                                style={styles.slider}
                                step={1}
                                onValueChange={val => setSelectedAmount(val)}
                                minimumValue={1}
                                maximumValue={10}
                                thumbTintColor={theme.PRIMARY_COLOR}
                                minimumTrackTintColor={theme.PRIMARY_COLOR}
                                maximumTrackTintColor={theme.TERTIARY_COLOR}
                            />
                        </View>
                        :
                        null
                    }
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Foto</Text>
                        <TouchableOpacity style={styles.bigButton} onPress={pickImage}>
                            {post.image != null
                                ? <Text style={styles.bigButtonText}>Afbeelding Toegevoegd</Text>
                                : <Text style={styles.bigButtonText}>Foto Toevoegen</Text>
                            }
                            <FontAwesomeIcon icon={faCamera} size={25} style={{ color: theme.TEXT_PLACEHOLDER }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.title}>Voedingswijze</Text>
                        <View style={{}}>
                            <CheckBox
                                title='Vegetarisch'
                                checked={post.veggie}
                                onPress={() => changeVeggie()}
                                containerStyle={{ backgroundColor: theme.NEUTRAL_BACKGROUND, width: '100%', padding: 0 }}
                                textStyle={{ color: theme.PRIMARY_COLOR }}
                                checkedColor={theme.PRIMARY_COLOR}
                            />
                            <CheckBox
                                title='Veganistisch'
                                checked={post.vegan}
                                onPress={() => changeVegan()}
                                containerStyle={{ backgroundColor: theme.NEUTRAL_BACKGROUND, width: '100%', padding: 0 }}
                                textStyle={{ color: theme.PRIMARY_COLOR }}
                                checkedColor={theme.PRIMARY_COLOR}
                            />
                        </View>
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
                        {show && (
                            <View>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={post.pickup}
                                    mode={mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                    style={{ width: '100%' }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.title}>Adres</Text>
                        <TextInput
                            style={styles.txtInput}
                            placeholder="Adres"
                            placeholderTextColor={theme.TEXT_PLACEHOLDER}
                            // onChangeText={val => setAddress(val)}
                            value={post.address}
                            onChangeText={val => setPost({ ...post, address: val.trim() == '' ? null : val })}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <CheckBox
                            title='De aangeboden voeding voldoet aan de voorwaarden'
                            checked={post.terms}
                            onPress={() => changeTerms()}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            textStyle={{ color: theme.PRIMARY_COLOR }}
                            checkedColor={theme.PRIMARY_COLOR}
                        />
                    </View>

                    <TouchableOpacity disabled={inProgress ? true : false} style={styles.submitButton} onPress={() => makePost()}>
                        {inProgress
                            ? <ActivityIndicator size="large" color={theme.PRIMARY_COLOR} />
                            : <Text style={styles.submitButtonTxt}>Voeding Aanbieden</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}