import React, { useState } from 'react';
 
import { AsyncStorage } from 'react-native';

import { APP_DATA_KEYS, APP_SMS_TEMPLATE } from "../config/app";

import DeviceInfo from 'react-native-device-info';

export let TemplateHelper =  () => {

    let getTemplate  = async () => {
        console.log("[SMSC][TEMPLATEHELPER] Error retrieving data")
        try {
          console.log("[SMSC][TEMPLATEHELPER] Retrieving data in")
          var value = await AsyncStorage.getItem(APP_DATA_KEYS.SMS_TEMPLATE);
          console.log("[SMSC][TEMPLATEHELPER] Retrieving data out", value)
          const apiLevel = DeviceInfo.getAPILevel();
          try {
            value = JSON.parse(value)
          } catch (error) {
            console.log("[SMSC][TEMPLATEHELPER] Error parsing (API24?, continuing...")
          }
          return value ? value : APP_SMS_TEMPLATE;
        } catch (error) {
          // Error retrieving data
          console.log("Error retrieving data", error)
        }
      }

  return {
    getTemplate: getTemplate
  }
}
