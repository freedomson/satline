
import React, {  FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Linking, ScrollView, View, Text, ImageBackground } from "react-native";
import Table from 'react-native-simple-table'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import stylesCommon from "../config/styles";
import { Icon } from "react-native-elements";
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";
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
    dataIndex: 'copy',
    width: DEVICE_WIDTH/3
  }
];


export const Stbs: FunctionComponent = (props) => {  

  let renderCell = function (cellData, col) {
    let style = {width: col.width || this.props.columnWidth};
    let data = <Text>{cellData}</Text> 
    switch (col.title) {
        case 'NAVIGATE':
            data =  <TouchableOpacity style = {stylesCommon.ButtonInnerContainerHalfScreen} onPress={()=>{
                props.navigation.navigate(PAGES.STB.name, {
                    data: cellData
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
     <View style={styles.MainContainer}>
    <ScrollView>
      <View style={styles.container}>
        <Table renderCell={renderCell} height={320} columnWidth={60} columns={columns} dataSource={props.datasource} />
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

export default Stbs;