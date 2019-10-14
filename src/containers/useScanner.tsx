import {
    BackHandler,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect  } from 'react'
import { DeviceEventEmitter, ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";

import { NetworkInfo } from 'react-native-network-info';
import SubnetmaskModule from 'get-subnet-mask';
var sip = require ('shift8-ip-func');
var ipaddr = require('ipaddr.js');
import DeviceInfo from 'react-native-device-info';

export let useScanner = () => {

    const [scanner, setScanner] = useState({
        stbs: [],
        scan: scan,
        scanning: false
    });
    var stbs = []

    useEffect(
         () => {
        },
        [scanner.scanning],
      );
 
    function scan(ip) {
        stbs = []
        setScanner({
            stbs: stbs,
            scan: scan,
            scanning: true
        });
        DeviceInfo.getMacAddress().then(async mac => {
            console.log("DEVICE MAC",mac)
            await getDeviceNetworkStatus(mac)
        });
    }

    function updateStbs(stbs){
        setScanner({
            stbs: stbs,
            scan: scan,
            scanning: false
        })
    }

    async function getDeviceNetworkStatus(mac) {  
        try { 
            NetworkInfo.getIPV4Address().then(ip => {
                let local_ip = ip; 
                console.log("LOCAL IP",ip)
                let local_netmask = "255.255.255.0";
                let subconv = ipaddr.IPv4.parse(local_netmask).prefixLengthFromSubnetMask();
                let firstHost = ipaddr.IPv4.networkAddressFromCIDR(local_ip + "/" + subconv);
                let lastHost = ipaddr.IPv4.broadcastAddressFromCIDR(local_ip + "/" + subconv);
                let firstHostHex = sip.convertIPtoHex(firstHost);
                let lastHostHex = sip.convertIPtoHex(lastHost);
                let ipRange = (sip.getIPRange(firstHostHex,lastHostHex)).slice(1);
                console.log("RANGE",ipRange.length)
                scanNet({ip_range: ipRange },mac);
            });
        } catch (err) {
            console.warn(err);  
        }
    }

    async function scanNet(setup,mac) { 
        let timeout = 5000
        let totalipstoscan = setup["ip_range"].length
        for (let i = 0; i < setup["ip_range"].length; i++) {
          
            let status_code_success = 200
            let ip = setup["ip_range"][i]
  
            let port = "8800"
            let endpoint_state = `http://${ip}:${port}/GET%20MEDIA%20STATUS%20tv`

            var xhr = new XMLHttpRequest(); // We need timeout capabilities
            xhr.open("GET", endpoint_state, true);
            xhr.withCredentials = true;
            xhr.timeout = timeout;
            xhr.responseType = "text";
  
            xhr.onload = async function(e) {
                --totalipstoscan
                console.log("Detected STB", ip, xhr) 
                let rpass = Math.floor((Math.random() * 100000) + 1)
                
                let resgister = await apiCall(`http://${ip}:${port}/backup/REGISTER?id=${mac}&password=${rpass}`)

                let password = await apiCall(`http://${ip}:${port}/PASSWORD%20%20`) 

                let model = await apiCall(`http://${ip}:${port}/POST%20MOBILE%20MODEL%20%20SATLINE%20000-000`)

                let startStart = await apiCall(`http://${ip}:${port}/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D`)

                let stateResp = await apiCall(endpoint_state)

                let portal = await apiCall(`http://${ip}:8800`)
    
                console.log(resgister,password,model,startStart,stateResp,portal)

                if (stateResp && stateResp.response.status == status_code_success)
                { 
                     
                    let data = stateResp.data.split(/\d\d\d\s/) 
                    let status = parseInt(stateResp.data.substr(0,3))
                    let config = data[1] && JSON.parse(data[1]) 
                    console.log("Pushing", ip,status,config) 
                    if ( status==status_code_success && config ) {  
                        
                        config.ip = ip
                        config.clone = config
                        stbs.push(config)
                    }
                } 
                if ( totalipstoscan == 0 ) {
                    updateStbs(stbs)
                }
                 
            }  
            xhr.ontimeout = function (e) { 
                --totalipstoscan
                if ( totalipstoscan == 0 ) {
                    updateStbs(stbs) 
                }
            }; 
            xhr.onerror = function (e) { 
                --totalipstoscan
                if ( totalipstoscan == 0 ) {
                    updateStbs(stbs) 
                }
            }; 
            xhr.onabort = function (e) { 
                --totalipstoscan
                if ( totalipstoscan == 0 ) {
                    updateStbs(stbs) 
                }
            }; 
            xhr.send(); 
        }
    }
 
    async function apiCall(url)
    { 
        try {
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
            // console.log(url,data)
            return {
                response,
                data
            } 
        } catch (error) {
            // console.log(error)
            return false;
        }
    }

    return scanner
}
