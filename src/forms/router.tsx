import React, { useEffect, FunctionComponent, useState } from 'react';
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

    const defaultRouter =  ["192","168","1","1"]

    const onChanged = function(text){
        let nr = [
             router1._lastNativeText || router1._getText()
            ,router2._lastNativeText || router2._getText()
            ,router3._lastNativeText || router3._getText()
            ,router4._lastNativeText || router4._getText()
            ].map((val)=>{return val.replace(/[^0-9]/g, '')}) 
        setRouter(nr)
        router1.setNativeProps({text: nr[0]})
        router2.setNativeProps({text: nr[1]})
        router3.setNativeProps({text: nr[2]})
        router4.setNativeProps({text: nr[3]})
    }

    const getRouter = async (reset=false) => {
      try {
        let router = await AsyncStorage.getItem(APP_DATA_KEYS.ROUTER);
        let r = JSON.parse(router)
        console.log("setting router mem", r)
         r ? setRouter(r) : setRouter(defaultRouter)
      } catch (error) { 
        // Error retrieving data
         console.log("setting router def",defaultRouter)
         setRouter(defaultRouter)
         return
      }
    }
  
    const [router, setRouter] = useState(async ()=>{
        let r = await getRouter() 
        return r
    }); 

    const onSearch = async () => {  
        props.scanner.scan(router.join("."))
        await AsyncStorage.setItem(APP_DATA_KEYS.ROUTER, JSON.stringify(router));
    };

    return (
        <View>
            <Text style={styles.formTitle}>Router IP</Text>
            {router && <View style={styles.ButtonContainer}>
                <TextInput style={styles.ButtonRouter}
                ref={r => router1 = r}
                onEndEditing={onChanged.bind(this)}
                keyboardType={"number-pad"}
                defaultValue={router[0]}
                editable={true}
                maxLength={3}
                />
                <TextInput style={styles.ButtonRouter}
                ref={r => router2 = r}
                onEndEditing={onChanged.bind(this)}
                keyboardType={"number-pad"}
                defaultValue={router[1]}
                editable={true}
                maxLength={3}
                /> 
                <TextInput style={styles.ButtonRouter}
                ref={r => router3 = r}
                onEndEditing={onChanged.bind(this)}
                keyboardType={"number-pad"}
                defaultValue={router[2]}
                editable={true}
                maxLength={3}
                />  
                <TextInput style={styles.ButtonRouter}
                ref={r => router4 = r}
                onEndEditing={onChanged.bind(this)}
                keyboardType={"number-pad"}
                defaultValue={router[3]} 
                editable={true}
                maxLength={3} 
                />
              <TouchableOpacity
                style={styles.ButtonAction}
                onPress={ (()=>{
                  onSearch() 
              })}>
                <Icon name={"search"} raised={false} reverse={false} iconStyle={[styles.ButtonIcon]} />
              </ TouchableOpacity >
            </View>}
       </View>


    )
  };
  
  export default Router;