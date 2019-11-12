import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, ToastAndroid, StyleSheet} from 'react-native';
import { Icon } from "react-native-elements";
import Api from '../server/Api';
import { PAGES } from "../config/app"; 
class Control extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

  componentWillReceiveProps(props){
    console.log("CONTROL_componentWillReceiveProps",this.props)
  }

  setModalVisible(visible) {
    console.log("CONTROL_setModalVisible",this.state)
    this.setState({
            visible: visible
        }); 
  }
 
  componentDidMount(props){
    console.log("CONTROL_componentDidMount",this.state)
  }
  componentWillUpdate(props){
    console.log("CONTROL_componentWillUpdate",this.state)
  }
  componentDidUpdate(props){
    console.log("CONTROL_componentDidUpdate",this.state)
  }  
  shouldComponentUpdate(props){
    console.log("CONTROL_shouldComponentUpdate",this.state)
    return true
  }

  loadStream(setup){
      console.log("Control",setup)
      timeout= 500
      // setTimeout(() => {
      //   this.props.navigation.navigate(PAGES.STB.name, 
      //   {
      //     stream: "",
      //     ip: this.props.ip,
      //     channels: setup.channels
      //   })
      // }, 0);
      setTimeout(() => {
        this.props.navigation.navigate(PAGES.STB.name, 
        {
          stream: setup.url,
          ip: this.props.ip,
          channels: setup.channels
        })
      }, timeout);

  }

  render() {  
    return (
        <Modal
          animationType="none" 
          transparent={true}
          visible={true}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            // this.setModalVisible(false);
            this.props.navigation.goBack();
          }}>
          <View>
              <TouchableHighlight
                style={[{
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
                activeOpacity={0}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.stbStateFunction({ 
                      ...this.props.stbState, 
                      stream: "",
                      loader: true
                  }) 
                  let setup = await Api.playNext(this.props.ip,this.props.channels)
                  this.loadStream(setup)
                }).bind(this)}>
                <Icon name={"navigate-next"} raised={true} reverse={true} />
              </TouchableHighlight>
 
               <TouchableHighlight
                style={[styles.previous,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={0}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.stbStateFunction({ 
                      ...this.props.stbState, 
                      stream: "",
                      loader: true
                  }) 
                  let setup = await Api.playPrevious(this.props.ip,this.props.channels)
                  this.loadStream(setup)
                }).bind(this)}>
                <Icon name={"navigate-before"} raised={true} reverse={true} />
              </TouchableHighlight>

          </View>
        </Modal>
    );
  }
}

export default Control;
 

const styles = StyleSheet.create({
  next: {
      position: "absolute",
      top: 0,
      left: 60
  },
  previous: {
      position: "absolute",
      top: 0,
      left: 0
  }
});
