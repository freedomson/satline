import {
    BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect  } from 'react'
import { DeviceEventEmitter, ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";

import DeviceInfo from 'react-native-device-info'; 

export let usePlayer = (data) => {

    const [player, setPlayer] = useState(false);

    useEffect(
        () => { 
            if (!player) {
                let status = bootPlayer()
            }
        }, 
        [player],
      );

    async function bootPlayer() { 
                DeviceInfo.getMacAddress().then(async mac => {
                    console.log(mac,`http://192.168.1.101:8800/backup/REGISTER?id=${encodeURIComponent(mac)}&password=333`)
urlSetChannel2 =  await apiCall(`http://192.168.1.104:8800/`)
  let r = await apiCall(`http://192.168.1.104:8800/backup/REGISTER?id=${encodeURIComponent(mac)}&password=3323423433`)
                console.log(r)
                let r2 = await apiCall(`http://192.168.1.104:8800/POST%20MOBILE%20MODEL%20%20LEY%20NMO-L31Hr`)
                console.log(r2)
                let r3 = await apiCall(`http://192.168.1.104:8800/PASSWORD`)
console.log(r3,'dd')


                    startResp = await apiCall(data.urlStart)
                // urlSetChannel =  await apiCall(`http://192.168.1.104:8800/SET%20CHANNEL%20%20${data.progNo}%201`)
                    statusResp = await apiCall(data.urlStatus)

                //let urlStatus = await apiCall(data.urlStatus)
                //console.log(urlStart,urlStatus,urlPortal,urlSetChannel)

                setPlayer(true)
                });

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
