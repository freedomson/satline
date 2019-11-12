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
  // shouldComponentUpdate(props){
  //   console.log("CONTROL_shouldComponentUpdate",this.state)
  //   return true
  // }

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
                  this.props.cb(true)
                }).bind(this)}>
                <Icon name={"navigate-next"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>
 
               <TouchableHighlight
                style={[styles.previous,{opacity: this.state.visible ? 1 : 0}]} 
                activeOpacity={0.5}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(false)
                }).bind(this)}>
                <Icon name={"navigate-before"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
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
