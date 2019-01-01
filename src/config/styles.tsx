import { Platform, StyleSheet } from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../config/metrics";
import colors from "../config/colors";
var styles = StyleSheet.create({

    Page: {
        backgroundColor: colors.app_background
    },

    BackgroundImage: {
        flex: 1,
        resizeMode: 'cover'
    },

    Lettering: {
        textAlign: 'center',
        fontSize: 15
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
  
    ButtonInnerContainerFullScreen: {
      alignItems: 'stretch',
      width: DEVICE_WIDTH
    },

    ButtonInnerContainerHalfScreen: {
      alignItems: 'stretch',
      width: DEVICE_WIDTH/2
    },
    ActionButton: {
      marginLeft:10, 
      marginRight:10,
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      backgroundColor: colors.btn_background,
      color: colors.btn_text
    },

    On: {
      color: colors.app_on
    },

    Off: {
      color: colors.app_off
    },

    InputTitle: {
      color: 'black', 
      fontWeight: '900',
      marginLeft:10,
      paddingBottom: 5
    },

    LegendDescription: {
      marginLeft:10,
      marginRight:10,
      paddingBottom: 5,
      fontSize: 15
    },
  
    LegendTitle: {
      marginLeft:10,
      marginRight:10,
      fontWeight: 'bold',
      fontSize: 20
    },
  
    LegendText: {
      marginLeft:10,
      marginRight:10,
      fontSize: 15,
      paddingBottom: 5
    },
    
    TextInputStyleClass: {
      textAlign: 'center',
      borderWidth: 1,
      borderColor: colors.app_border,
      margin:10,
      marginTop:0,
      borderRadius: 5,
      backgroundColor : colors.inpt_background,
      color: colors.inpt_color
    }
});

export default styles;