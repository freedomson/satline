
import React from 'react'
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { View, StatusBar, Dimensions, ToastAndroid } from "react-native";
import { REQUEST_HEADEARS, PAGES, TRANSLATIONS } from "../config/app";
import styles from "../config/styles";
import {Loader} from '../containers/Loader';
import colors from "../config/colors";
import Control from './Control';
import Api from '../server/Api';
import { NavigationActions, StackActions } from 'react-navigation';
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props); 
    Orientation.lockToLandscapeLeft()
    this.playerref = React.createRef() 
    this.retries = 3
    this.retrycounter = 0
    this.stream = this.props.navigation.getParam('stream', 'no-data-stream')
    this.ip = this.props.navigation.getParam('ip', 'no-data-stream')
    this.channels = this.props.navigation.getParam('channels', 'no-data-stream')
    this.playing = false
    let dimensions = this.calculateDimensions()
    this.state = { 
        stream: "",
        loader: true,
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height,
        channels: this.channels
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

  async onError(e) { 
    console.log("onError",e)
    this.playing = false
    let retrystate = await this.reloadPlayer(0)
    if (retrystate===false){
      let retrystate = await this.reloadPlayer(1)
      // this.setState({
      //   loader: false, 
      //   channels: this.state.channels
      //   })
      // ToastAndroid.showWithGravity(
      //   TRANSLATIONS.en.home.streamError, 
      //   ToastAndroid.LONG, 
      //   ToastAndroid.CENTER)
      // this.goBack()
    }
  }

  onLoadStart(e) {
    console.log("onLoadStart",e)
  }
  onLoad(response) {
    console.log("onLoad",response)
    this.playing = true
    this.showChannelName()
    this._reconfigureScreen(null)
    this.retrycounter = 0
  }
  onReadyForDisplay(e) {
    console.log("onReadyForDisplay noop",e)  
  }
  onReady(e) {
    console.log("onReady noop",e) 
  } 
  componentWillReceiveProps(props){
    Orientation.lockToLandscapeLeft()
    console.log("componentWillReceiveProps",props)
    this.playing = false
    this.setState({
      loader: true, 
      stream: props.navigation.getParam('stream', ''),
      channels: props.navigation.getParam('channels', '')
      })
  }
  componentDidMount(props){
    console.log("componentDidMount",props)
    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
    this.setState({
      loader: true,
      stream: this.stream,
      channels: this.channels
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
        aspecRatio : dimensions.width/dimensions.height,
        channels: this.state.channels
      }
      this.setState(newState);
      console.log("_reconfigureScreen")
    }
  }

  getLoader(){
    if (this.state.stream){
      return {
          uri: this.state.stream,
          headers: REQUEST_HEADEARS
        }
    } else {   
      return {
          uri: "",
          headers: REQUEST_HEADEARS
        }
    }
  }

  async reloadPlayer(add){

    console.log(`****\nSTB current try is ${this.retrycounter} of ${this.retries}\n****`)

    if (this.retrycounter >= this.retries ){
      this.retrycounter = 0
      console.log("STB resetting counter on reloadPlayer")
      return false
    }

    this.setState({ 
        ...this.state, 
        stream: "",
        loader: true
    })

    let setup = await Api.jump(this.ip,this.channels,add)
    if (!setup || !setup.url){
      console.log("STB error url not found")
      this.retrycounter++
      this.onError(false)
      return true;
    }

    console.log("Control",setup)

    try {
      setTimeout((() => {
        this.setState({ 
            ...this.state, 
            stream: setup.url,
            loader: true,
            ip: this.ip,
            channels: setup.channels
        })
      }).bind(this), 250);
    } catch (error) {
      console.log("STB error reading channel")
    }

    this.retrycounter++
    return true

  }

  showChannelName(){
    try {
      ToastAndroid.showWithGravity(
        this.channels.currentChannel.channelName, 
        ToastAndroid.LONG, 
        ToastAndroid.CENTER)
    } catch (error) {
      console.log("STB no channelName")
    }
  }

  goBack(){
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: PAGES.HOME.name })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() { 
    console.log("RENDER PLAYER WITH STREAM", this.state.stream)
    return (
    <View style={styles.Page}>
      <Loader loader={this.state.loader}></Loader>

      <Video source={this.getLoader()}   // Can be a URL or a local file.
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
          goBack={this.goBack.bind(this)}
          currentChannel={this.channels.currentChannel}
          navigation={this.props.navigation}
          playing={this.playing}
          stbState={this.state} 
          cb={this.reloadPlayer.bind(this)} />
      </View>
    )}
  }

export default Stb;