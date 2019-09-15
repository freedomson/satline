
import React, {  FunctionComponent } from "react";
import { View, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import useDimensions from '../utils/useDimensions'
// import styles  from "../config/styles";
import { useScanner } from "../containers/useScanner";
//import { useAuthorizations } from "../containers/useAuthorizations";

//import { AlertManager } from "../containers/AlertManager";
//import { Monitor } from "../containers/Monitor";
//import { Events } from "../events/Events";
//import { useEvents } from "../events/useEvents"

// import {LivePlayer} from "react-native-live-stream";

import Video from 'react-native-video';

//import DeviceInfo from 'react-native-device-info'; 


export const Home: FunctionComponent = (props) => {  

  //onst dimensions = useDimensions()   
  const scanner = useScanner();


  //const authorizationStatus = useAuthorizations()
  //const events = useEvents();

  // const apiLevel = DeviceInfo.getAPILevel(); 
  // console.log('[SMSC][HOME] Api level:', apiLevel); 

  //const alertManager = AlertManager(events);

/*
  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus:', events); // callback message
    emitter.update(events)
  }*/
// rtmp://fms.105.net/live/rmc1
// "https://192.168.1.104:8802/87.ts
// https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8 
  return (
    <Video source={{uri: "http://192.168.1.104:8802/89.ts"}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onError={(err)=>{
         console.log(err,"error")
       }}               // Callback when video cannot be loaded
       style={styles.backgroundVideo} /> 
    /* 
  <LivePlayer source={{uri:"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"}}
 ref={(ref) => {
         this.player = ref
       }}  // Store reference
        paused={false}
        muted={false}
        bufferTime={300}
        maxBufferTime={1000} 
   resizeMode={"contain"}
   onLoading={()=>{}}
   onLoad={()=>{}}
   onEnd={()=>{}}
       style={styles.backgroundVideo} /> */

  )
};

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0, 
    right: 0,
  },
});
export default Home;