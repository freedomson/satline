import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet} from 'react-native';
import { Icon } from "react-native-elements";
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
            this.props.goBack()
          }}>
          <View
            style={[styles.common]} >
              <TouchableHighlight
                style={[{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width:this.props.stbState.width,
                    height:this.props.stbState.height}]} 
                onPress={() => {
                  this.setModalVisible(!this.state.visible);
                }}>
                    <Text></Text>
              </TouchableHighlight>

               <TouchableHighlight
                style={[styles.common,styles.next,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={1}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(1)
                }).bind(this)}>
                <Icon name={"navigate-next"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>
 
               <TouchableHighlight
                style={[styles.common,styles.previous,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={1}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(-1)
                }).bind(this)}>
                <Icon name={"navigate-before"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>

               <TouchableHighlight
                style={[styles.common,styles.refresh,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={1}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(0)
                }).bind(this)}>
                <Icon name={"refresh"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>

              <Text
              style={[styles.common,styles.channelName,{
                width:this.props.stbState.width,
                opacity: this.state.visible ? 1 : 0}]} 
              >{this.props.currentChannel.channelName}</Text>

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
      fontSize: 25,
      fontWeight:"900"
  },
  common: {
    opacity: 1
  },
  channelName: {
      position: "absolute",
      top: 0,
      color: "white",
      backgroundColor: "black",
      borderRadius: 0,
      padding: 5,
      fontSize: 25,
      fontWeight:"900",
      borderBottomWidth: 2,
      borderBottomColor: "#FFF"
  },
  refresh: {
      position: "absolute",
      top: 45,
      left: 130,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  },
  next: {
      position: "absolute",
      top: 45,
      left: 70,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  },
  previous: {
      position: "absolute",
      top: 45,
      left: 10,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  }
});
