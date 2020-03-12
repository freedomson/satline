import { Platform, StyleSheet } from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import colors from "../config/colors";
var styles = StyleSheet.create({

    Page: {
        backgroundColor: colors.app_background
    },

    BackgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: colors.app_background
    },

    Lettering: {
        textAlign: 'center',
        fontSize: 45
    },

    Branding: {
        marginTop: 10,
    },

    Link: {
      color: colors.app_link
    },
      
    MainContainer :{
      paddingTop: (Platform.OS) === 'ios' ? 0 : 10,
      paddingBottom: (Platform.OS) === 'ios' ? 0 : 0,
      justifyContent: 'center',
    },

    NavigatorLeftIcon: {
      paddingLeft: 20,
      width: 60,
      height: 60
    },
  
    ButtonContainer : {
      flex: 0,
      flexDirection: 'row',
      flexWrap:'wrap',
      flexGrow: 1,
      marginBottom:10,
    },
  
    ButtonRouter: {
      marginLeft:5,
      alignItems: 'stretch',
      width: DEVICE_WIDTH/5-10, 
      borderColor: colors.app_foreground,
      borderStyle: "solid", 
      borderWidth: 1,
      color: colors.app_background,  
      borderRadius: 5,
      backgroundColor: colors.inpt_background,
      fontSize: 20,
      textAlign: "center"
    },

    ButtonAction: {
      marginLeft:5,
      alignItems: 'stretch',
      width: DEVICE_WIDTH/5-10, 
      borderColor: colors.app_foreground,
      borderStyle: "solid", 
      borderWidth: 1,
      color: colors.app_foreground,
      borderRadius: 5,
      backgroundColor: colors.btn_background
    },

    ButtonIcon:{
      fontSize: 40,
      paddingTop: 5
    },
    formTitle: {
      marginLeft:10,
      marginRight:10,
      paddingBottom: 5,
      fontSize: 20,
      color: colors.app_background
    },

    spinnerTextStyle: {
      color: colors.app_foreground
    },

});

export default styles;