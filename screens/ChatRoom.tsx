import React from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window')

export default function ChatRoom(): React.JSX.Element {

  return (
    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={40}>
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputMessage} />
          <TouchableWithoutFeedback onPress={() => {
            console.log("this is from chat room")
          }}>
            <FontAwesome name="send" size={24} color="orange" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width,
    gap: 20,
  },
  inputMessage: {
    padding: 10,
    backgroundColor: '#333',
    width: width / 1.5,
    borderRadius: 10,
    color: 'white'
  }
})
