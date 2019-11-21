import { self } from 'react-native-threads';

// listen for messages

self.onmessage = (message) => {
   console.log("WORKER", JSON.parse(message))
   self.postMessage(JSON.stringify(message));
}

// send a message, strings only
