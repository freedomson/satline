
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Linking, ScrollView, View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import Table from 'react-native-simple-table'
import { DEVICE_WIDTH } from "../config/metrics";
import { Icon } from "react-native-elements";
import { PAGES } from "../config/app"; 
import { APP_DATA_KEYS, REQUEST_OBJ, TRANSLATIONS} from "../config/app";
import {Loader} from '../containers/Loader';
 
const columns = [
  { 
    title: 'IP',
    dataIndex: 'ipcell1',
    width: DEVICE_WIDTH/3
  },
  { 
    title: 'PORTAL',
    dataIndex: 'ipcell2',
    width: DEVICE_WIDTH/3
  },
  {
    title: 'PLAYER',
    dataIndex: 'channels',
    width: DEVICE_WIDTH/3
  }
];

export const Stbs: FunctionComponent = (props) => {  
 
    const [data, setData] = useState( async () => {
            console.log("useState STBS")
            if (props.datasource===false) {
              let data = await AsyncStorage.getItem(APP_DATA_KEYS.STBS);
              let stbs = JSON.parse(data) 
              if (stbs){
                console.log("STBS from meme",stbs)
                setData(stbs)
                return
              }
            } else {
              setData(props.datasource)
              return
            }
         }
  );

  useEffect(() => {
    if (props.datasource !==false) { 
      // TODO: Activate when controls available
      // if ( props.datasource.length == 1 ) { 
      //   console.log("STBS upgrade datasource", props.datasource[0]['ipcell1']) 
      //   openPlayer(props.datasource[0]['ipcell1'])
      // }
      setData(props.datasource)
    } 
  },[props.datasource]); 

  const [loading, setLoading] = useState(false)

  let apiCall = async (url) =>
  {
      let response = await fetch(url, REQUEST_OBJ);
      let data = await response.text()
      return {
          response,
          data
      }
  }

  let openPlayer = async function(channels) {
    setLoading(true)
    let status_code_success = 200
    let start = await apiCall(`http://${channels.ip}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D`)
    let stateResp = await apiCall(`http://${channels.ip}:8800/GET%20MEDIA%20STATUS%20tv`)
    if (stateResp && stateResp.response.status == status_code_success)
    {
        let data = stateResp.data.split(/\d\d\d\s/) 
        let status = parseInt(stateResp.data.substr(0,3))
        let config = data[1] && JSON.parse(data[1]) 
        if ( status == status_code_success && config ) {
          await apiCall(`http://${channels.ip}:8800/SET%20CHANNEL%20${config.progNo}%201%200%20`)
          props.navigation.navigate(PAGES.STB.name, 
            {
              ip: channels.ip,
              channels: channels
            })
        } else {
          props.navigation.navigate(PAGES.HOME.name, {
              toastMessage: TRANSLATIONS.en.home.streamError
          })
        }
    } else {
      props.navigation.navigate(PAGES.HOME.name, {
          toastMessage: TRANSLATIONS.en.home.streamError
      })
    }
    setLoading(false)
  }

  let renderCell = function (cellData, col) {
    let style = {width: col.width || this.props.columnWidth};
    let data = <Text>{cellData}</Text> 
    switch (col.title) {

        case 'PORTAL': 
            data =   
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={ async ()=>{
                  Linking.openURL(`http://${cellData}:8800`); 
              }}>
              <Icon
                name={"web"}
                raised={true}
                reverse={true}
                iconStyle={[styles.icon_med]} />
              </ TouchableOpacity >
            </View>
            break;  

        case 'PLAYER': 
            data =  
            <View style={{ flexDirection: 'row' }}> 
              <TouchableOpacity  onPress={ async ()=>{ openPlayer(cellData); }}>
              <Icon 
                name={PAGES.STB.icon}
                raised={true} 
                reverse={true}
                iconStyle={[styles.icon_med]} />
              </ TouchableOpacity >
            </View>
            break;  
    } 
    
    return (
      <View key={col.dataIndex} style={[styles.cell, styles.dataViewContent, style]}>
        {data}
      </View> 
    )
  }

  return ( 
     Array.isArray(data) && data.length > 0 && 
     <View>
        <Loader loader={loading}></Loader>
        <ScrollView>
          <View style={styles.container}>
            <Table renderCell={renderCell} height={320} columnWidth={60} columns={columns} dataSource={data} />
          </View> 
        </ScrollView>
      </View>) 
};

const styles = StyleSheet.create({
  icon_med: {
    width: 35,
    height: 35,
    fontSize: 35,
    textAlign: "center"
  },
  container: {
  },
  contentContainer: {
    height: 240
  },
  header: {
    flexDirection: 'row',
  },
  headerItem: {
    minHeight: 30, 
    backgroundColor: '#efefef',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 45,
    fontWeight: 'bold',
  },
  dataView: {
    flexGrow: 1,
  },
  dataViewContent: {
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  cell: {
    minHeight: 25,
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: '#dfdfdf',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  }
});
