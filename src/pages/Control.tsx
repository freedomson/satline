import React, {Component} from 'react';
import { Text, Modal, View, TouchableHighlight, StyleSheet, FlatList} from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import Interstitial from '../containers/Interstitial';
// @refresh reset
class Control extends Component {
    constructor(props) {
        super(props);
        this.flatListRef = React.createRef()
        this.state = {
            visible: true,
            search: "",
            channels: props.channels.channels,
            height: props.getDimensions().height,
            width: props.getDimensions().width,
            selectedIdx: props.channels.currentChannel.idx
        };
    }

  UNSAFE_componentWillReceiveProps(props){
    this.setState({
      ...this.state,
      search: ""
    }); 
    // console.log("CONTROL_shouldComponentUpdate Receive")
    setTimeout((() => {
            this.scrollToIndex(props, true);
    }).bind(this),100);
    return true
  }

  scrollToIndex = (props, force=false) => {

    const selected = props.channels.channels.filter(item => {
      const itemData = `${item.channelName.toUpperCase()}${item.progNo}${item.channelNo}`;
      const needle = `${props.channels.currentChannel.channelName.toUpperCase()}${props.channels.currentChannel.progNo}${props.channels.currentChannel.channelNo}`;
      return itemData.indexOf(needle) > -1;
    });

    let cidx = props.channels.channels.indexOf(selected[0])
    // console.log("CONTROL_shouldComponentUpdate Scrolling",cidx,this.state.selectedIdx)
    if (this.state.selectedIdx != cidx || force ){
      // console.log("CONTROL_Scrolling LEVEL 1")
      if (this.flatListRef || force) {
        // console.log("CONTROL_Scrolling LEVEL 2")
        this.setState({
          ...this.state,
          channels: (this.state.search ? this.searchFilterFunction(this.state.search): props.channels.channels),
          selectedIdx: cidx
        });  
        try { 
          // console.log("CONTROL_Scrolling LEVEL 3")
          this.flatListRef.scrollToIndex({
            animated: true,
            index: cidx,
            viewOffset: 0,
            viewPosition: 0
          })
        } catch (error) {
          // console.log("CONTROL_scrollToindex ERROR")
        }
      }
    }
  }

  renderListSeparator = () => {
    return (
      <View
        style={[
          styles.listseparator,
          {
            width:this.state.width
          }
        ]}
      />
    );
  };

  searchFilterFunction = text => {
    const newData = this.props.channels.channels.filter(item => {
      const itemData = `${item.channelName.toUpperCase()} ${item.epgSearch.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    this.setState({
      ...this.state,
      search: text,
      channels: newData
    }); 
    return newData
  };


  render() {
    return (
         <Modal
          animationType="none" 
          transparent={true}
          visible={true}
          onRequestClose={() => {
            this.props.goBack()
          }}>
          <View
            style={[styles.common,
                    {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    width:this.state.width,
                    height:this.state.height,
                    backgroundColor: "transparent"
                    }
            ]} >

              <TouchableHighlight
                style={[{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width:this.state.width,
                    height:this.state.height}]}>
                <Text />
              </TouchableHighlight>

                { this.state.visible &&
                  <Text
                    style={[
                      styles.common,styles.channelName]}>
                      {this.props.channels.currentChannel.channelName}</Text>
                }

            { this.state.visible &&
            <View
              style={[styles.listcontainer,
                {
                  width:this.state.width,
                  height:this.state.height-50
                }]}
            />
            } 

            { this.state.visible &&
            <View
              style={[styles.listSearch,
              {
                width: this.state.width/2
              }
              ]}>
              <SearchBar style={
                  [
                    styles.listSearchBar,
                    {
                      width: this.state.width/2-40
                    }
                  ]
                }
                value={this.state.search}
                containerStyle ={{backgroundColor:"black"}}
                inputContainerStyle = {{padding:0}}
                inputStyle = {{ fontSize:14, height:20, lineHeight:20, padding:0, margin:0 }}
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false} 
                />
            </View>
            }

            { this.state.visible && 
            <FlatList
              initialScrollIndex = {this.state.selectedIdx}
              ref={(ref) => { this.flatListRef = ref; }}
              ItemSeparatorComponent={this.renderListSeparator}
              style={[styles.list,
              {
                width:this.state.width,
                height:this.state.height-60
              }
              ]}
              data={this.state.channels}
              keyExtractor={(item: object, index: number) => item.channelNo}
              getItemLayout={(data, index) => (
                {length: 40, offset: 40 * index, index}
              )}
              renderItem={({item, index, separators}) => {
                return (
                <TouchableHighlight
                  onPress={() =>this.props.cb(item)}
                  underlayColor={"#FFF"}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <View style={[styles.listitem,{backgroundColor:(this.state.selectedIdx==index)?"#CCC":"transparent"}]}>
                    <Text style={[styles.listitemtexttitle]}>{String(index).padStart(4, '0')} | {item.channelName}</Text>
                    <Text style={[styles.listitemtextdesc]}>{item.epgName}</Text>
                  </View>
                </TouchableHighlight>)
              }}
            />
            }
 
          </View>
          <Interstitial />
        </Modal>
    );
  }
}

export default Control;
 

const styles = StyleSheet.create({
  listSearch: {
    position: "absolute",
    top: 0,
    right:0,
    height: 50,
    backgroundColor: "transparent",
    padding: 0,
    margin: 0
  },
  listSearchBar: {
    position: "absolute",
    top: 0,
    right:0,
    backgroundColor: "#FFF",
    padding: 0,
    margin: 0
  },
  listseparator: {
    height: 1,
    backgroundColor: "#CED0CE",
    marginLeft: 0,
    marginRight: 0
  },
  listitem: {
      backgroundColor: 'transparent',
      opacity: 1,
      height: 40
  },
  listitemtexttitle: {
      opacity: 1,
      fontSize: 12,
      fontWeight:"900",
      color: "black",
      paddingLeft: 10,
      textAlignVertical: "center",
      lineHeight: 20,
      height: 20
  },
  listitemtextdesc: {
      opacity: 1,
      fontSize: 8,
      fontWeight:"900",
      color: "black",
      paddingLeft: 10,
      textAlignVertical: "center",
      lineHeight: 15,
      height: 15
  },
  list: {
      position: 'absolute',
      right:0,
      bottom: 0,
      color: "white",
      backgroundColor: 'transparent',
  },
  listcontainer: {
      position: 'absolute',
      right:0,
      top: 60,
      backgroundColor: 'white',
      opacity: 0.5
  },
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
      left: 0,
      right:0,
      color: "white",
      fontSize: 15,
      fontWeight:"900",
      backgroundColor: "black",
      borderRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: "#FFF",
      height: 60,
      textAlignVertical: "center",
      lineHeight: 60,
      paddingLeft: 10
  }
});
