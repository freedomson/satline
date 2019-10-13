
import React, {  FunctionComponent } from "react";
import { ImageBackground, ScrollView, Text } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Stbs } from "../tables/stbs"
import { useScanner } from "../containers/useScanner";
import Shimmer from 'react-native-shimmer';
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
import Orientation from 'react-native-orientation-locker';
import {Loader} from '../containers/Loader';
import styles from "../config/styles";

export const Home: FunctionComponent = (props) => {  
  
  let scanner = useScanner();

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus'); // callback message
    Orientation.lockToPortrait()
  }
  Orientation.lockToPortrait()
  return ( 
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({ 
          resizeMode: 'stretch'
          }
          ,styles.BackgroundImage)}>

      <ScrollView> 

      <Loader loader={!(!!scanner.length)}></Loader> 

      <Shimmer style={styles.Branding} direction={"up"} duration={500}>
        <Text style={styles.Lettering}>{APP_TITLE}</Text>
      </Shimmer>

      {!!scanner.length && <Stbs navigation={props.navigation} datasource={scanner} />}

      </ScrollView>
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>
     </ImageBackground>


  )
};


export default Home;