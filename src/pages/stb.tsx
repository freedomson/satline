
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
    this.timeoutInterval = false
    this.timeoutIntervals = 10
    this.timeoutIntervalsCounter = 0
    this.playerref = React.createRef()
    this.controlref = React.createRef()
    this.retries = 100
    this.retrycounter = 0
    this.stream = this.props.navigation.getParam('stream', 'no-data-stream')
    this.ip = this.props.navigation.getParam('ip', 'no-data-stream')
    this.channels = this.props.navigation.getParam('channels', 'no-data-stream')
    this.playing = false
    let dimensions = this.getDimensions()
    this.state = { 
        stream: "",
        loader: true,
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height,
        channels: this.channels
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
    let retrystate = await this.reloadPlayer(-1)
    // if (retrystate===false){
    //   await this.reloadPlayer(-2)
    // }
  }

  onLoadStart(e) {
    console.log("onLoadStart",e)
    if (this.timeoutInterval) clearInterval(this.timeoutInterval);
    this.timeoutInterval = setInterval(this.validateTimeout.bind(this), 1000);
  }

  validateTimeout(){
    this.timeoutIntervalsCounter++
    console.log("---EVALUATE TIMEOUT---", this.timeoutIntervalsCounter, this.timeoutIntervals)
    if (this.timeoutIntervalsCounter == this.timeoutIntervals){
      console.log("STB Timeout")
      this.setState({
        loader: false, 
        channels: this.state.channels
        })
      ToastAndroid.showWithGravity(
        TRANSLATIONS.en.home.streamError, 
        ToastAndroid.LONG, 
        ToastAndroid.CENTER)
      clearInterval(this.timeoutInterval);
      this.timeoutIntervalsCounter = this.retrycounter = 0
      // this.goBack()
    }
  }

  onLoad(response) {
    console.log("onLoad",response)
    this.playing = true
    this.showChannelName()
    this._reconfigureScreen(null)
    this.retrycounter = 0
    this.timeoutIntervalsCounter = 0
    clearInterval(this.timeoutInterval);
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
  async componentDidMount(props){

    // let data = await AsyncStorage.getItem(APP_DATA_KEYS.STBS);
    // let stbs = JSON.parse(data) 

    this.stream = this.props.navigation.getParam('stream', 'no-data-stream')
    this.ip = this.props.navigation.getParam('ip', 'no-data-stream')
    this.channels = this.props.navigation.getParam('channels', 'no-data-stream')

    console.log("STB componentDidMount")

    Orientation.addOrientationListener(this._reconfigureScreen.bind(this));
    this.setState({
      loader: true,
      stream: this.stream,
      channels: this.channels
    })
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
  componentWillUnmount(props) {
    Orientation.removeOrientationListener(this._reconfigureScreen);
    console.log("STB componentWillUnmount",props)
  }
  _reconfigureScreen(orientation){
    if (this.props.navigation.isFocused()) {
      let dimensions = this.getDimensions()
      let newState = {
        stream: this.state.stream,
        loader: (!this.playing),
        width: dimensions.width,
        height: dimensions.height,
        aspecRatio : dimensions.width/dimensions.height,
        channels: this.state.channels
      }
      this.setState(newState);
      console.log("STB _reconfigureScreen")
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

  async reloadPlayer(idx){

    switch (idx) {
      // Reload the same
      case -1:
        idx = this.channels.currentIdx
        break;
      case -2:
        idx = this.channels.currentIdx+1
        break;
      default:
        break;
    }

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

    let setup = await Api.change(this.ip,this.channels,idx)
    if (!setup || !setup.url){
      console.log("STB error channel data")
      return false;
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
        <Control
          ref={this.controlref}
          goBack={this.goBack.bind(this)}
          currentChannel={this.channels.currentChannel}
          currentChannelIdx={this.channels.currentIdx}
          channels={this.channels.channels}
          navigation={this.props.navigation}
          playing={this.playing}
          stbState={this.state}
          getDimensions={this.getDimensions}
          cb={this.reloadPlayer.bind(this)} />
      </View>
    )}
  }

export default Stb;