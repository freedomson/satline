import { useEffect, useState } from 'react'
import {ToastAndroid } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import { APP_DATA_KEYS, TRANSLATIONS, REQUEST_OBJ } from "../config/app";
var sip = require ('shift8-ip-func');
var ipaddr = require('ipaddr.js');
import DeviceInfo from 'react-native-device-info';
import Api from '../server/Api'; 

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
        }
        AsyncStorage.setItem(APP_DATA_KEYS.STBS, JSON.stringify(stbin));
    }

    async function getDeviceNetworkStatus(ip) {
        //  stbs.push( {"ipcell1":ip,"ipcell2":ip, "ipcell3":ip})
        //  updateStbs(stbs,"onload")  
        //  return;
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
            let pass = Math.floor((Math.random() * 100000) + 1)
            let channels = await Api.bootstrap(ip, mac, pass)
            stbs.push( {"ipcell1":ip,"ipcell2":ip, "ipcell3":ip, "channels":channels})
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
            if ( totalipstoscan == 0 ) {
                updateStbs(stbs,"onerror") 
            }
        }; 
        xhr.onabort = function (e) { 
            --totalipstoscan
            if ( totalipstoscan == 0 ) {
                updateStbs(stbs,"onabort") 
            }
        }; 
        xhr.send(); 
    }
 
    async function apiCall(url)
    { 
        try {
            let response = await fetch(url,REQUEST_OBJ);
            let data = await response.text()
            return {
                response,
                data
            } 
        } catch (error) {
            return false;
        }
    }

    return scanner
}
