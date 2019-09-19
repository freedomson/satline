
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

// import Video from 'react-native-video';

export const Home: FunctionComponent = (props) => {  
  
  let scanner = useScanner();

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus:',scanner); // callback message

  }
  console.log(scanner)
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