
import React, {  useState,  FunctionComponent } from "react";
import { Linking, ScrollView, View, Text, ImageBackground,StyleSheet } from "react-native";
// import styles from "../config/styles";
import Video from 'react-native-video';
import { usePlayer } from "../containers/usePlayer";
export const Stb: FunctionComponent =  (props) => { 

  const { navigation } = props;
  const data = navigation.getParam('data', 'no-data');
  const stream = navigation.getParam('stream', 'no-data');
  let player = usePlayer(data);

  return (
        player && 
   <Video source={{uri: stream}}   // Can be a URL or a local file.
       ref={(ref) => { 
         this.player = ref 
       }}                                      // Store reference
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onError={(err)=>{
         console.log(err,"error")
       }}               // Callback when video cannot be loaded
       style={styles.backgroundVideo} /> 
  )
};
// Later on in your styles..

var styles = StyleSheet.create({
  backgroundVideo: {
    backgroundColor: "#000000",
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0, 
    right: 0,
  },
});

export default Stb;