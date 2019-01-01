import {
    BackHandler,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react'
import { DeviceEventEmitter, ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";

export let useReceiver = (cb) => {
    
    const listenerName = 'GEventReminderBroadcastReceiver';
    
    const [receiver, setReceiver] = useState({
       listeners: []
    });

    useLayoutEffect(()=>{
        let lsn = DeviceEventEmitter.listeners(listenerName)
        console.log(`[SMSC][RECEIVER] Total listeners[${lsn.length}]`)

        if (!lsn.length) {
            DeviceEventEmitter.addListener(listenerName, function (id) {
                console.log('[SMSC][RECEIVER] Receiving data event id:' + id)
                cb(id)
            });
            receiver.listeners = lsn
            setReceiver(receiver)
        }

    }, [receiver.listeners])


    return receiver
}
