
import React from 'react'
import { Linking, ImageBackground,View, StatusBar, Dimensions, ToastAndroid, ActivityIndicator } from "react-native";
import { REQUEST_HEADEARS, PAGES, TRANSLATIONS, APP_DATA_KEYS } from "../config/app";
import styles from "../config/styles";
import {Loader} from '../containers/Loader';
import colors from "../config/colors";
import Control from './Control';
import Api from '../server/Api';
import { NavigationActions, StackActions } from 'react-navigation';
import Epg from './epg'
 export default class Stb extends React.Component { 

  constructor(props) {
    super(props); 
    // Orientation.lockToLandscapeLeft()
    this.timeout                          = false
    this.timeoutInterval                  = false
    this.timeoutIntervals                 = 30
    this.timeoutIntervalsCounter          = 0
    this.controlref                       = React.createRef()
    this.retries                          = 15
    this.retrycounter                     = 0
    this.stream                           = ""
    this.playing                          = false
    let dimensions                        = this.getDimensions()
    this.xhr = new XMLHttpRequest();
    this.state = { 
        stream      : "",
        loader      : false,
        width       : dimensions.width,
        height      : dimensions.height,
        aspecRatio  : dimensions.width/dimensions.height,
        channels    : props.navigation.getParam('channels', 'no-data-stream'),
        ip          : props.navigation.getParam('ip', 'no-data-stream'),
        showControls: true
    };
  }

  getDimensions() {
    let { height, width } = Dimensions.get("window");
    let finalHeight = height-StatusBar.currentHeight
    return {"width":width,"height":finalHeight}
  }

  onUpdateChannels(channels){
    console.log("STB onUpdateChannels")
    let tmp_channels = this.state.channels
    tmp_channels.channels = channels
    this.setState({
      ...this.state,
      channels: tmp_channels
      })
  }

  async componentDidMount(props){
    // console.log("STB componentDidMount")
    //this.ip         = this.props.navigation.getParam('ip', 'no-data-stream')
    //this.channels   = this.props.navigation.getParam('channels', 'no-data-stream')
      // this.setState({
      // ...this.state
      // })
  }

  shouldComponentUpdate(props){
    // console.log("STB shouldComponentUpdate","noop return true")
    return true
  }


  onError(msg){
    this.xhr.abort()
    ToastAndroid.showWithGravity(
      msg || "STB error please try again.", 
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
    this.setState({ 
    ...this.state,
    loader: false
    })
  }

  async reloadPlayer(channel){

    this.setState({ 
        ...this.state,
        loader: true
    })

    // Refresh
    if (!channel) channel = this.state.channels.currentChannel
    let setup = await Api.change(this.state.ip,this.state.channels,channel)
    if (!setup || !setup.url){
      this.onError(setup.msg)
      return
    }

    // console.log("STB reloadPlayer",setup.url)
    let reload = this.reloadPlayer.bind(this)
    let setState = this.setState.bind(this)
    let onError = this.onError.bind(this)
    let state = this.state
    let ip = this.state.ip
    let xhr = this.xhr
    xhr.abort() 
    xhr.open("GET", setup.url, true);
    xhr.withCredentials = false;
    xhr.timeout = 500; 
    xhr.responseType = "arraybuffer";
    xhr.onerror = function(e) {
        onError("STB validation error")
    }
    xhr.ontimeout = function(e) {
        onError("STB timeout")
    }
    xhr.onprogress = async function(e) {
      if (xhr.status==200){
        if (e.loaded>10000){
          xhr.abort()
          Linking.openURL(setup.url)
          setState({ 
              ...state, 
              stream: setup.url,
              loader: false,
              ip: ip,
              channels: setup.channels
          })
          return;
        }
      }
      reload()
    }
    xhr.send()
  }

  goBack(){
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: PAGES.HOME.name })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() { 
    // console.log("RENDER PLAYER WITH STREAM", this.state.stream)
    return (
            <ImageBackground

        style={Object.assign({ 
          resizeMode: 'stretch'
          } 
          ,styles.BackgroundImage)}>
      {this.state.loader && 
        <View style={{
          paddingTop:this.getDimensions().height/2
        }}>
          < ActivityIndicator
          size="large" 
          color="#FFFFFF" />
        </View>}
    <View >
         {
          <Control
            ref={this.controlref}
            goBack={this.goBack.bind(this)}
            channels={this.state.channels}
            navigation={this.props.navigation}
            playing={this.playing}
            stbState={this.state}
            getDimensions={this.getDimensions}
            ip={this.state.ip}
            cb={this.reloadPlayer.bind(this)} />
        }
        {/* Bootstrap Epg auto loader */}
         <Epg onUpdateChannels={this.onUpdateChannels.bind(this)} channels={this.state.channels} />
      </View>
           </ImageBackground>
    )}
  }

export default Stb;