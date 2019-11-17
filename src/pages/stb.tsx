
import React from 'react'
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { View, StatusBar, Dimensions, ToastAndroid, ActivityIndicator } from "react-native";
import { REQUEST_HEADEARS, PAGES, TRANSLATIONS, APP_DATA_KEYS } from "../config/app";
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
    this.timeoutInterval                  = false
    this.timeoutIntervals                 = 20
    this.timeoutIntervalsCounter          = 0
    this.playerref                        = React.createRef()
    this.controlref                       = React.createRef()
    this.retries                          = 100
    this.retrycounter                     = 0
    this.stream                           = ""
    this.channels                         = this.props.navigation.getParam('channels', 'no-data-stream')
    this.playing                          = false
    let dimensions                        = this.getDimensions()
    this.state = { 
        stream      : "",
        loader      : true,
        width       : dimensions.width,
        height      : dimensions.height,
        aspecRatio  : dimensions.width/dimensions.height,
        channels    : this.channels,
        showControls: false
    };
  }

  getDimensions() {
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
    await this.reloadPlayer(this.state.channels.currentChannel,true)
  }

  onLoadStart(e) {
    console.log("onLoadStart","noop")
  }

  onLoad(response) {
    console.log("onLoad",response)
    this.playing = true
    this.showChannelName()
    this._reconfigureScreen(null)
    this.clearTimeout(true)
  }

  validateTimeout(){
    this.timeoutIntervalsCounter++
    console.log("---\n\nEVALUATE TIMEOUT---", this.timeoutIntervalsCounter, this.timeoutIntervals)
    if (this.timeoutIntervalsCounter == this.timeoutIntervals){
      this.timeout = true
    }
  }

  clearTimeout(shallow=false){
      if (!shallow){
        this.setState({
          ...this.state,
          loader: false
          })
        ToastAndroid.showWithGravity(
          TRANSLATIONS.en.home.streamError, 
          ToastAndroid.LONG, 
          ToastAndroid.CENTER)
      }
      clearInterval(this.timeoutInterval);
      this.retrycounter = 0
      this.timeoutIntervalsCounter = 0
      this.timeout = false
  }

  onReadyForDisplay(e) {
    console.log("onReadyForDisplay noop",e)  
  }

  onReady(e) {
    console.log("onReady noop",e) 
  } 

  async componentWillReceiveProps(props){
    Orientation.lockToLandscapeLeft()
    console.log("componentWillReceiveProps",props)
    this.playing    = false
    this.ip         = this.props.navigation.getParam('ip', 'no-data-stream')
    this.channels   = this.props.navigation.getParam('channels', 'no-data-stream')
    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
    await this.reloadPlayer(this.channels.currentChannel)
  }

  async componentDidMount(props){
    // let data = await AsyncStorage.getItem(APP_DATA_KEYS.STBS);
    // let stbs = JSON.parse(data) 
    console.log("STB componentDidMount")
    this.ip         = this.props.navigation.getParam('ip', 'no-data-stream')
    this.channels   = this.props.navigation.getParam('channels', 'no-data-stream')
    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    await this.reloadPlayer(this.channels.currentChannel)
  }

  componentWillUpdate(props){
    console.log("STB componentWillUpdate", "noop")
  }
  componentDidUpdate(props){
    console.log("STB componentDidUpdate","noop")
  } 
  shouldComponentUpdate(props){
    console.log("STB shouldComponentUpdate","noop return true")
    return true
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._reconfigureScreen);
    Orientation.removeOrientationListener(this._orientationDidChange);
    this.clearTimeout()
    console.log("STB componentWillUnmount")
  }

  _orientationDidChange(orientation){
    console.log("STB _orientationDidChange",orientation)
    setTimeout(() => {
      if (orientation.toLowerCase().includes("landscape")) {
        this.setState({
          ...this.state,
          showControls: true
        });
      }
    }, 100);
  }

  _reconfigureScreen(orientation){
    if (this.props.navigation.isFocused()) {
      let dimensions = this.getDimensions()
      let newState = {
        ...this.state,
        stream: this.state.stream,
        loader: (!this.playing),
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height,
        channels: this.state.channels
      }
      this.setState(newState);
      console.log("STB _reconfigureScreen",orientation)
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

  async reloadPlayer(channel, retry=false){

    // Refresh
    if (!channel) channel = this.channels.currentChannel

    switch (retry) {
      case false:
        this.retrycounter = 0
        this.clearTimeout(true)
        this.timeoutInterval = setInterval(this.validateTimeout.bind(this), 1000);
        break;
    }

    console.log(`****\nSTB reloading ${this.retrycounter} of ${this.retries}\n****`)

    if (this.retrycounter >= this.retries || this.timeout ){
      console.log(`STB no more retries (${(this.retrycounter >= this.retries)}) or timedout (${this.timeout})`)
      this.clearTimeout()
      return
    }

    this.setState({ 
        ...this.state, 
        stream: "",
        loader: true
    })

    let setup = await Api.change(this.ip,this.channels,channel)
    if (!setup || !setup.url){
      console.log("STB error channel data")
      if (setup.msg) {
        ToastAndroid.showWithGravity(
          setup.msg, 
          ToastAndroid.LONG, 
          ToastAndroid.CENTER)
      }
      this.retrycounter++
      return
    }

    console.log("STB reloadPlayer",setup)

    setTimeout((() => {
      this.setState({ 
          ...this.state, 
          stream: setup.url,
          loader: true,
          ip: this.ip,
          channels: setup.channels
      })
    }).bind(this), 250);

    this.retrycounter++
    return

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

      {this.state.loader && 
        <View style={{
          paddingTop:this.getDimensions().height/2
        }}>
          < ActivityIndicator
          size="large" 
          color="#FFFFFF" />
        </View>}

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
         {
          this.state.showControls &&
          <Control
            ref={this.controlref}
            goBack={this.goBack.bind(this)}
            currentChannel={this.state.channels.currentChannel}
            channels={this.state.channels.channels}
            navigation={this.props.navigation}
            playing={this.playing}
            stbState={this.state}
            getDimensions={this.getDimensions}
            cb={this.reloadPlayer.bind(this)} />
        }
      </View>
    )}
  }

export default Stb;