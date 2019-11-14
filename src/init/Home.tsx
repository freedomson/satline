
import React, {  FunctionComponent } from "react";
import { ImageBackground, ScrollView, Text, ToastAndroid} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Stbs } from "../tables/stbs"
import { useScanner } from "../containers/useScanner";
import Shimmer from 'react-native-shimmer';
import { APP_TITLE } from "../config/app";
import Orientation from 'react-native-orientation-locker';
import {Loader} from '../containers/Loader';
import styles from "../config/styles";
import Router from "../forms/router"
import Banner from '../containers/Banner';

export const Home: FunctionComponent = (props) => {  


  Orientation.lockToPortrait()
  let scanner = useScanner();

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus'); // callback message
    Orientation.lockToPortrait()
  }

  let bannerError = function(args){
    console.log("Banner error!",args)
  }

  return ( 
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({ 
          resizeMode: 'stretch'
          } 
          ,styles.BackgroundImage)}>

      <Loader loader={scanner.scanning}></Loader>
      
      <Shimmer style={styles.Branding} direction={"left"} duration={500}>
        <Text style={styles.Lettering}>{APP_TITLE}</Text> 
      </Shimmer>

      <Router scanner={scanner}></Router> 

      <ScrollView>
        <Stbs navigation={props.navigation} datasource={scanner.stbs} />
      </ScrollView>
      
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>

        <Banner />
     </ImageBackground>


  )
};


export default Home;