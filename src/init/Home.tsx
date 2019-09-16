
import React, {  FunctionComponent } from "react";
import { View, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import useDimensions from '../utils/useDimensions'
import styles  from "../config/styles";
import { useScanner } from "../containers/useScanner";
import { createStackNavigator, createAppContainer } from 'react-navigation';
//import { useAuthorizations } from "../containers/useAuthorizations";

//import { AlertManager } from "../containers/AlertManager";
//import { Monitor } from "../containers/Monitor";
//import { Events } from "../events/Events";
//import { useEvents } from "../events/useEvents"
 
// import {LivePlayer} from "react-native-live-stream";
 

import { Stbs } from "../tables/stbs"

//import DeviceInfo from 'react-native-device-info'; 
// import Video from 'react-native-video';

export const Home: FunctionComponent = (props) => {  

  //onst dimensions = useDimensions()   
  const scanner = useScanner();
  //const authorizationStatus = useAuthorizations()
  //const events = useEvents();

  // const apiLevel = DeviceInfo.getAPILevel(); 
  // console.log('[SMSC][HOME] Api level:', apiLevel); 

  //const alertManager = AlertManager(events);

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus:',scanner); // callback message
    // emitter.update(events)
  }
/*
    <Video source={{uri: "http://192.168.1.104:8802/89.ts"}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onError={(err)=>{
         console.log(err,"error")
       }}               // Callback when video cannot be loaded
       style={styles.backgroundVideo} />

  */
// rtmp://fms.105.net/live/rmc1
// "https://192.168.1.104:8802/87.ts
// https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8 
  return (
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({
          resizeMode: 'stretch'
          }
          ,styles.BackgroundImage)}>

      <ScrollView>
        
    <Stbs navigation={props.navigation}  datasource={scanner} />

      </ScrollView>
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>
     </ImageBackground>


  )
};


export default Home;