import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../configs/firebaseConfig";
import { MessageType } from "../types/MessageTypes";


const { width, height } = Dimensions.get('window')

type GroupType = {
  groupName: string,
  messages: string[],
  latestMessage: string,
  id: string,
  userids: string[]
}

export default function ChatRoom({ navigation, route }: NavigationProp): React.JSX.Element {
  console.log(route?.params)
  const [messages, setMessages] = useState<MessageType[] | null>()

  useEffect(() => {
    const something: any = route?.params

    const currentGroupMessagesQuery = query(collection(db, "messages"), where("id", "in", something.messages))
    onSnapshot(currentGroupMessagesQuery, messageSnapshot => {
      let messageList: MessageType[] = []
      messageSnapshot.forEach(messageDoc => {
        var messageResult = messageDoc.data()
        messageList.push(messageResult)
      })

      setMessages(messageList)
    })
  }, [])

  return (
    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={40}>
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          {
            messages && messages.map(m => (<View key={m.id}><Text>{m.content}</Text></View>))
          }
        </View>
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
  },
  messageContainer: {
    backgroundColor: 'orange',
    width,
    height: height / 1.2,
    borderRadius: 10,
    justifyContent: 'flex-end'
  }
})
