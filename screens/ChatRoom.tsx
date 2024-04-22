import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";
import BackBtn from "../components/BackBtn";
import { addMessage, fetchMessage, fetchMessages } from "../api/messages";
import { fetchUsersFromGroup } from "../api/users";
import { UserType } from "../types/UserTypes";
import { useIsFocused } from "@react-navigation/native";
import { Timestamp } from "@firebase/firestore";

const { width, height } = Dimensions.get('window')
const DEFAULT_IMAGE = require("../assets/profilepic.png")

export default function ChatRoom({ navigation, route }: NavigationProp): React.JSX.Element {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [users, setUsers] = useState<UserType[] | null>()
  const { state: currentUser } = useLogin()
  const isFocused = useIsFocused()
  const [textInput, setTextInput] = useState<string>("")
  const scrollViewRef = useRef<ScrollView>(null)


  const fetchMessagesCallback = useCallback(fetchMessages, [isFocused])
  const sendMessage = async () => {
    const group: any = route?.params
    const id = await addMessage({ content: textInput, userid: currentUser?.data?.id + "", isFile: false, groupid: group?.id, createdAt: Timestamp.now().toDate() })
    setTextInput("")
  }

  useEffect(() => {
    if (isFocused) {
      const group: any = route?.params

      if (currentUser && currentUser.data)
        fetchUsersFromGroup(group?.id, { userid: currentUser.data.id }, setUsers)

      fetchMessagesCallback(group?.id, setMessages)
    }


  }, [isFocused])

  return (
    <KeyboardAvoidingView behavior="height" style={{ justifyContent: 'flex-end', flex: 1 }}>
      <BackBtn navigation={navigation} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.messages} ref={scrollViewRef} onContentSizeChange={() => { scrollViewRef.current?.scrollToEnd() }}>
          {
            messages
            &&
            messages.map((m, i) =>
            (
              <View
                key={i}
                style={[styles.messageContainer,
                (m.userid === currentUser?.data?.id) && styles.messageContainerRight]}
              >
                {currentUser?.data?.id != m.userid && <Image source={m.user?.photoUrl + "" === "" ? DEFAULT_IMAGE : { uri: m.user?.photoUrl + "" }} style={{ height: 48, width: 48, borderRadius: 48 / 2 }} />}
                <Text style={[styles.messageText, m.userid === currentUser?.data?.id && { backgroundColor: 'orange' }]}>{m.content}</Text>
              </View>
            )
            )
          }
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputMessage} value={textInput} onChange={(e) => { setTextInput(e.nativeEvent.text) }} />
          <TouchableWithoutFeedback onPress={sendMessage}>
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
    height: height * 95 / 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'hidden',
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
  messages: {
    width,
    minHeight: height * 85 / 100,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  messageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  messageContainerRight: {
    alignSelf: 'flex-end',
  },
  messageText: {
    padding: 15,
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 20,
  },
})
