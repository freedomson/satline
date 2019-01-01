
import React, { FunctionComponent } from "react";
import { ScrollView, View, Text } from "react-native";
import styles from "../config/styles";
import Shimmer from 'react-native-shimmer';
import { TRANSLATIONS } from "../config/app";
import { AUTHORIZATION_DENIED, AUTHORIZATION_GRANTED } from "../config/app";
import Status from '../containers/Status';
export const Monitor: FunctionComponent = (props: any) => {

    let emitterStatus = !!props.emitter.status
    let authorizationStatus = (props.authorizationStatus == AUTHORIZATION_GRANTED)

    return (
        <View style={styles.MainContainer}>
            <Text style={[styles.Lettering, (emitterStatus ? styles.On : styles.Off)]}>
                {emitterStatus ? TRANSLATIONS.en.home.on : TRANSLATIONS.en.home.off}
            </Text> 
            
            <Text style={[styles.Lettering, (authorizationStatus ? styles.On : styles.Off)]}>
                {authorizationStatus ? TRANSLATIONS.en.home.authorized : TRANSLATIONS.en.home.notAuthorized}
            </Text>
        </View>
    )
};



export default Monitor;