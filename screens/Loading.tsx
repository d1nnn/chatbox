import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';


export default function Loading(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
