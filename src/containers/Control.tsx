import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet} from 'react-native';
import { Icon } from "react-native-elements";
import { REQUEST_HEADEARS, PAGES, TRANSLATIONS } from "../config/app";
import { NavigationActions, StackActions } from 'react-navigation';
class Control extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

  // componentWillReceiveProps(props){
  //   console.log("CONTROL_componentWillReceiveProps",this.props)
  // }

  setModalVisible(visible) {
    console.log("CONTROL_setModalVisible",this.state)
    if (this.props.stbState.loader) return;
    this.setState({
            visible: visible
        }); 
  }
 
  // componentDidMount(props){
  //   console.log("CONTROL_componentDidMount",this.state)
  // }
  // componentWillUpdate(props){
  //   console.log("CONTROL_componentWillUpdate",this.state)
  // }
  // componentDidUpdate(props){
  //   console.log("CONTROL_componentDidUpdate",this.state)
  // }  
  shouldComponentUpdate(props){
    if (!props.playing) return false;
    console.log("CONTROL_shouldComponentUpdate")
    return true
  }

  render() {  
    return (
        <Modal
          animationType="fade" 
          transparent={true}
          visible={true}
          onRequestClose={() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: PAGES.HOME.name })],
            });
            this.props.navigation.dispatch(resetAction);
          }}>
          <View>
              <TouchableHighlight
                style={[{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width:this.props.stbState.width,
                    height:this.props.stbState.height}]} 
                onPress={() => {
                  // Alert.alert('Modal has been closed 2.');
                  this.setModalVisible(!this.state.visible);
                }}>
                    <Text></Text>
              </TouchableHighlight>

               <TouchableHighlight
                style={[styles.next,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={0.5}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(1)
                }).bind(this)}>
                <Icon name={"navigate-next"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>
 
               <TouchableHighlight
                style={[styles.previous,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={0.5}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(-1)
                }).bind(this)}>
                <Icon name={"navigate-before"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>

               <TouchableHighlight
                style={[styles.refresh,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={0.5}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(0)
                }).bind(this)}>
                <Icon name={"refresh"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>

          </View>
        </Modal>
    );
  }
}

export default Control;
 

const styles = StyleSheet.create({
  icon: {
      color: "white",
      backgroundColor: "black",
      borderRadius: 100,
      fontSize: 25,
      fontWeight:"900"
  },
  refresh: {
      position: "absolute",
      top: 0,
      left: 120,
      backgroundColor: "#FFF",
      borderRadius: 100
  },
  next: {
      position: "absolute",
      top: 0,
      left: 60,
      backgroundColor: "#FFF",
      borderRadius: 100
  },
  previous: {
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "#FFF",
      borderRadius: 100
  }
});
