import { self } from 'react-native-threads';
import Api from '../server/Api';
// listen for messages

self.onmessage = async (message) => {
   console.log("EPG WORKER receiving message")
   let data = JSON.parse(message)
   // console.log("EPG WORKER working",data)
   ch = await Api.populateEPG(data)
//   self.postMessage(JSON.stringify(data));
   self.postMessage(JSON.stringify(ch));
}

// send a message, strings only
