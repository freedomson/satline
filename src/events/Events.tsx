
import React, { FunctionComponent } from "react";
import { ScrollView, View, Text,FlatList, TouchableOpacity, Linking } from "react-native";
import styles from "../config/styles";
import styles_flatlist from "../config/styles_flatlist";
import { TRANSLATIONS, APP_SEPARATOR, PAGES } from "../config/app";
import { AUTHORIZATION_DENIED, AUTHORIZATION_GRANTED } from "../config/app";
import date from 'date-and-time';
import { Icon } from 'react-native-elements';
import moment from 'moment';

export const Events: FunctionComponent = (props: any) => {
    let today = date.format(new Date(), 'ddd MMM DD YYYY')

    const onEventPress = (id) => {
        Linking.openURL(`content://com.android.calendar/events/${id}`);
    }

    const getHumanDateDelta = (datedelta) => {
        return moment( datedelta, "YYYY.MM.DD.HH:mm").fromNow()
    }

    return (props.events.events) &&< View style={[styles_flatlist.container]}>
            <View >
            </View>
            <FlatList
            data={props.events.events}
            renderItem={({item}) =>
                <View  style={styles_flatlist.container_list}>
                   
                        <TouchableOpacity activeOpacity={0.5}  
                        style={styles_flatlist.containerHeader}
                        onPress={()=>{ onEventPress(item.eventid) }}> 
                         <View  style={styles_flatlist.containerEvent}>
                            <Text style={styles_flatlist.containerHeader}>
                            <Text style={styles_flatlist.containerHeaderTitle}>
                                {`${item.event}`}
                            </Text>
                            {`\n${item.attendees}`}
                            {`\n${getHumanDateDelta(item.datedelta)}`}
                            {item.location_string && `\n${item.location_string}`}
                            </Text>
                            </View>
                        </TouchableOpacity >
              
                    <View style={styles_flatlist.containerEvent}>
                        <TouchableOpacity activeOpacity={0.5}  onPress={()=>{ props.alertManager.sendToSMS(item) }}> 
                            <Icon
                            color='green'
                            raised={true}
                            reverse={true} iconStyle={[styles_flatlist.icon]} name="sms" />
                        </TouchableOpacity >
                        <TouchableOpacity activeOpacity={0.5} onPress={()=>{ props.alertManager.sendToWA(item) }}> 
                            <Icon
                            color='green'
                            raised={true}
                            reverse={true} iconStyle={[styles_flatlist.icon]} name="face" />
                        </TouchableOpacity >
                        <TouchableOpacity activeOpacity={0.5} onPress={()=>{ props.alertManager.sendToEmail(item) }}> 
                            <Icon
                            color='green'
                            raised={true}
                            reverse={true} iconStyle={[styles_flatlist.icon]} name="email" />
                        </TouchableOpacity >
                    </View>
                </View>
                }
            />
        </View>
};



export default Events; 