import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData, Pressable } from "react-native";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";
import BackBtn from "../components/BackBtn";
import { addMessage, fetchMessage, fetchMessages } from "../api/messages";
import { fetchUsersFromGroup } from "../api/users";
import { UserType } from "../types/UserTypes";
import { useIsFocused } from "@react-navigation/native";
import { Timestamp } from "@firebase/firestore";
import useUsers, { UserCtx } from "../hooks/useUsers";
import { GroupType } from "../types/GroupTypes";
import { getGroupName } from "../api/groups";
import ProfileImage from "../components/ProfileImage";

const { width, height } = Dimensions.get('window')

export default function ChatRoom({ navigation, route }: NavigationProp): React.JSX.Element {
  const [messages, setMessages] = useState<MessageType[]>([])
  const { state: currentUsers, dispatch: dispatchUsers } = useUsers(UserCtx.UsersType)
  const { state: currentUser } = useLogin()
  const isFocused = useIsFocused()
  const [textInput, setTextInput] = useState<string>("")
  const scrollViewRef = useRef<ScrollView>(null)
  const [group, setGroup] = useState<GroupType>(route?.params as GroupType)
  const [groupName, setGroupName] = useState<string>("")

  console.log("groupname: ", groupName)

  // const fetchMessagesCallback = useCallback(fetchMessages, [isFocused])
  const sendMessage = async () => {
    const id = await addMessage({ content: textInput, userid: currentUser?.data?.id + "", isFile: false, groupid: group?.id + "", createdAt: Timestamp.now().toDate() })
    setTextInput("")
  }


  useEffect(() => {
    if (isFocused) {

      if (currentUser && currentUser.data)
        fetchUsersFromGroup(group)

      fetchMessages(group?.id as string, setMessages)

      getGroupName(currentUser?.data?.id + "", group).then((groupName) => setGroupName(groupName))
    }


  }, [isFocused])

  return (
    <KeyboardAvoidingView behavior="height" style={{ justifyContent: 'flex-end', flex: 1, width }}>
      <BackBtn goTo={() => navigation?.navigate("Home")} />
      <FontAwesome5
        name="info-circle"
        size={24} color="orange"
        style={{
          position: "absolute",
          top: 62,
          right: 20,
          zIndex: 10
        }}
        onPress={() => { navigation?.navigate("GroupInfo", group) }}
      />
      <View style={styles.container}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.messages} ref={scrollViewRef} onContentSizeChange={() => { scrollViewRef.current?.scrollToEnd() }}>
          {
            messages
            &&
            messages.map((m, i) =>
            (
              <View
                key={i}
                style={[styles.messageContainer,
                (m.userid === currentUser?.data?.id) && styles.messageContainerRight, i === 0 && { marginTop: 50 }]}
              >
                {
                  currentUser?.data?.id != m.userid &&
                  <ProfileImage uri={m.user?.photoUrl + ""} width={48} height={48} />
                }
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
  groupInfo: {
    backgroundColor: '#333',
    zIndex: 3,
    position: 'absolute',
    top: 0,
    width,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  groupName: {
    color: 'orange',
    fontSize: 20,
    fontWeight: '700',
  }
})
