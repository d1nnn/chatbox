import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { NavigationProp } from "../props/Navigation";

export default function Welcome({ navigation }: NavigationProp): React.JSX.Element {

  function navigateToLogin() {
    navigation?.navigate("Auth");
  }

  return (
    <View style={styles.container}>
      <Text>THIS IS WELCOME PAGE</Text>
      <TouchableWithoutFeedback onPress={navigateToLogin}><Text style={styles.textStyle}>Start chatting</Text></TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    padding: 15,
    backgroundColor: 'orange',
    color: 'black',
    borderRadius: 10,
  }
})
