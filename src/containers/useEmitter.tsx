import {
    BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect  } from 'react'
import { DeviceEventEmitter, ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";
import eventEmitter from 'react-native-android-broadcast-receiver-event-reminder'

export let useEmitter = (events) => {

    const [emitter, setEmitter] = useState({
        status: null, events: events,
        activate:     () => {
            console.log('[SMSC][EMITTER] Activating receiver')
            eventEmitter.startReceiver()
            updateEmitter(emitter)
        }
      , deactivate: () => {
            console.log('[SMSC][EMITTER] Deactivating receiver')
            eventEmitter.stopReceiver()
            updateEmitter(emitter)
        },
        update: () => {
            console.log(`[SMSC][EMITTER] Update`)
            updateEmitter(emitter)
        }
    });

    useEffect(
        () => {
            if (emitter.status === null) {
                eventEmitter.startReceiver()
                updateEmitter(emitter)
            }
        },
        [emitter.status],
      );

    async function updateEmitter(emitter) {
        try {
            const status = await eventEmitter.isReceiverEnabled()
            console.log(`[SMSC][EMITTER] status[${status}]`)
            ToastAndroid.show(`${TRANSLATIONS.en.status.label}!`, ToastAndroid.SHORT);
            emitter.status = status
            setEmitter(emitter)
        } catch (err) {
            console.warn(err);
        }
    }

    return emitter
}
