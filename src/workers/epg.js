import { self } from 'react-native-threads';
import Api from '../server/Api';
// listen for messages

self.onmessage = async (message) => {
   let data = JSON.parse(message)
   console.log("FUCK1",data)
   ch = await Api.populateEPG(data)
   console.log("FUCK2")
   self.postMessage(JSON.stringify(ch));
}

// send a message, strings only
