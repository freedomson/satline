
import React, {  FunctionComponent } from "react";
import { ImageBackground, ScrollView, Text , ToastAndroid} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Stbs } from "../tables/stbs"
import { useScanner } from "../containers/useScanner";
import Shimmer from 'react-native-shimmer';
import { APP_TITLE } from "../config/app";
import Orientation from 'react-native-orientation-locker';
import {Loader} from '../containers/Loader';
import styles from "../config/styles";
import Router from "../forms/router"


export const Home: FunctionComponent = (props) => {  


  Orientation.lockToPortrait()
  let scanner = useScanner();

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus'); // callback message
    Orientation.lockToPortrait()
  }
 
  let toastMessage = props.navigation.getParam('toastMessage', '')
  if (toastMessage&& !scanner.scanning) {
    ToastAndroid.showWithGravity(toastMessage, ToastAndroid.LONG, ToastAndroid.CENTER)
  }

  return ( 
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({ 
          resizeMode: 'stretch'
          } 
          ,styles.BackgroundImage)}>

      <ScrollView>
  
      <Loader loader={scanner.scanning}></Loader>

      <Shimmer style={styles.Branding} direction={"up"} duration={500}>
        <Text style={styles.Lettering}>{APP_TITLE}</Text> 
      </Shimmer>

      <Router scanner={scanner}></Router> 
  
      <Stbs navigation={props.navigation} datasource={scanner.stbs} />

      </ScrollView>
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>
     </ImageBackground>


  )
};


export default Home;