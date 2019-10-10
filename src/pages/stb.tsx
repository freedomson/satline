
import React, { FunctionComponent  } from 'react'
import { StyleSheet } from "react-native";
import Video from 'react-native-video';
import { usePlayer } from "../containers/usePlayer";
import { Assets } from "../config/assets";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";

//export const Stb: FunctionComponent =  (props) => { 
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props);
    this.navigation = props.navigation; 
    this.stream = this.navigation.getParam('stream', 'no-data-stream');
    this.playerref = React.createRef()
    this.ready = false
    this.state = { 
        stream: "",
        width: DEVICE_WIDTH,
        heigth: DEVICE_HEIGHT
      };
  }

  onBuffer(e) { 
    console.log("onBuffer",e)  
  }  
  onError(e) { 
    console.log("onError",e) 
    //console.log(this.playerref.current)
  }
  onLoadStart(e) {
    console.log("onLoadStart",e)
  }
  onLoad(response) {
    console.log("onLoad",response)
    this.setState({
      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
      stream: this.state.stream,
      aspecRatio : DEVICE_WIDTH/DEVICE_HEIGHT
    });
  }
  onReadyForDisplay(e) {
    console.log("onReadyForDisplay",e)
  }
  onReady(e) {
    console.log("onReady",e)
  } 
  componentWillReceiveProps(props){
    console.log("componentWillReceiveProps",props)
  }
  componentDidMount(props){
    console.log("componentDidMount",props)
    this.setState({stream: this.stream})
  }
  componentWillUpdate(props){
    console.log("componentWillUpdate",props)
  }
  componentDidUpdate(props){ 
    console.log("componentDidUpdate",props)
  }
  shouldComponentUpdate(props){
    console.log("shouldComponentUpdate",props)
    return true
  } 
  
  render() { 
    console.log("RENDER PLAYER", this.stream)
    return (
      <Video source={{
          uri: this.state.stream,
          headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-GB,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        }}   // Can be a URL or a local file.
        ref={this.playerref}
        controls={true}
        playInBackground={true}
        playWhenInactive={true}
        fullscreenAutorotate={true} 
        fullscreen={true}  
        paused={false}
        resizeMode={"stretch"} 
        hideShutterView={true}
        id={"video"}
        posterResizeMode={"stretch"}
        minLoadRetryCount={20}    
        bufferConfig={{    
          minBufferMs: 15000,  
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000
        }}
        onReady={this.onReady}
        onReadyForDisplay={this.onReadyForDisplay}
        onLoad={this.onLoad.bind(this)}
        onLoadStart={this.onLoadStart}
        onBuffer={this.onBuffer}
        onError={this.onError.bind(this)}
        style={{
          aspectRatio: this.state.aspectRatio,
          width: this.state.width,
          height: this.state.height
        }}
        poster={Assets.loader}
         />  
    )}
  }

export default Stb;