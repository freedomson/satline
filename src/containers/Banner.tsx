import React, { Component } from 'react';
import { View } from 'react-native';
import { AdMobBanner } from 'react-native-admob';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.adUnitID = "ca-app-pub-7368787833850291/9497003883"
  }

   onAdLoaded(){
    console.log("onAdLoaded")
  }

   onAdOpened(){
    console.log("onAdOpened")
  }

   onAdClosed(){
    console.log("onAdClosed")
  }

   onAdLeftApplication(){
    console.log("onAdLeftApplication")
  }

   onSizeChange(){
    console.log("onSizeChange")
  }

  render() {
    return (
      <View style={{position: "absolute", bottom: 0}}>  
        <AdMobBanner
          adSize="smartBanner"
          adUnitID={this.adUnitID}
          /* testDevices={["197CB8B138D02DC6DB2CDA34E6CF1826"]} */
          onAdLoaded={this.onAdLoaded}
          onAdOpened={this.onAdOpened}
          onAdClosed={this.onAdClosed}
          onAdLeftApplication={this.onAdLeftApplication}
          onSizeChange={this.onSizeChange} 
        />
      </View>
    );
  }
}