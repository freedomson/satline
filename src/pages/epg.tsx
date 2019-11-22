import React, {Component} from 'react';
import {View} from "react-native";
import { Thread } from 'react-native-threads';
class Epg extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(props){

        console.log("EPG Starting")
        const thread = new Thread('./src/workers/epg.js');
        // // send a message, strings only
        console.log("EPG Posting")
        thread.postMessage(JSON.stringify(this.props.channels));
        // // listen for messages
        thread.onmessage = (message) => {
            console.log("EPG Responding -->",JSON.parse(message))
        }
        // stop the JS process
        // thread.terminate();
    }

    render() {  
        return (
            <View></View>
        );
    }
}

export default Epg;
