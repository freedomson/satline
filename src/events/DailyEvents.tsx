
import React, { FunctionComponent } from "react";
import { AsyncStorage } from "react-native";
import { APP_DATA_KEYS } from "../config/app";
import date from 'date-and-time';

export const DailyEvents: FunctionComponent = () => {

    const save = async (profile:Object,calendarevents:Function) => {
        console.log("[SMSC][DAILYMESSAGES] save",profile)
        try {
          let today = date.format(new Date(), 'YYYY.MM.DD')
          let dailyMessages = {[today]:{[profile.eventid]:profile}}
          let storedDailyMessages = await AsyncStorage.getItem(APP_DATA_KEYS.DAILY_MESSAGES);
          storedDailyMessages = JSON.parse(storedDailyMessages)
          if (storedDailyMessages && storedDailyMessages[today]) {
            eventkeys=Object.keys(storedDailyMessages[today])
            eventkeys.map((e)=>{
              if (typeof dailyMessages[today][e] == undefined )
              dailyMessages[today][e] = storedDailyMessages[today][e]
              //console.log("[SMSC][SAVE] get", dailyMessages[today][e])
            })
          } 
          await AsyncStorage.setItem(APP_DATA_KEYS.DAILY_MESSAGES, JSON.stringify(dailyMessages));
          
          calendarevents.getEvents(profile.eventid)
          
          return dailyMessages[today];

        } catch (error) {
          // Error saving data
          console.log("Error saving daily messages", error)
        }
      };

      const get = async () => {
        try {
          let today = date.format(new Date(), 'YYYY.MM.DD')
          let dailyMessages = []
          let storedDailyMessages = await AsyncStorage.getItem(APP_DATA_KEYS.DAILY_MESSAGES);
          storedDailyMessages = JSON.parse(storedDailyMessages)
          let key = 0
          console.log("[SMSC][DAILYMESSAGES] get",storedDailyMessages)
          if (storedDailyMessages && storedDailyMessages[today]) {
            eventkeys=Object.keys(storedDailyMessages[today])
            eventkeys.map((e)=>{
                let k = e+''
                let p = storedDailyMessages[today][k]
                p.key = p.eventid
                dailyMessages.push(p)
                return e;
            })
          }
          // console.log("[SMSC][DAILYMESSAGES] final", dailyMessages)
          return dailyMessages
        } catch (error) {
          // Error saving data
          console.log("Error saving daily messages", error)
        }
      };

      return {
        save: save,
        get: get
      }

};

export default DailyEvents;