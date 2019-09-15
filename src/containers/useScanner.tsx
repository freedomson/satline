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

export let useScanner = () => {

    const [scanner, setScanner] = useState([null]);

    useEffect(
        () => { 
            if (scanner[0] === null) {
                let status = getDeviceNetworkStatus()
            }
        }, 
        [scanner],
      );

    async function getDeviceNetworkStatus() { 
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
                            });
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
 
    let endpoints = {
        timeout: 750,
        port: ":8800",
        portal: "/",
        start : "/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
        status : "/GET%20MEDIA%20STATUS%20tv"
    }

    async function scanNet(setup) { 

        // console.log('[SMSC][NETSCAN] setup', setup)
        var stbs: never[] | null[] | ((prevState: null[]) => null[]) | any[] = []
        for (let i = 0; i < setup["ip_range"].length; i++) {

            let ip = setup["ip_range"][i]
            let host = `http://${ip}${endpoints.port}`
            let urlPortal = `${host}${endpoints.portal}`
            let urlStart =  `${host}${endpoints.start}`
            let urlStatus = `${host}${endpoints.status}`
 
            var xhr = new XMLHttpRequest();
            xhr.open("GET", urlStatus, true);
            xhr.timeout = endpoints.timeout;
            xhr.responseType = "json";

            xhr.onload = async function(e) {  
                console.log("Detected STB", ip)
                portalResp = await apiCall(urlPortal) 
                //console.log(portalResp.response.status , portalResp.data.indexOf("Linkdroid WebServer"))
                if (portalResp.response.status == 200 && portalResp.data.indexOf("Linkdroid WebServer")>=0)
                {
                    startResp = await apiCall(urlStart)
                    statusResp = await apiCall(urlStatus)

                    if (startResp.response.status==200 && statusResp.response.status==200)
                    {
                        let start = statusResp.data.split(" ")
                        let startStatus = start[0]
                        let startData = JSON.parse(start[1])
                        console.log(startData)
                        if (startStatus==200) {
                            startData.ip = ip
                            stbs.push(startData) 
                            setScanner(stbs)
                        }
                    }
                } 
            }
            xhr.ontimeout = function (e) { 
                console.log("Server scan timeout")
            };
            xhr.send(); 
        }
    }

    async function apiCall(url)
    {
        let response = await fetch(url);
        let data = await response.text()
        return {
            response,
            data
        }
    }

    return scanner
}
