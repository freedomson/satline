import React, {Component} from 'react';
import { Text, Modal, View, TouchableHighlight, StyleSheet, FlatList} from "react-native";
import { Icon, SearchBar } from "react-native-elements";
class Control extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            search: "",
            channels: props.channels,
            currentChannelIdx: props.currentChannelIdx,
            height: props.stbState.height,
            width: props.stbState.width
        };
    }

  componentWillReceiveProps(props){
    console.log("CONTROL_componentWillReceiveProps",props)
    this.setState({
            ...this.state,
            channels: (this.state.search ? this.searchFilterFunction(this.state.search): this.props.channels),
            currentChannelIdx: this.props.currentChannelIdx,
            width: this.props.getDimensions().width
        }); 
  }

  setModalVisible(visible) {
    console.log("CONTROL_setModalVisible",this.state)
    // if (this.props.stbState.loader) return;
    this.setState({
            ...this.state,
            visible: visible
        }); 
  }

  shouldComponentUpdate(props){
    console.log("CONTROL_shouldComponentUpdate",props, this.state)
    // if (!props.playing) return false;
    return true
  }

  renderListSeparator = () => {
    return (
      <View
        style={[
          styles.listseparator,
          {
            width:this.state.width/2-10
          }
        ]}
      />
    );
  };

  searchFilterFunction = text => {
    const newData = this.props.channels.filter(item => {
      const itemData = `${item.channelName.toUpperCase()}`;
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
                    height:this.state.height}]} 
                onPress={() => {
                  this.setModalVisible(!this.state.visible);
                }}>
                <Text />
              </TouchableHighlight>

                { this.state.visible &&
                  <Text
                    style={[
                      styles.common,styles.channelName]}>
                      {this.props.currentChannel.channelName}</Text>
                }

               { this.state.visible &&
                  <TouchableHighlight
                  style={[styles.common,styles.next]} 
                  activeOpacity={1}
                  underlayColor={"transparent"} 
                  onPress={(async () => {
                  this.props.cb(this.state.currentChannelIdx+1)
                  }).bind(this)}>
                  <Icon name={"navigate-next"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
                  </TouchableHighlight>
                }

               { this.state.visible &&
                  <TouchableHighlight
                  style={[styles.common,styles.previous]} 
                  activeOpacity={1}
                  underlayColor={"transparent"} 
                  onPress={(async () => {
                  this.props.cb(this.state.currentChannelIdx-1)
                  }).bind(this)}>
                  <Icon name={"navigate-before"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
                  </TouchableHighlight>
              }

              { this.state.visible &&
               <TouchableHighlight
                style={[styles.common,styles.refresh]} 
                activeOpacity={this.state.currentChannelIdx}
                underlayColor={"transparent"} 
                onPress={(async () => {
                  this.props.cb(this.state.currentChannelIdx)
                }).bind(this)}>
                <Icon name={"refresh"} raised={true} reverse={true} iconStyle={[styles.icon]}/>
              </TouchableHighlight>
              }

            { this.state.visible &&
            <View
              style={[styles.listcontainer,
                {
                  width:this.state.width/2-50,
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
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false} 
                />
            </View>
            }

            { this.state.visible && 
            <FlatList
              ItemSeparatorComponent={this.renderListSeparator}
              style={[styles.list,
              {
                width:this.state.width/2-50,
                height:this.state.height-50
              }
              ]}
              data={this.state.channels}
              // initialScrollIndex={this.state.currentChannelIdx}
              keyExtractor={(item: object, index: number) => item.channelNo}
              getItemLayout={(data, index) => (
                {length: 40, offset: 40 * index, index}
              )}
              renderItem={({item, index, separators}) => {
                return (
                <TouchableHighlight
                  onPress={() => this.props.cb(index)}
                  underlayColor={"#FFF"}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <View style={[styles.listitem]}>
                    <Text style={[styles.listitemtext]}>{String(index).padStart(4, '0')} | {item.channelName}</Text>
                  </View>
                </TouchableHighlight>)
              }}
            />
            }

          </View>
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
    marginLeft: 5,
    marginRight: 5
  },
  listitem: {
      backgroundColor: 'transparent',
      opacity: 1,
      height: 40
  },
  listitemtext: {
      opacity: 1,
      fontSize: 10,
      fontWeight:"900",
      color: "black",
      paddingLeft: 10,
      textAlignVertical: "center",
      lineHeight: 40
  },
  list: {
      position: 'absolute',
      right:0,
      top: 60,
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
      fontSize: 20,
      fontWeight:"900",
      backgroundColor: "black",
      borderRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: "#FFF",
      height: 60,
      textAlignVertical: "center",
      lineHeight: 60,
      paddingLeft: 10
  },
  refresh: {
      position: "absolute",
      top: 60,
      left: 140,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  },
  next: {
      position: "absolute",
      top: 60,
      left: 70,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  },
  previous: {
      position: "absolute",
      top: 60,
      left: 0,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 100,
  }
});
