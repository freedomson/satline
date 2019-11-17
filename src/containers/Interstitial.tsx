import React, { Component } from 'react';
import { View } from 'react-native';
import { AdMobInterstitial } from 'react-native-admob';

export default class Interstitial extends Component {
  constructor(props) {
    super(props);
    this.adUnitID = "ca-app-pub-7368787833850291/9728472553"
    // 20 minutes interval
    this.timeoutInterval = setInterval(this.showAdd.bind(this), 1000 * 60 * 20 );
  }

  componentDidMount() {
    this.showAdd()
  }

  componentWillUnmount() {
    clearInterval(this.timeoutInterval)
  }

  showAdd(){
    AdMobInterstitial.setAdUnitID(this.adUnitID);
    // AdMobInterstitial.setTestDevices(["197CB8B138D02DC6DB2CDA34E6CF1826"]);
    AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  }

  render() {
    return <View></View>;
  }
}