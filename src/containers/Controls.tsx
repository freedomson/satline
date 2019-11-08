import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet} from 'react-native';
import { Icon } from "react-native-elements";

class Controls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
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

  render() {  
    return (
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
                onPress={() => {
                  Alert.alert('Change channel');
                }}>
                <Icon name={"navigate-next"} raised={true} reverse={true}} />
              </TouchableHighlight> 
 
               <TouchableHighlight
                style={[styles.previous,{opacity: this.state.visible ? 1 : 0}]} 
                onPress={() => {
                  Alert.alert('Change channel');
                }}>
                <Icon name={"navigate-before"} raised={true} reverse={true}} />
              </TouchableHighlight>

          </View>
    );
  }
}

export default Controls;
 

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
