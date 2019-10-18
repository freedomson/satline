
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Linking, ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Table from 'react-native-simple-table'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import { Icon } from "react-native-elements";
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
 
const columns = [
  { 
    title: 'Box IP address',
    dataIndex: 'ipcell1',
    width: DEVICE_WIDTH/3
  },
  {
    title: 'Portal',
    dataIndex: 'ipcell2',
    width: DEVICE_WIDTH/3
  },
  {
    title: 'Player',
    dataIndex: 'ipcell3',
    width: DEVICE_WIDTH/3
  }
];

export const Stbs: FunctionComponent = (props) => {  

  const [datasource, setDatasource] = useState(props.datasource);

  useEffect(() => {
    setDatasource(props.datasource)
  });

  let apiCall = async (url) =>
  {
      let response = await fetch(url,{
                mode: 'same-origin', // no-cors, *cors, same-origin
                cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-GB,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Connection': 'keep-alive',
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
      let data = await response.text()
      return {
          response,
          data
      }
  }

  let renderCell = function (cellData, col) {
    let style = {width: col.width || this.props.columnWidth};
    let data = <Text>{cellData}</Text> 
    switch (col.title) {

        case 'Portal': 
            data =   
            <View style={{ flexDirection: 'row' }}> 
              <TouchableOpacity onPress={ async ()=>{
                  Linking.openURL(`http://${cellData}:8800`); 
              }}>
              <Icon name={"web"} raised={false} reverse={false} iconStyle={[styles.icon_med]} />
              </ TouchableOpacity >
            </View>
            break;  

        case 'Player': 
            data =  
            <View style={{ flexDirection: 'row' }}> 
              <TouchableOpacity  onPress={ async ()=>{
                      let status_code_success = 200
                       let start = await apiCall(`http://${cellData}:8800/SET%20STB%20MEDIA%20CTRL%20%7B%22type%22%3A%22tv%22%2C%22action%22%3A%22start%20query%20status%22%7D`)
                      let stateResp = await apiCall(`http://${cellData}:8800/GET%20MEDIA%20STATUS%20tv`)
                      if (stateResp && stateResp.response.status == status_code_success)
                      {
                          let data = stateResp.data.split(/\d\d\d\s/) 
                          let status = parseInt(stateResp.data.substr(0,3))
                          let config = data[1] && JSON.parse(data[1]) 
                          if ( status == status_code_success && config ) {
                            props.navigation.navigate(PAGES.STB.name, 
                              {
                                stream: `http://${cellData}:8802/${config.progNo}.ts`
                              })
                          } else {

                          }
                      } 
              }}>
              <Icon name={PAGES.STB.icon} raised={false} reverse={false} iconStyle={[styles.icon_med]} />
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
     <View >
        <ScrollView>
          <View style={styles.container}>
            <Table renderCell={renderCell} height={320} columnWidth={60} columns={columns} dataSource={datasource} />
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
