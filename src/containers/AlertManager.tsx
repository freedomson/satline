import {
  Linking, ToastAndroid
} from 'react-native';
import React, { useEffect } from 'react'
import {TemplateHelper} from "./TemplateHelper"
import {useReminder} from "./useReminder"
import { APP_ANDROID_MAP, APP_DATA_KEYS } from "../config/app";
import date from 'date-and-time';
import {DailyEvents} from "../events/DailyEvents"
var SmsAndroid = require('react-native-sms-android');
import email from 'react-native-email'
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

export let AlertManager = (calendarevents) => {

  let templateHelper  = TemplateHelper()
  let dailyEvents = DailyEvents()

  var parseMessageTemplate = (profile) => {
    profile.delta =  moment( profile.datedelta, "YYYY.MM.DD.HH:mm").fromNow()
    var finalMessage = profile.envelope.template.replace(/{{(.*?)}}/g, (_, n) => {return profile[n]})
    // ToastAndroid.show(finalMessage, ToastAndroid.SHORT);
    profile.msg = finalMessage
    return profile;
  }

  var sendToEmail = (profile) => {
    const to = profile.emails.split(',') // string or array of email addresses
    profile
    email(to, {
        // Optional additional arguments
        // cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        // bcc: 'mee@mee.com', // string or array of email addresses
        subject: profile.event,
        body: profile.msg
    }).catch(console.error)
}

  var sendToWA = (profile) => {
    profile = parseMessageTemplate(profile)
    try {
      profile.icon = 'person'
      Linking.openURL(`whatsapp://send?text=${profile.msg}`)
      .then(()=>{
        dailyEvents.save(profile,calendarevents)
      })
      .catch(() =>{
        ToastAndroid.show('The Whatsapp app was not found!', ToastAndroid.SHORT);
      } );
      
    } catch(e){
      profile.status = false
      profile.icon = "error"
      ToastAndroid.show('Error  opening Whatsapp!', ToastAndroid.SHORT);
    }
    
  }
  
  var sendToSMS = (profile) => {
    profile = parseMessageTemplate(profile)
    let msgsize = new Blob([profile.msg]).size
    SmsAndroid.sms(
      profile.numbers, // phone number to send sms to
      profile.msg, // sms body
      'sendIndirect', // sendDirect or sendIndirect
      (err, message) => {
        if (err){
          profile.status = false
          profile.icon = "error"
          ToastAndroid.show('SMS not found!', ToastAndroid.SHORT);
          console.log("error sms");
        } else {
          console.log('[SMSC][ALERTMANAGER] Sent:' + message, msgsize); // callback message
        }
        dailyEvents.save(profile,calendarevents)
      })
  }

  let processAlerts = async (events) => {
    console.log('[SMSC][ALERTMANAGER] Template' )
    var envelope = await templateHelper.getTemplate().catch((err)=>{
      console.log('[SMSC][ALERTMANAGER] Error Template',err)
    })
    console.log('[SMSC][ALERTMANAGER] Start parse', envelope)
    // envelope = JSON.parse(envelope)
    console.log('[SMSC][ALERTMANAGER] End parse')
    console.log('[SMSC][ALERTMANAGER] Total:' + events.length, events, {tester:"value"} , envelope)
    events.forEach(event => {
        if (
            typeof event.attendees == undefined 
            || !event.attendees.length
            ) return;
        
        let contactnames = []
        let contactemails = []
        let contactnumbers = []
        event.attendees.forEach(attendee => {
            if (
                attendee.relationship !== '1' // Attendee
                || typeof attendee.contacts == undefined
                ) return;
                attendee.contacts.forEach(contact=>{
                  contactnames.push(contact.name)
                  contactnumbers.push(contact.number)
                })
                contactemails.push(attendee.email)
        });
        let startdate = new Date(event.startDate)
        var datedelta = `${date.format(startdate, 'YYYY.MM.DD')}${date.format(startdate, 'HH:mm')}`
        let profile = {
          status:     true,
          eventid:    event.id,
          senddate:   date.format(new Date, 'YYYY.MM.DD'),
          sendtime:   date.format(new Date, 'HH:mm'),
          event:      event.title,
          date:       date.format(startdate, 'YYYY.MM.DD'),
          time:       date.format(startdate, 'HH:mm'),
          delta:      'Unset',
          datedelta:  datedelta,
          attendees:  contactnames.join(', '),
          numbers:    contactnumbers.join(','),
          emails:     contactemails.join(','),
          location:   !!event.location ? (APP_ANDROID_MAP + encodeURIComponent(event.location)) : '',
          location_string: event.location,
          msg:  '',
          envelope: envelope,
          sendToWA: sendToWA,
          sendToSMS: sendToSMS
        };

        if (envelope.whatsapp) sendToWA(profile)
        if (envelope.sms) sendToSMS(profile)

        dailyEvents.save(profile,calendarevents)

    });
  }

  const reminder = useReminder([processAlerts])
  
  return {sendToWA: sendToWA,sendToSMS: sendToSMS, sendToEmail: sendToEmail}
}
