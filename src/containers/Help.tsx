
import React, {  useState,  FunctionComponent } from "react";
import { Linking, ScrollView, View, Text, ImageBackground } from "react-native";
import styles from "../config/styles";
import { TRANSLATIONS } from "../config/app";
export const About: FunctionComponent = () => { 

  return (       
     <View style={styles.MainContainer}>
    <ScrollView>
        <Text style = {styles.LegendTitle}>
        {TRANSLATIONS.en.help.calendar.label}
        </Text>
        <Text style = {styles.LegendText}>
        {TRANSLATIONS.en.help.calendar.description}
        </Text>

        <Text style = {styles.LegendTitle}>
        {TRANSLATIONS.en.help.contactMobile.label}
        </Text>
        <Text style = {styles.LegendText}>
        {TRANSLATIONS.en.help.contactMobile.description}
        </Text>

        <Text style = {styles.LegendTitle}>
        {TRANSLATIONS.en.help.contactEmail.label}
        </Text>
        <Text style = {styles.LegendText}>
        {TRANSLATIONS.en.help.contactEmail.description}
        </Text>

        <Text style = {styles.LegendTitle}>
        {TRANSLATIONS.en.help.silence.label}
        </Text>
        <Text style = {styles.LegendText}>
        {TRANSLATIONS.en.help.silence.description}
        </Text>

        <Text style = {styles.LegendTitle}>
        {TRANSLATIONS.en.help.location.label}
        </Text>
        <Text style = {styles.LegendText}>
        {TRANSLATIONS.en.help.location.description}
        </Text>
    </ScrollView>
  </View>)
};

export default About;