import React, { FunctionComponent, useState } from 'react';
import { Platform
  , StyleSheet
  , View
  , TextInput
  , TouchableOpacity
  , Button
  , AsyncStorage
  , Text } from 'react-native';

import { APP_DATA_KEYS, TRANSLATIONS } from "../config/app";
import styles from "../config/styles";
import { Icon } from "react-native-elements";

export const Router: FunctionComponent = (props) => { 

    const getRouter = async (reset=false) => {
      try {
        const router1 = await AsyncStorage.getItem(APP_DATA_KEYS.ROUTER1);
        const router2 = await AsyncStorage.getItem(APP_DATA_KEYS.ROUTER2);
        const router3 = await AsyncStorage.getItem(APP_DATA_KEYS.ROUTER3);
        const router4 = await AsyncStorage.getItem(APP_DATA_KEYS.ROUTER4);
        return {
            router1,router2,router3,router4
        }
      } catch (error) { 
        // Error retrieving data
        console.log("Error getting data", error)
      }
    }

    const [template, setTemplate] = useState( () => {
      return getRouter()
    });

    const onSave = async () => {
        this.props.scanner.scan()
    //   if (!template) {
    //     onReset()
    //     return;
    //   }
    //   try {
    //     await AsyncStorage.setItem(APP_DATA_KEYS.SMS_TEMPLATE, JSON.stringify(template));
    //     ToastAndroid.show('Saved!', ToastAndroid.SHORT);
    //     console.log("[SMSC][TEMPLATE] length", new Blob([template.template]).size)
    //   } catch (error) {
    //     // Error saving data
    //     console.log("Error saving data", error)
    //   }
    };

    return (
        <View>
            <Text style={styles.formTitle}>Router IP</Text>
            <View style={styles.ButtonContainer}>
                <TextInput style={styles.ButtonRouter}
                value={"192"}
                editable
                maxLength={40}
                />
                <TextInput style={styles.ButtonRouter}
                value={"168"}
                editable
                maxLength={40}
                />
                <TextInput style={styles.ButtonRouter}
                value={"1"}
                editable
                maxLength={40}
                />
                <TextInput style={styles.ButtonRouter}
                value={"1"}
                editable
                maxLength={40}
                />
              <TouchableOpacity
                style={styles.ButtonAction}
                onPress={ (()=>{ 
                  props.scanner.scan()
              })}>
                <Icon name={"search"} raised={false} reverse={false} iconStyle={[styles.ButtonIcon]} />
              </ TouchableOpacity >
            </View>
       </View>


    )
  };
  
  export default Router;