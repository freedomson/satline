
import React from 'react'
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { View, StatusBar, Dimensions } from "react-native";
import { PAGES } from "../config/app";
import styles from "../config/styles";
import {Loader} from '../containers/Loader';
import colors from "../config/colors";
import { TRANSLATIONS } from "../config/app";
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props);
    this.playerref = React.createRef() 
    this.stream = this.props.navigation.getParam('stream', 'no-data-stream')
    this.playing = false
    let dimensions = this.calculateDimensions()
    this.state = { 
        stream: "",
        loader: true,
        height: dimensions.height,
        width: dimensions.width
      };
    Orientation.unlockAllOrientations()
  }

  calculateDimensions() {
    let { height, width } = Dimensions.get("window");
    let finalHeight = height-StatusBar.currentHeight
    return {"width":width,"height":finalHeight}
  }

  onBuffer(e) { 
    console.log("onBuffer",e)  
  }  
  onError(e) { 
    console.log("onError",e)
    this.setState({loader: false})
    if (this.props.navigation.isFocused())
      this.props.navigation.navigate(PAGES.HOME.name, {
          toastMessage: TRANSLATIONS.en.home.streamError
      })
  }
  onLoadStart(e) {
    console.log("onLoadStart",e)
  }
  onLoad(response) {
    console.log("onLoad",response)
     this.playing = true
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
    this.playing = false
    this.setState({
      loader: true,
      stream: props.navigation.getParam('stream', '')
      })
  }
  componentDidMount(props){
    Orientation.unlockAllOrientations()
    console.log("componentDidMount",props)
    this.setState({
      loader: true,
      stream: this.stream
      })
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
         if (this.props.navigation.isFocused()) {
            let dimensions = this.calculateDimensions()
            this.setState({
              width: dimensions.width,
              height: dimensions.height,
              stream: this.state.stream, 
              aspecRatio : dimensions.width/dimensions.height,
              loader: (!this.playing)
            });
            console.log("_reconfigureScreen")  
         } 
      }).bind(this), 250); 
  }

  render() { 
    console.log("RENDER PLAYER WITH STREAM", this.state.stream)
    return (
    <View style={styles.Page}>
      <Loader loader={this.state.loader}></Loader> 
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
        fullscreenAutorotate={false} 
        fullscreen={false}  
        paused={false}
        resizeMode={"stretch"} 
        hideShutterView={true}
        id={"video"}
        //posterResizeMode={"stretch"}
        minLoadRetryCount={20}    
        bufferConfig={{    
          minBufferMs: 1500,  
          maxBufferMs: 5000,
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
          height: this.state.height, 
          backgroundColor: colors.app_background 
        }}
        //poster={Assets.loader}
         />
      </View>
    )}
  }

export default Stb;