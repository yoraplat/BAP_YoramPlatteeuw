import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StatusBar, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from '../../Services/service.auth';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import BoughtTab from '../../components/Profile/Bought/BoughtTab'
import OfferedTab from '../../components/Profile/Offered/OfferedTab'
import ProfileTab from '../../components/Profile/Profile/ProfileTab'
import { useFirestore } from '../../Services';
import theme from '../../Theme/theme.style';

export const ProfileScreen = ({ route }) => {

    const navigation = useNavigation();
    const { logout } = useAuth();
    const [currentTab, setCurrentTab] = useState(1)
    
    useEffect(() => {
        // If user is redirected by a notification, check the route param to redirect to the correct subtab
        if (route.params && route.params.type == 'offered') {
            setCurrentTab(2)
        }
        if (route.params && route.params.type == 'bought') {
            setCurrentTab(1)
        }
    }, [route])

    const selectTab = (id) => {
        if (currentTab == 3) {
            setCurrentTab(1)

        }
        setCurrentTab(id)
    }
    const getStyle = function (id, buttonId) {
        if (id == 1 && buttonId == 1) {
            return {
                backgroundColor: theme.PRIMARY_COLOR,
            }
        } if (id == 1 && buttonId == 2) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 1 && buttonId == 3) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 2 && buttonId == 1) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 2 && buttonId == 2) {
            return {
                backgroundColor: theme.PRIMARY_COLOR,
            }
        } if (id == 2 && buttonId == 3) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 3 && buttonId == 1) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 3 && buttonId == 2) {
            return {
                backgroundColor: theme.TAB_BACKGROUND,
            }
        } if (id == 3 && buttonId == 3) {
            return {
                backgroundColor: theme.PRIMARY_COLOR,
            }
        }
    }
    const getStyleColor = function (id, buttonId) {
        if (id == 1 && buttonId == 1) {
            return {
                color: theme.WHITE
            }
        } if (id == 1 && buttonId == 2) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } if (id == 1 && buttonId == 3) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } else {
        } if (id == 2 && buttonId == 1) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } if (id == 2 && buttonId == 2) {
            return {
                color: theme.WHITE,
            }
        } if (id == 2 && buttonId == 3) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } else {
        } if (id == 3 && buttonId == 1) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } if (id == 3 && buttonId == 2) {
            return {
                color: theme.PRIMARY_COLOR,
            }
        } if (id == 3 && buttonId == 3) {
            return {
                color: theme.WHITE,
            }
        }
    }


    const singOut = async () => {
        logout()
    }
    return (
        <SafeAreaView style={styles.container}>
            {currentTab == 1
                ? <BoughtTab />
                : null
            }
            {currentTab == 2
                ? <OfferedTab />
                : null
            }
            {currentTab == 3
                ? <ProfileTab callLogoutFunction={() => singOut()} />
                : null
            }

            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.overlayTopMiddleLeft, getStyle(currentTab, 1)]} onPress={() => selectTab(1)}>
                    <Text style={[getStyleColor(currentTab, 1), styles.tabTxt]}>Gekocht</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.overlayTopMiddle, getStyle(currentTab, 2)]} onPress={() => selectTab(2)}>
                    <Text style={[getStyleColor(currentTab, 2), styles.tabTxt]}>Aangeboden</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.overlayTopMiddleRight, getStyle(currentTab, 3)]} onPress={() => selectTab(3)}>
                    <Text style={[getStyleColor(currentTab, 3), styles.tabTxt]}>Profiel</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tabsContainer: {
        flex: 1,
        flexDirection: "row",
        position: 'absolute',
        width: '90%',
        justifyContent: "space-between"
    },
    overlayTopMiddleRight: {
        marginTop: StatusBar.currentHeight,
        top: 25,
        width: '30%',
        padding: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    overlayTopMiddle: {
        marginTop: StatusBar.currentHeight,
        top: 25,
        width: '37%',
        padding: 15,
    },
    overlayTopMiddleLeft: {
        marginTop: StatusBar.currentHeight,
        top: 25,
        width: '30%',
        padding: 15,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    tabTxt: {
        textAlign: 'center',
        fontFamily: "Poppins_700Bold",
    },
});
