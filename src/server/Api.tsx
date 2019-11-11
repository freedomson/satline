import { REQUEST_OBJ } from "../config/app";
let endpoints = {
    register    : "http://{ip}:8800/backup/REGISTER?id={mac}&password={pass}",
    password    : "http://{ip}:8800/PASSWORD%20%20",
    model       : "http://{ip}:8800/POST%20MOBILE%20MODEL%20%20SATLITE%20000-000",
    status      : "http://{ip}:8800/GET%20MEDIA%20STATUS%20tv",
    control     : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D",
    list        : "http://{ip}:8800/GET%20NOWORNEXT%20EPG%20%7B%20%22count%22%20%3A%20%22100000%22%2C%20%22group%22%20%3A%206%2C%20%22epgNowOrNextFlag%22%20%3A%20%221%22%2C%20%22startIdx%22%20%3A%20%220%22%20%7D",
    start       : "http://{ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D"
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
        var list = endpoints.list.replace(/\{ip\}/g, ip);

        let registerResp = await wsos.apiCall(register)  
        let passwordResp = await wsos.apiCall(password)
        let modelResp = await wsos.apiCall(model)

        let config = await wsos.processStatus(ip) 
        let listResp = await wsos.apiCall(list) 
        let channels = await wsos.processChannels(listResp, config) 

        return channels;
       
    },
    processStatus: async (ip)=> { 
        var start = endpoints.start.replace(/\{ip\}/g, ip);
        var status = endpoints.status.replace(/\{ip\}/g, ip);
        let startResp = await wsos.apiCall(start)
        let statusResp = await wsos.apiCall(status)
        var config;
        if (statusResp && statusResp.response.status == 200)
        {
            let data = statusResp.data.split(/\d\d\d\s/) 
            let status = parseInt(statusResp.data.substr(0,3))
            config  = data[1] && JSON.parse(data[1]) 
            if ( status == 200 && config ) {}
        }
        return config;
    },
    processChannels: async (response, config)=> { 
        var currentIdx;
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
                    currentChannel = chnls.data[currentIdx]
                }
                channels = chnls.data 
            } 
        } 
        return {
            currentIdx,
            currentChannel,
            channels
        }
    },
    playNext : async (ip) => {
        var nextURL = endpoints.next.replace(/\{ip\}/g, ip); 
        var statusURL = endpoints.status.replace(/\{ip\}/g, ip);
        var controlURL = endpoints.status.replace(/\{ip\}/g, ip);
        let nextResp = await wsos.apiCall(nextURL)
        let statusResp = await wsos.apiCall(statusURL)
        let stateResp = await wsos.apiCall(statusURL)
        console.log(nextResp, stateResp,statusResp)
        if (stateResp && stateResp.response.status == 200)
        { 
            let data = stateResp.data.split(/\d\d\d\s/) 
            let status = parseInt(stateResp.data.substr(0,3))
            let config = data[1] && JSON.parse(data[1]) 
            if ( status == 200 && config ) {
            console.log("CHANGING")
            await wsos.apiCall(`http://${ip}:8800/SET%20CHANNEL%20${config.progNo}%201%200%20`)
            return `http://${ip}:8802/${config.progNo}.ts`
            }
        }
        return false
    }

}

export default wsos;