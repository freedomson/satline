
import Contacts from 'react-native-contacts';
import {
  PermissionsAndroid,
  BackHandler,
  View, Text, Alert
} from 'react-native';
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { AUTHORIZATION_DENIED, AUTHORIZATION_GRANTED } from "../config/app";

export let useAuthorizations =  () => {

  const statusDenied = AUTHORIZATION_DENIED;
  const statusAuthorized = AUTHORIZATION_GRANTED;

  const [status, setStatus] = useState(statusDenied)

  async function requestPermission(checkPermission) {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR]
      );
      console.log(granted)
      checkPermission()
        
    } catch (err) {
      console.warn(err);
    }
  }

  async function checkPermission() {
    try {
      const hasContactRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      const hasCalendarRead = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CALENDAR);
      let isAuthorized = hasContactRead && hasCalendarRead

      if(!isAuthorized){
        Alert.alert(
          'Missing authorizations',
          'Please ensure you give all necessary permissions and reload app!',
          [
            {
              text: 'Ask me later', 
              onPress: () => {
                console.log('Ask me later pressed')
                setStatus(statusDenied)
              }
            },
            {
              text: 'Cancel',
              onPress: () => {
                console.log('Cancel Pressed')
                setStatus(statusDenied)
              },
              style: 'cancel',
            },
            {
              text: 'OK', 
              onPress: () => {
                console.log('OK Pressed')
                setStatus(statusDenied)
              }
            }
          ],
          {cancelable: false},
        );
      } else {
        setStatus(statusAuthorized)
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(()=>{
    if (AUTHORIZATION_GRANTED === status) {
      console.log(`Authorization is granted (noop), status ${status}`);
      return;
    } else {
      console.log(`Requesting authorization, status ${status}`)
      requestPermission(checkPermission)
    }
  },[status])

  return status
}
