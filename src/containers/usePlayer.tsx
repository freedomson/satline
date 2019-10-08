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
            if (player===false) {
                let status = bootPlayer(data)  
            }
        }, 
        [player], 
      );

    async function bootPlayer() { 
        let startResp = await apiCall(`http://${data.ip}:8800/SET%20CHANNEL%20${data.progNo}%201%200%20`)
        // let progResp = await apiCall(`http://${data.ip}:8800/GET%20CHANNEL%20INFO%20${data.progNo}`)
        setPlayer(true)
    }

    let apiCall = async (url) =>
    {
        let response = await fetch(url,{
                mode: 'same-origin', // no-cors, *cors, same-origin
                cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-GB,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Connection': 'keep-alive',
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        let data = await response.text()
        return {
            response,
            data
        }
    }

    return player
}
