
import React, {  useState,  FunctionComponent } from "react";
import { Animated, StyleSheet, View, Text, ImageBackground, TouchableOpacity } from "react-native";

import { useEmitter } from "./useEmitter";

import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";

import ToggleSwitch from 'toggle-switch-react-native'
import { Icon } from 'react-native-elements'
import { APP_TITLE, APP_SLOGAN, PAGES, TRANSLATIONS } from "../config/app";
import styles  from "../config/styles";

import { NavigationEvents } from "react-navigation";

export const Status: FunctionComponent = (props) => { 

  let emitter = useEmitter();

  const onToggle = function(isoff:boolean){
    return isoff ? emitter.activate() : emitter.deactivate()
  }

  const  NavigationsonWillFocus = ()=>{
    emitter.update()
  }

  return (
    <View style={styles.MainContainer}>
      <NavigationEvents
          onWillFocus={() => {
            NavigationsonWillFocus()
          }}
        />
      <View style = {styles.ButtonContainer}>

            <ToggleSwitch
              isOn={!!emitter.status}
              onColor='green'
              offColor='red'
              label={TRANSLATIONS.en.status.label}
              labelStyle={{color: 'black', fontWeight: '900'}}
              size='large'
              onToggle={ onToggle }
              icon = <Icon name={PAGES.STATUS.icon} />
            />

        <Text style = {styles.LegendDescription}>
         {TRANSLATIONS.en.status.description}
        </Text>

        </View>
    </View>
  )

};

export default Status;
