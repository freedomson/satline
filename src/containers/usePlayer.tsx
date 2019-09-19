import {
    BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect  } from 'react'
import { DeviceEventEmitter, ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";


export let usePlayer = (data) => {

    const [player, setPlayer] = useState(false);

    useEffect(
        () => { 
            if (!player) {
                let status = bootPlayer(data)
            }
        }, 
        [player],
      );

    async function bootPlayer() { 
        let startResp = await apiCall(`http://${data.ip}:8800/SET%20CHANNEL%20${data.progNo}%201%200%20`)
        console.log(startResp)
        setPlayer(true)
    }

    let apiCall = async (url) =>
    {
        let response = await fetch(url);
        let data = await response.text()
        return {
            response,
            data
        }
    }

    return player
}
