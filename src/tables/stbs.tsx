
import React, { FunctionComponent, useEffect, useState, useLayoutEffect  } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Linking, ScrollView, View, Text, ImageBackground } from "react-native";
import Table from 'react-native-simple-table'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import stylesCommon from "../config/styles";
import { Icon } from "react-native-elements";
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
// import STB from "../pages/stb";
 
const columns = [
  {
    title: 'STB',
    dataIndex: 'ip',
    width: DEVICE_WIDTH/3
  },
  {
    title: 'CHANNEL',
    dataIndex: 'progNo',
    width: DEVICE_WIDTH/3
  },
  {
    title: 'NAVIGATE',
    dataIndex: 'clone',
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
        case 'NAVIGATE': 
            data =  <TouchableOpacity style = {stylesCommon.ButtonInnerContainerHalfScreen} onPress={ async ()=>{
                let startResp = await apiCall(`http://${cellData.ip}:8800/SET%20CHANNEL%20${cellData.progNo}%201%200%20`)
                console.log("STBS_LIST", startResp) 
                props.navigation.navigate(PAGES.STB.name, {
                    stream: `http://${cellData.ip}:8802/${cellData.progNo}.ts`
                })
            }}>  
                <Icon name={PAGES.STB.icon}  /> 
            </ TouchableOpacity >
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
               <STB />
        <ScrollView>
          <View style={styles.container}>
            <Table renderCell={renderCell} height={320} columnWidth={60} columns={columns} dataSource={datasource} />
          </View> 
        </ScrollView>
      </View>) 
};

const styles = StyleSheet.create({
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
    justifyContent: 'center'
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
    justifyContent: 'center'
  }
});
