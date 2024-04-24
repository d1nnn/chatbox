import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Suggestion(): React.JSX.Element {

  return (
    <View style={styles.suggest}><Text>Suggestion</Text></View>
  )
}

const styles = StyleSheet.create({
  suggest: {
    backgroundColor: 'orange'
  }
})
