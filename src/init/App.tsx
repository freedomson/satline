import React from "react";
import { Image, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";
import Home from './Home';
import { DrawerActions } from 'react-navigation-drawer';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
import { Icon } from 'react-native-elements'
import Shimmer from 'react-native-shimmer';
import styles  from "../config/styles";

import Stb from '../pages/stb';

const LOCAL_PAGES = {
  [PAGES.HOME.name]: Home,
  [PAGES.STB.name]: Stb
}


const CustomDrawerContentComponent = (props:any) => (
  <ScrollView>
    <SafeAreaView style={styles.MainContainer} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
    <Shimmer style={styles.Branding} direction={"up"} duration={500}>
        <Text style={styles.Lettering}>{APP_SLOGAN}</Text>
    </Shimmer>
  </ScrollView>
);

const DrawerNavigator = createDrawerNavigator({
  [PAGES.HOME.name]: {
    screen: LOCAL_PAGES[PAGES.HOME.name],
    path: `${PAGES.HOME.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: APP_TITLE,
      drawerIcon: (
        <Image
          style={{width: 50, height: 50}}
          source={require("../../icon.png")}
        />
      )
    }),
  },
  [PAGES.STB.name]: {
    lazy: false,
    screen:  LOCAL_PAGES[PAGES.STB.name],
    path: `${PAGES.STB.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: PAGES.STB.name,
      drawerIcon: (
        <Icon
        //onPress={()=>{navigation.dispatch(DrawerActions.openDrawer())}}
        name={PAGES.STB.icon} />)
    }),
  }
}, {  
  drawerBackgroundColor: "#D4EEC7",
  contentComponent: CustomDrawerContentComponent,
  initialRouteName: PAGES.HOME.name,
  contentOptions: {
    activeTintColor: '#e91e63',
  }
});
const StackNavigator = createStackNavigator({
  [PAGES.STB.name]: {
    screen: DrawerNavigator,
    path: `${PAGES.HOME.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: `${(navigation.state.routes[(navigation.state.index)].key)} . ${APP_TITLE}`.toLocaleLowerCase(),
      headerLeftContainerStyle: styles.NavigatorLeftIcon,
      header: null,
      headerLeft: ( 
        <Icon
        size={36}
        onPress={()=>{console.log(navigation);navigation.dispatch(DrawerActions.toggleDrawer())}}
        name={PAGES.HOME.icon} />
      ),
    }),
  }
});

export default createAppContainer(StackNavigator);
