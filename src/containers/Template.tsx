import React, { FunctionComponent, useState } from 'react';
import ToggleSwitch from 'toggle-switch-react-native'
import { Platform
  , StyleSheet
  , View
  , TextInput
  , Button
  , TouchableOpacity
  , AsyncStorage
  , ToastAndroid
  , ScrollView
  , Text } from 'react-native';

  import { APP_TITLE ,APP_DATA_KEYS, APP_SMS_TEMPLATE, TRANSLATIONS } from "../config/app";
  import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
  import styles from "../config/styles";

export const Template: FunctionComponent = () => { 

    const getTemplate = async (reset=false) => {
      try {
        const value = await AsyncStorage.getItem(APP_DATA_KEYS.SMS_TEMPLATE);
        var finalTemplateObj = {}
        var finalTemplateString = ''
        if (value && !reset) {
          // We have data!!
          finalTemplateObj = JSON.parse(value)
          setTemplate(finalTemplateObj)
          ToastAndroid.show('Loaded template', ToastAndroid.SHORT);
        } else {
          setTemplate(APP_SMS_TEMPLATE)
          finalTemplateObj = APP_SMS_TEMPLATE
          finalTemplateString = JSON.stringify(APP_SMS_TEMPLATE)
          await AsyncStorage.setItem(APP_DATA_KEYS.SMS_TEMPLATE, finalTemplateString);
          ToastAndroid.show('Loaded default template', ToastAndroid.SHORT);
        }
        console.log("[SMSC][TEMPLATE] finalTemplateString", finalTemplateObj, finalTemplateString)
        return finalTemplateObj
      } catch (error) { 
        // Error retrieving data
        console.log("Error getting data", error)
      }
    }

    const [template, setTemplate] = useState( () => {
      getTemplate()
      return {}
    });

    const onSave = async () => {
      if (!template) {
        onReset()
        return;
      }
      try {
        await AsyncStorage.setItem(APP_DATA_KEYS.SMS_TEMPLATE, JSON.stringify(template));
        ToastAndroid.show('Saved!', ToastAndroid.SHORT);
        console.log("[SMSC][TEMPLATE] length", new Blob([template.template]).size)
      } catch (error) {
        // Error saving data
        console.log("Error saving data", error)
      }
    };

    const onReset = async () => {
      getTemplate(true)
    }

    const onUpdate = (newtemplate) => {
      let merged = {...template, ...newtemplate};
      setTemplate(merged)
    }

    return (
        <View style={styles.MainContainer}>

        <ScrollView>

          <View style = {styles.ButtonContainer}>
            <TouchableOpacity style = {styles.ButtonInnerContainerHalfScreen} onPress={onSave}> 
              <Text style = {styles.ActionButton}>
                  Save
              </Text>
            </TouchableOpacity >

            <TouchableOpacity style = {styles.ButtonInnerContainerHalfScreen}  onPress={onReset}> 
              <Text style = {styles.ActionButton}>
                  Reset
              </Text>
            </TouchableOpacity >
          </View>

          <ToggleSwitch
            isOn={!!template.sms}
            onColor='green'
            offColor='red'
            label={TRANSLATIONS.en.template.label_sms}
            labelStyle={{paddingBottom: 5, color: 'black', fontWeight: '900'}}
            size='small'
            onToggle={ (status) => onUpdate({sms:status}) }
          />

          <Text style = {styles.LegendDescription}>
          Activate  SMS intent for multiple attendees.
          </Text>

          <ToggleSwitch
            isOn={!!template.whatsapp}
            onColor='green'
            offColor='red'
            label={TRANSLATIONS.en.template.label_whatsapp}
            labelStyle={{paddingBottom: 5, color: 'black', fontWeight: '900'}}
            size='small'
            onToggle={ (status) => onUpdate({whatsapp:status}) }
          />

          <Text style = {styles.LegendDescription}>
          Activate Whatsapp intent, user will then need to choose which group or contact to send message.
          </Text>

          <Text style = {styles.InputTitle}>
          Template
          </Text>

        <TextInput
            maxLength={160}
            defaultValue={template.template}
            onChangeText={ (text) => onUpdate({template:text}) }
            style={styles.TextInputStyleClass}
            underlineColorAndroid="transparent"
            placeholder={template.template}
            placeholderTextColor={"#9E9E9E"}
            numberOfLines={5}
            multiline={true}
          />

          <Text style = {styles.LegendDescription}>
          {`The above template will be used to parse the ${APP_TITLE} event sent to attendees.`}
          </Text>

          <Text style = {styles.LegendDescription}>
          Template markers:
          </Text>

          <Text style = {styles.LegendTitle}>
          attendees
          </Text>

          <Text style = {styles.LegendText}>
          Name of attendees
          </Text>

          <Text style = {styles.LegendTitle}>
          event
          </Text>

          <Text style = {styles.LegendText}>
          Title of event
          </Text>

          <Text style = {styles.LegendTitle}>
          date
          </Text>

          <Text style = {styles.LegendText}>
          Date of event
          </Text>

          <Text style = {styles.LegendTitle}>
          time
          </Text>

          <Text style = {styles.LegendText}>
          Time of event
          </Text>


          <Text style = {styles.LegendTitle}>
          delta
          </Text>

          <Text style = {styles.LegendText}>
          Time delta until event start date
          </Text>

          <Text style = {styles.LegendTitle}>
          location
          </Text>

          <Text style = {styles.LegendText}>
          Event location
          </Text>

        </ScrollView>
       </View>


    )
  };
  
  export default Template;