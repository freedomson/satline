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

    const [scanner, setScanner] = useState([]);
    var stbs = []

    useEffect(
        () => { 
            if (scanner.length === 0) {
                DeviceInfo.getMacAddress().then(mac => {
                    let status = getDeviceNetworkStatus(mac)
                });
            }
        },  
        [scanner],
      );

    async function getDeviceNetworkStatus(mac) { 
        try { 
            NetworkInfo.getIPV4Address().then(ip => {
                local_ip = ip;
                NetworkInfo.getBroadcast().then(address => {
                    local_broadcast = address;
                    SubnetmaskModule.getSubnet((sb) => {
                        local_netmask = sb;
                        subconv = ipaddr.IPv4.parse(local_netmask).prefixLengthFromSubnetMask();
                        firstHost = ipaddr.IPv4.networkAddressFromCIDR(local_ip + "/" + subconv);
                        lastHost = ipaddr.IPv4.broadcastAddressFromCIDR(local_ip + "/" + subconv);
                        firstHostHex = sip.convertIPtoHex(firstHost);
                        lastHostHex = sip.convertIPtoHex(lastHost);
                        ipRange = sip.getIPRange(firstHostHex,lastHostHex);
                        ipRange = ipRange.slice(1); // Remove the first ip in the array
                        // Resolve all the calculated values 
                        scanNet({local_ip: local_ip, 
                                local_broadcast: local_broadcast, 
                                local_netmask: local_netmask, 
                                subnet_conv: subconv, 
                                first_host: firstHost, 
                                last_host: lastHost,
                                first_host_hex: firstHostHex, 
                                last_host_hex: lastHostHex, 
                                ip_range: ipRange 
                            },mac);
                    });
                }).catch((err)=>{
                    console.log('[SMSC][NETSCAN] ERROR', err) 
                });
            });

            return 'w'; 
        } catch (err) {
            console.warn(err);  
        }
    }

    async function scanNet(setup,mac) { 

        let timeout = 750

        for (let i = 0; i < setup["ip_range"].length; i++) {

            let status_code_success = 200
            let ip = setup["ip_range"][i]
            let port = "8800"
            let endpoint_state = `http://${ip}:${port}/GET%20MEDIA%20STATUS%20tv`
            
            var xhr = new XMLHttpRequest(); // We need timeout capabilities
            xhr.open("GET", endpoint_state, true);
            xhr.withCredentials = true;
            xhr.timeout = timeout;
            xhr.responseType = "json";
  
            xhr.onload = async function(e) {  

                console.log("Detected STB", ip, xhr) 
                let rpass = Math.floor((Math.random() * 100000) + 1)
                
                let resgister = await apiCall(`http://${ip}:${port}/backup/REGISTER?id=${mac}&password=${rpass}`)

                let password = await apiCall(`http://${ip}:${port}/PASSWORD%20%20`) 

                let model = await apiCall(`http://${ip}:${port}/POST%20MOBILE%20MODEL%20%20SATLINE%20000-000`)

                let startStart = await apiCall(`http://${ip}:${port}/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D`)

                let stateResp = await apiCall(endpoint_state)
    
                console.log(resgister,password,model,startStart,stateResp)
 
                if (stateResp.response.status == status_code_success)
                { 
                    let data = stateResp.data.split(" ")
                    let status = parseInt(data[0])
                    let config = data[1] && JSON.parse(data[1])
                    if ( status==status_code_success && config ) {  
                        config.ip = ip
                        config.clone = config
                        stbs.push(config)
                        setScanner(stbs)
                    }
                } 
                
            }
            xhr.ontimeout = function (e) { 
                // console.log("Server scan timeout")
            };
            xhr.send(); 
        }
    }
 
    async function apiCall(url)
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
        // console.log(url,data)
        return {
            response,
            data
        }
    }

    return scanner
}
