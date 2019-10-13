
import React from 'react'
import Video from 'react-native-video';
import { Assets } from "../config/assets";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import Orientation from 'react-native-orientation-locker';
import { ImageBackground, Dimensions } from "react-native";
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
import styles from "../config/styles";
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props);
    this.playerref = React.createRef()
    this.stream = this.props.navigation.getParam('stream', 'no-data-stream')
    this.state = { 
        stream: "" 
      };
    Orientation.unlockAllOrientations()
  }

  onBuffer(e) { 
    console.log("onBuffer",e)  
  }  
  onError(e) { 
    console.log("onError",e)
  }
  onLoadStart(e) {
    console.log("onLoadStart",e)
  }
  onLoad(response) {
    console.log("onLoad",response)
    this._reconfigureScreen(null)
  }
  onReadyForDisplay(e) {
    console.log("onReadyForDisplay",e)
  }
  onReady(e) {
    console.log("onReady",e)
  } 
  componentWillReceiveProps(props){
    Orientation.unlockAllOrientations()
    console.log("componentWillReceiveProps",props)
    this.setState({stream: props.navigation.getParam('stream', 'no-data-stream')})
  }
  componentDidMount(props){
    Orientation.unlockAllOrientations()
    console.log("componentDidMount",props)
    this.setState({stream: this.stream})
//  Orientation.unlockAllOrientations() 
    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
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
  componentWillUnmount(props) {
    Orientation.removeOrientationListener(this._reconfigureScreen);
    console.log("componentWillUnmount",props)
  }

  _reconfigureScreen(orientation){
    setTimeout((() => {
      const { height, width } = Dimensions.get("window");
      this.setState({
        width: width,
        height: height,
        stream: this.state.stream,
        aspecRatio : width/height
      });
    }).bind(this), 250);
    console.log("_reconfigureScreen")  
  }

  render() { 
    console.log("RENDER PLAYER WITH STREAM", this.state.stream)
    return (
            <ImageBackground
        source={require("../../assets/loader.jpg")}
        style={Object.assign({  
          resizeMode: 'stretch'
          }
          ,styles.BackgroundImage)}>
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
        playInBackground={false}
        playWhenInactive={false}
        fullscreenAutorotate={false} 
        fullscreen={false}  
        paused={false}
        resizeMode={"stretch"} 
        hideShutterView={true}
        id={"video"}
        //posterResizeMode={"stretch"}
        minLoadRetryCount={20}    
        bufferConfig={{    
          minBufferMs: 15000,  
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000
        }}
        onReady={this.onReady.bind(this)}
        onReadyForDisplay={this.onReadyForDisplay.bind(this)}
        onLoad={this.onLoad.bind(this)}
        onLoadStart={this.onLoadStart.bind(this)}
        onBuffer={this.onBuffer.bind(this)}
        onError={this.onError.bind(this)}
        style={{
          aspectRatio: this.state.aspectRatio,
          width: this.state.width,
          height: this.state.height
        }}
        //poster={Assets.loader}
         />
      </ImageBackground>
    )}
  }

export default Stb;