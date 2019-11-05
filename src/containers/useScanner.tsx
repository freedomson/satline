import { useEffect, useState } from 'react'
import {ToastAndroid, AsyncStorage } from "react-native";
import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";
var sip = require ('shift8-ip-func');
var ipaddr = require('ipaddr.js');
import DeviceInfo from 'react-native-device-info';

export let useScanner = () => {

    const [scanner, setScanner] = useState({
        stbs: false,
        scan: scan,
        scanning: false
    });

    var stbs = []
    var timeout = 0
    var totalipstoscan = 0
    var rangeips = []
    var mac = ""

    useEffect(
         () => {},
        [scanner.scanning],
      );
 
    async function scan(ip) {
        setScanner({stbs: [], scan: scan,scanning: true});
        DeviceInfo.getMacAddress().then(async mac => {
            console.log("DEVICE MAC",mac)
            mac = mac
            await getDeviceNetworkStatus(ip)
        });
    }

    async function updateStbs(stbin,stage){
        console.log("Updating STBS",stage,stbin)
        stbs = []
        let scanner = {
            stbs: stbin,
            scan: scan,
            scanning: false
        }
        setScanner(scanner)
        if (!stbin.length) {
            ToastAndroid.showWithGravity(TRANSLATIONS.en.home.noBoxFound, ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            ToastAndroid.showWithGravity(TRANSLATIONS.en.home.boxFound, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
        AsyncStorage.setItem(APP_DATA_KEYS.STBS, JSON.stringify(stbin));
    }

    async function getDeviceNetworkStatus(ip) {
        try { 
            console.log("Router IP",ip,mac)
            let local_netmask = "255.255.255.0";
            let subconv = ipaddr.IPv4.parse(local_netmask).prefixLengthFromSubnetMask();
            let firstHost = ipaddr.IPv4.networkAddressFromCIDR(ip + "/" + subconv);
            let lastHost = ipaddr.IPv4.broadcastAddressFromCIDR(ip + "/" + subconv);
            let firstHostHex = sip.convertIPtoHex(firstHost);
            let lastHostHex = sip.convertIPtoHex(lastHost);
            let ipRange = (sip.getIPRange(firstHostHex,lastHostHex)).slice(1);
            console.log("RANGE",ipRange.length)
            scanNet({ip_range: ipRange });
        } catch (err) {
            console.warn(err);
        }
    }

    async function scanNet(setup) { 
        timeout = 250
        totalipstoscan = setup["ip_range"].length
        rangeips = setup["ip_range"].length
        for (var i = 0; i < rangeips; i++) {
            searchBox(setup["ip_range"][i]) 
        }
    }

    async function searchBox(ip) {
        let xhr = new XMLHttpRequest(); // We need timeout capabilities
        xhr.open("GET", `http://${ip}:8800/G`, true);
        xhr.withCredentials = true;
        xhr.timeout = timeout; 
        xhr.responseType = "text";
        xhr.onload = async function(e) {
            console.log("Detected STB", ip, totalipstoscan) 
            let rpass = Math.floor((Math.random() * 100000) + 1)
            await apiCall(`http://${ip}:8800/backup/REGISTER?id=${mac}&password=${rpass}`)
            await apiCall(`http://${ip}:8800/PASSWORD%20%20`) 
            await apiCall(`http://${ip}:8800/POST%20MOBILE%20MODEL%20%20SATLINE%20000-000`)
            stbs.push( {"ipcell1":ip,"ipcell2":ip, "ipcell3":ip})
            --totalipstoscan
            if ( totalipstoscan == 0 ) updateStbs(stbs,"onload")

        }  
        xhr.ontimeout = function (e) { 
            --totalipstoscan
            if ( totalipstoscan == 0 ) {
                updateStbs(stbs,"ontimeout") 
            }
        };
        xhr.onerror = function (e) { 
            --totalipstoscan
            console.log(totalipstoscan)
            if ( totalipstoscan == 0 ) {
                updateStbs(stbs,"onerror") 
            }
        }; 
        xhr.onabort = function (e) { 
            --totalipstoscan
            console.log(totalipstoscan)
            if ( totalipstoscan == 0 ) {
                updateStbs(stbs,"onabort") 
            }
        }; 
        xhr.send(); 
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
