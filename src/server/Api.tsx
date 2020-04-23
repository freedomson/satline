import { REQUEST_OBJ, APP_DATA_KEYS } from "../config/app";
import AsyncStorage from '@react-native-community/async-storage'
let endpoints = {
    register    : "http://{ip}:8800/backup/REGISTER?id={mac}&password={pass}",
    password    : "http://{ip}:8800/PASSWORD%20%20",
    model       : "http://{ip}:8800/POST%20MOBILE%20MODEL%20%20SATLITE_{model}%20000-000",
    status      : "http://{ip}:8800/GET%20MEDIA%20STATUS%20tv",
    control     : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
    list        : "http://{ip}:8800/GET%20NOWORNEXT%20EPG%20%7B%20%22count%22%20%3A%20%22100000%22%2C%20%22group%22%20%3A%206%2C%20%22epgNowOrNextFlag%22%20%3A%20%221%22%2C%20%22startIdx%22%20%3A%20%220%22%20%7D",
    start       : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
    set         : "http://{ip}:8800/SET%20CHANNEL%20{progNo}%201%200%20",
    play        : "http://{ip}:8802/{progNo}.ts",
    listPT      : "http://{ip}:8800/GET%20NOWORNEXT%20EPG%20%7B%20%22count%22%20%3A%20%221000%22%2C%20%22group%22%20%3A%20%222%22%2C%20%22epgNowOrNextFlag%22%20%3A%20%221%22%2C%20%22startIdx%22%20%3A%20%220%22%2C%22satNo%22%20%3A%20%2254%22%20%7D",
    epg         : "http://{ip}:8800/GET%20EPGLIST%20%7B%22startTime%22%3A{starttime}%2C%22startIndex%22%3A0%2C%22endTime%22%3A{endtime}%2C%22serviceId%22%3A{channelServiceId}%2C%22count%22%3A100%2C%22channelTpNo%22%3A{channelTpNo}%7D"
}
 
let wsos = {
    parseResponseData: (resp)=> {
        var out;
        try{
            if (resp && resp.response.status == 200)
            {
                let status = resp.data.substr(0,3)
                let data = resp.data.substr(3,resp.data.length)
                // // console.log(status,data)
                out = JSON.parse(data) 
            }
            return out
        } catch(e){
            return [] 
        }
    },
    populateEPG : async (channels) => {

        // console.log("Bootstrapping populateEPG", channels)

        let ip = channels.ip
        let ch = channels.channels
        let mac = channels.mac
        let pass = channels.pass

        await wsos.bootstrap(ip,mac, pass)

        var now = new Date().getTime().toString().slice(0,-3);
        var start = new Date();
        start.setMinutes(start.getMinutes() - 120); // 1hour
        start = new Date(start).getTime(); // Date object
        var end = new Date();
        end.setMinutes(end.getMinutes() + 120); // 1hour
        end = new Date(end).getTime(); // Date object
        await Promise.all(ch.map( async (item,key) => {
            // // console.log(item.channelName)
            // if(item.channelName !="TVCine 1 HD") return
            var epgURL = endpoints.epg 
                            .replace(/\{ip\}/g, ip)
                            .replace(/\{channelServiceId\}/g, item.channelServiceId)
                            .replace(/\{channelTpNo\}/g, item.channelTpNo)
                            .replace(/\{starttime\}/g, start.toString().slice(0,-3))
                            .replace(/\{endtime\}/g, end.toString().slice(0,-3));
            
            let epgResp = await wsos.apiCall(epgURL);
            let data = wsos.parseResponseData(epgResp);
            let epgName = ""
            let epgSearch = ""
            if (data && data.count > 0 ) {
                data.data.forEach(item => {
                    if (now > item.epgStartTime && now < item.epgEndTime) {
                        epgName = item.epgName
                    }
                    if ((now > item.epgStartTime && now < item.epgEndTime) || now < item.epgEndTime) {
                        epgSearch += `${item.epgName} ${item.epgDescription} `
                    }
                    // let st = new Date(item.epgStartTime * 1e3).toISOString().slice(-13, -5)
                    // let et = new Date(item.epgEndTime * 1e3).toISOString().slice(-13, -5)
                });
                ch[key].epgList = data.data
                epgName = epgName ? epgName : data.data[0].epgName
            }
            ch[key].epgName = epgName
            ch[key].epgSearch = epgSearch
        }));
        return ch
    },
    apiCall : async (url) => {
        let response = await fetch(url, REQUEST_OBJ);
        let data = await response.text()
        return { 
            response,
            data
        }  
    }, 
    bootstrap: async (ip,mac,pass) => {  

        var register = endpoints.register.replace(/\{ip\}/g, ip).replace(/\{mac\}/g, mac).replace(/\{pass\}/g, pass);
        var password = endpoints.password.replace(/\{ip\}/g, ip);
        var model = endpoints.model.replace(/\{ip\}/g, ip).replace(/\{model\}/g, pass);
        var list = endpoints.list.replace(/\{ip\}/g, ip);

        let registerResp = await wsos.apiCall(register)
        let passwordResp = await wsos.apiCall(password)
        let modelResp = await wsos.apiCall(model)

        let config = await wsos.processStatus(ip) 
        let listResp = await wsos.apiCall(list) 
        let channels = await wsos.processChannels(listResp, config, ip) 

        return channels;
       
    },
    processStatus: async (ip)=> { 
        var start = endpoints.start.replace(/\{ip\}/g, ip);
        var status = endpoints.status.replace(/\{ip\}/g, ip);
        let startResp = await wsos.apiCall(start)
        let statusResp = await wsos.apiCall(status)
        var config;
        // console.log("API processStatus",statusResp)
        if (statusResp && statusResp.response.status == 200)
        {
            let data = statusResp.data.split(/\d\d\d\s/) 
            let status = parseInt(statusResp.data.substr(0,3))
            config  = data[1] && JSON.parse(data[1]) 
            if ( status == 200 && config ) {}
        }
        return config;
    },
    processChannels: async (response, config, ip)=> { 
        var currentIdx = 0;
        var currentChannel;
        var channels;
        if (response && response.response.status == 200) 
        {  
            let data = response.data.split(/\d\d\d\s/) 
            let status = parseInt(response.data.substr(0,3)) 
            let chnls = data[1] && JSON.parse(data[1])
            if ( status == 200 &&  chnls && chnls.data ) { 
                if (config && config.progNo) {
                    currentIdx = chnls.data.findIndex(item => item.channelNo == config.progNo);
                    currentChannel = chnls.data[currentIdx?currentIdx:0]
                }
                channels = chnls.data 
            } 
        } 
        return {
            currentIdx,
            currentChannel,
            channels,
            ip
        }
    },

    change : async (ip,channels,channel) => {

        // console.log("API currentChannel CHANGE", channel)

        channels.currentChannel = channel
        var setURL = endpoints.set.replace(/\{ip\}/g, ip).replace(/\{progNo\}/g, channel.channelNo);
        await wsos.apiCall(setURL)

        let config = await wsos.processStatus(ip)

        if (config && !config.msg)
        { 
            var url  = endpoints.play.replace(/\{ip\}/g, ip).replace(/\{progNo\}/g, config.progNo);
            wsos.saveState(ip, channels)
            return {
                url,
                channels
            }
        } else {
            // Channel as issues bypass rescursive
            // console.log("API bad channel...")
            return {
                url:"",
                channels:"",
                msg: config.msg
            }
        }
    },

    saveState : async (ip, channels) => {
        let data = await AsyncStorage.getItem(APP_DATA_KEYS.STBS);
        let stbs = JSON.parse(data) 
        let stbIdx = stbs.findIndex(item => item.ipcell1 == ip);
        stbs[stbIdx].channels = channels
        AsyncStorage.setItem(APP_DATA_KEYS.STBS, JSON.stringify(stbs));
    }

}

export default wsos;