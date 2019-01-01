
import React, {  FunctionComponent } from "react";
import { View, ImageBackground, ScrollView } from "react-native";
import { NavigationEvents } from "react-navigation";
import useDimensions from '../utils/useDimensions'
import styles  from "../config/styles";
import { useEmitter } from "../containers/useEmitter";
import { useAuthorizations } from "../containers/useAuthorizations";

import { AlertManager } from "../containers/AlertManager";
import { Monitor } from "../containers/Monitor";
import { Events } from "../events/Events";
import { useEvents } from "../events/useEvents"

//import DeviceInfo from 'react-native-device-info';

export const Home: FunctionComponent = (props) => { 

  const dimensions = useDimensions()
  const emitter = useEmitter();
  const authorizationStatus = useAuthorizations()
  const events = useEvents();

  // const apiLevel = DeviceInfo.getAPILevel();
  // console.log('[SMSC][HOME] Api level:', apiLevel); 

  const alertManager = AlertManager(events);


  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus:', events); // callback message
    emitter.update(events)
  }

  return (
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({
          resizeMode: 'stretch'
          }
          ,styles.BackgroundImage)}>

      <ScrollView>
        
        <Monitor authorizationStatus={authorizationStatus} emitter={emitter} />

        <Events events={events} alertManager={alertManager}/>

      </ScrollView>
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>
     </ImageBackground>

  )
};

export default Home;