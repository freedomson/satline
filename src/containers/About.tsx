
import React, {  useState,  FunctionComponent } from "react";
import { Linking, ScrollView, View, Text, ImageBackground } from "react-native";
import styles from "../config/styles";
export const About: FunctionComponent = () => { 

  return (       
     <View style={styles.MainContainer}>
    <ScrollView>
        <Text style = {styles.LegendTitle}>
        Developer
        </Text>

        <Text style = {styles.LegendText}>
        freedomson
        </Text>

        <Text style = {styles.LegendTitle}>
        Application Icon
        </Text>

        <Text style = {styles.LegendText}>
        {`Icon made by `}
        <Text style = {styles.Link} onPress={() => Linking.openURL('https://www.flaticon.com/authors/freepik')}>
        freepik
        </Text>
        {` from flaticon.com`}
        </Text>

        <Text style = {styles.LegendTitle}>
        Application Cover
        </Text>
        <Text style = {styles.LegendText}>
        {`Photo by `}
        <Text style = {styles.Link} onPress={() => Linking.openURL('https://unsplash.com/photos/A5FaLf5d8nw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText')}>
        Adam Gong
        </Text>
        {` from unsplash.com`}
        </Text>

        <Text style = {styles.LegendTitle}>
        Open Source
        </Text>
        <Text style = {styles.LegendText}>
        {`MIT by freedomson.com `}
        <Text style = {styles.Link} onPress={() => Linking.openURL('https://bitbucket.org/dartmy/paseeo/src/V2/')}>
        source code
        </Text>
        {` from Bitbucket`}
        </Text>
    </ScrollView>
  </View>)
};

export default About;