
import React, { FunctionComponent, useEffect, useState } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import styles from "../config/styles";
import { TRANSLATIONS } from "../config/app";

export const Loader: FunctionComponent = (props) => {  
 
  return (
     <Spinner
          visible={props.loader} 
          textContent={TRANSLATIONS.en.home.loading}  
          textStyle={styles.spinnerTextStyle}
        />) 
};