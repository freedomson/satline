
import React, {  FunctionComponent } from "react";
import { View, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import styles  from "../config/styles";

import { Stbs } from "../tables/stbs"

import { useScanner } from "../containers/useScanner";
import Orientation from 'react-native-orientation-locker';  


export const Home: FunctionComponent = (props) => {  
  
  let scanner = useScanner();

  const  NavigationsonWillFocus = ()=>{
    console.log('[SMSC][HOME] WillFocus'); // callback message

  }
  // Orientation.lockToPortrait();
  return (
      <ImageBackground
        source={require("../../assets/coverbox.jpg")}
        style={Object.assign({
          resizeMode: 'stretch'
          }
          ,styles.BackgroundImage)}>

      <ScrollView>
        
      <Stbs navigation={props.navigation} datasource={scanner} />

      </ScrollView>
        <NavigationEvents
        onWillFocus={() => { 
        NavigationsonWillFocus()
        }}/>
     </ImageBackground>


  )
};


export default Home;