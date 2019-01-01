import { Platform, StyleSheet } from 'react-native';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./metrics";
import colors from "../config/colors";

var styles_flatlist = StyleSheet.create({
    container: {
      padding: 10,
    },
    title: {
      padding: 5,
    },
    icon: {
      padding: 0,
      textAlign: "center"
    },
    texttitle: { 
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'right'
    },
    containerEvent: {
      flex: 1,
      flexDirection: 'row',
      textAlign: 'center',
      alignSelf: 'stretch'
    },
    containerHeader: {
      flex: 1,
      flexDirection:'column',
      opacity: 1,
      textAlign: 'center',
      fontFamily : 'Monomod'
    },
    containerHeaderTitle: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily : 'Monomod'
    },
    container_list: {
      flex : 0.5,
      margin: 10,
      flexDirection:'column',
      backgroundColor: colors.btn_background,
      padding: 5,
      marginTop: 5,
      opacity: 0.75,
      borderWidth: 0.5,
      borderColor: colors.app_border,
      borderRadius: 5,
  }
});

export default styles_flatlist;