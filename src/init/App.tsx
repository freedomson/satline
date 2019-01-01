import React from "react";
import { Image, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";
import Home from './Home';
import Help from '../containers/Help';
import About from '../containers/About';
import Status from '../containers/Status';
import Template from '../containers/Template';
import { DrawerActions } from 'react-navigation-drawer';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { APP_TITLE, APP_SLOGAN, PAGES } from "../config/app";
import { Icon } from 'react-native-elements'
import Shimmer from 'react-native-shimmer';
import styles  from "../config/styles";

const LOCAL_PAGES = {
  [PAGES.HOME.name]: Home,
  [PAGES.TEMPLATE.name]: Template,
  [PAGES.STATUS.name]: Status,
  [PAGES.HELP.name]: Help,
  [PAGES.ABOUT.name]: About
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
  [PAGES.TEMPLATE.name]: {
    screen: LOCAL_PAGES[PAGES.TEMPLATE.name],
    path: `${PAGES.TEMPLATE.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: PAGES.TEMPLATE.name,
      drawerIcon: (
        <Icon
        name={PAGES.TEMPLATE.icon}  />)
    }),
  },
  [PAGES.STATUS.name]: {
    screen: LOCAL_PAGES[PAGES.STATUS.name],
    path: `${PAGES.STATUS.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: PAGES.STATUS.name,
      drawerIcon: (
        <Icon
        // onPress={()=>{navigation.dispatch(DrawerActions.openDrawer())}}
        name={PAGES.STATUS.icon}  />)
    }),
  },
  [PAGES.HELP.name]: {
    screen: LOCAL_PAGES[PAGES.HELP.name],
    path: `${PAGES.HELP.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: PAGES.HELP.name,
      drawerIcon: (
        <Icon
        //onPress={()=>{navigation.dispatch(DrawerActions.openDrawer())}}
        name={PAGES.HELP.icon}  />)
    }),
  },
  [PAGES.ABOUT.name]: {
    screen:  LOCAL_PAGES[PAGES.ABOUT.name],
    path: `${PAGES.ABOUT.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: PAGES.ABOUT.name,
      drawerIcon: (
        <Icon
        //onPress={()=>{navigation.dispatch(DrawerActions.openDrawer())}}
        name={PAGES.ABOUT.icon} />)
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
  [PAGES.HOME.name]: {
    screen: DrawerNavigator,
    path: `${PAGES.HOME.name.toLocaleLowerCase}/:name`,
    navigationOptions: ({ navigation }) => ({
      title: `${(navigation.state.routes[(navigation.state.index)].key)} . ${APP_TITLE}`.toLocaleLowerCase(),
      headerLeftContainerStyle: styles.NavigatorLeftIcon,
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
