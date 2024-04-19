import React from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";


const { width, height } = Dimensions.get('window')

export default function ChatRoom(): React.JSX.Element {

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <TextInput style={{ padding: 10, backgroundColor: '#333', width: width }} />
        <TouchableWithoutFeedback onPress={() => {
          console.log("this is from chat room")
        }}>
          <Text style={{ color: 'white', fontSize: 50 }}>Send</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    height,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center', marginBottom: 80,
  }
})
