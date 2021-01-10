import React, { useState } from "react";
import { SafeAreaView, Text, StatusBar, Button, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from '../../Services/service.auth';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {

    const { logout } = useAuth();

    const navigation = useNavigation();

    const singOut = async () => {
        await logout();
        navigation.navigate('Login'); 
    }
    return (
        <SafeAreaView style={styles.container}>
        {/* {currentTab == 1 
        ? <Map/>
        : <ItemsList/>
        } */}
            <>
                <Button
                    title="Logout"
                    onPress={() => singOut()}
                />
            </>
            
        </SafeAreaView>
    );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
