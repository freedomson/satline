
import React from 'react'
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { View, StatusBar, Dimensions } from "react-native";
import { REQUEST_HEADEARS, PAGES, TRANSLATIONS } from "../config/app";
import styles from "../config/styles";
import {Loader} from '../containers/Loader';
import colors from "../config/colors";
import Control from '../containers/Control';
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props); 
    Orientation.lockToLandscapeLeft()
    this.playerref = React.createRef() 
    this.stream = require('../../assets/medium.mp4') // this.props.navigation.getParam('stream', 'no-data-stream')
    this.ip = "192.168.1.102"//this.props.navigation.getParam('ip', 'no-data-stream')
    this.config = {}//this.props.navigation.getParam('config', 'no-data-stream')
    this.playing = false
    let dimensions = this.calculateDimensions()
    this.state = { 
        stream: require('../../assets/medium.mp4'),
        loader: true,
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height
    };
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
    this.playing = false
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
    Orientation.lockToLandscapeLeft()
    console.log("componentWillReceiveProps",props)
    this.playing = false
    this.setState({
      loader: true, 
      stream: require('../../assets/medium.mp4') //props.navigation.getParam('stream', '')
      })
  }
  componentDidMount(props){
    console.log("componentDidMount",props)
    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
    this.setState({
      loader: true,
      stream: this.stream
    })
  }
  componentWillUpdate(props){
    console.log("componentWillUpdate","noop")
  }
  componentDidUpdate(props){
    console.log("componentDidUpdate","noop")
  } 
  shouldComponentUpdate(props){
    console.log("shouldComponentUpdate","noop return true")
    return true
  } 
  // componentWillUnmount(props) {
  //   Orientation.removeOrientationListener(this._reconfigureScreen);
  //   console.log("componentWillUnmount",props)
  // }
  _reconfigureScreen(orientation){
    if (this.props.navigation.isFocused()) {
      let dimensions = this.calculateDimensions()
      let newState = {
        stream: this.state.stream,
        loader: (!this.playing),
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height
      }
      this.setState(newState);
      console.log("_reconfigureScreen")
    }
  }

  render() { 
    console.log("RENDER PLAYER WITH STREAM", this.state.stream)
    return (
    <View style={styles.Page}>
      <Loader loader={this.state.loader}></Loader>

      <Video source={
        // {
        //   uri: this.state.stream,
        //   headers: REQUEST_HEADEARS
        // }
        this.state.stream
        }   // Can be a URL or a local file.
        ref={this.playerref}
        controls={false}
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
        <Control 
          ip = {this.ip}
          config = {this.config}
          stbState={this.state} 
          stbStateFunction={this.setState.bind(this)} />
      </View>
    )}
  }

export default Stb;