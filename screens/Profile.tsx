import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Profile(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>This is Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})