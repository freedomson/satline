import { REQUEST_OBJ } from "../config/app";
let endpoints = {
    register    : "http://{ip}:8800/backup/REGISTER?id={mac}&password={pass}",
    password    : "http://{ip}:8800/PASSWORD%20%20",
    model       : "http://{ip}:8800/POST%20MOBILE%20MODEL%20%20SATLITE%20000-000",
    status      : "http://{ip}:8800/GET%20MEDIA%20STATUS%20tv",
    control     : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
    list        : "http://{ip}:8800/GET%20NOWORNEXT%20EPG%20%7B%20%22count%22%20%3A%20%22100000%22%2C%20%22group%22%20%3A%206%2C%20%22epgNowOrNextFlag%22%20%3A%20%221%22%2C%20%22startIdx%22%20%3A%20%220%22%20%7D",
    start       : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
    set         : "http://{ip}:8800/SET%20CHANNEL%20{progNo}%201%200%20",
    play        : "http://{ip}:8802/{progNo}.ts",
    listPT      : "http://{ip}:8800/GET%20NOWORNEXT%20EPG%20%7B%20%22count%22%20%3A%20%221000%22%2C%20%22group%22%20%3A%20%222%22%2C%20%22epgNowOrNextFlag%22%20%3A%20%221%22%2C%20%22startIdx%22%20%3A%20%220%22%2C%22satNo%22%20%3A%20%2254%22%20%7D"
}
let wsos = {
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
        var model = endpoints.model.replace(/\{ip\}/g, ip);
        var list = endpoints.listPT.replace(/\{ip\}/g, ip);

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
        console.log("API processStatus",statusResp)
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
    jump : async (ip,channels,add=false) => {

        try {
            let nidx = channels.currentIdx+add
            channels.currentIdx = nidx
            try {
                channels.currentChannel = channels.channels[channels.currentIdx]
            } catch (error) {
                console.log(error)
                channels.currentChannel = next ? channels.channels[0] : channels.channels[channels.channels.length]
            }
            channels.currentChannel = channels.channels[channels.currentIdx]
            var setURL = endpoints.set.replace(/\{ip\}/g, ip).replace(/\{progNo\}/g, channels.currentChannel.channelNo);

            await wsos.apiCall(setURL)
            let config = await wsos.processStatus(ip)
            
            if (config)
            { 
                var url  = endpoints.play.replace(/\{ip\}/g, ip).replace(/\{progNo\}/g, config.progNo);

                return {
                    url,
                    channels
                }
            }

        } catch (error) {
            console.log("API ERROR playPrevious",error)
            return false
        }
    }
}

export default wsos;