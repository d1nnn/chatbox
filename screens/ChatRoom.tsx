import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Image, } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";
import BackBtn from "../components/BackBtn";
import { addMessage, fetchMessages } from "../api/messages";
import { useIsFocused } from "@react-navigation/native";
import { Timestamp } from "@firebase/firestore";
import useUsers, { UserCtx } from "../hooks/useUsers";
import { GroupType } from "../types/GroupTypes";
import { fetchGroup, getGroupName } from "../api/groups";
import { FlatList } from "react-native-gesture-handler";
import Loading from "./Loading";

const { width, height } = Dimensions.get('window')
const DEFAULT_IMAGE = require("../assets/profilepic.png")

export default function ChatRoom({ navigation, route }: NavigationProp): React.JSX.Element {
  const [messages, setMessages] = useState<MessageType[]>([])
  const { state: currentUsers, dispatch: dispatchUsers } = useUsers(UserCtx.UsersType)
  const { state: currentUser } = useLogin()
  const isFocused = useIsFocused()
  const [textInput, setTextInput] = useState<string>("")
  const scrollViewRef = useRef<ScrollView>(null)
  const [group, setGroup] = useState<GroupType>(route?.params as GroupType)
  const [groupName, setGroupName] = useState<string>("")
  const [limit, setLimit] = useState(15)
  const [isLoading, setIsLoading] = useState(false)


  // const fetchMessagesCallback = useCallback(fetchMessages, [isFocused])
  const sendMessage = async () => {
    if (textInput.length === 0)
      return
    const id = await addMessage({ content: textInput, userid: currentUser?.data?.id + "", isFile: false, groupid: group?.id + "", createdAt: Timestamp.now().toDate() })
    setTextInput("")
  }
  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    return contentOffset.y <= 20
  };

  const renderItem: any = ({ item }: any, navigation: any) => {
    const isAuth = item?.userid === currentUser?.data?.id
    return (
      <View style={{
        flexDirection: 'row',
        alignSelf: isAuth ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        gap: 10,
      }}>
        {
          !isAuth &&
          <Image source={item?.user?.photoUrl === "" ? DEFAULT_IMAGE : { uri: item?.user?.photoUrl }} style={{ width: 40, height: 40, borderRadius: 40 / 2 }} />
        }
        <Text style={{
          backgroundColor: isAuth ? 'orange' : '#333',
          color: isAuth ? 'black' : '#fff',
          padding: 10,
          borderRadius: 5,
          maxWidth: width / 2,
          fontSize: 16
        }}>{item?.content}</Text>
      </View>
    )
  }

  useEffect(() => {
    if (isFocused) {
      fetchMessages(group?.id as string, limit, setMessages)

      fetchGroup(group?.id as string).then(gr => {
        getGroupName(currentUser?.data?.id as string, gr).then(groupName => {
          setGroupName(groupName as string)
        })
        console.log()
        setGroup(gr)
      })
    }


  }, [isFocused])

  return (
    <KeyboardAvoidingView behavior="height" style={{ justifyContent: 'flex-end', flex: 1, width, backgroundColor: '#111' }}>
      <View style={{ width, flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginTop: 30, position: 'absolute', top: 0, zIndex: 10, alignItems: 'center', gap: 10 }}>
        <Ionicons name="arrow-back-outline" size={24} color="orange" onPress={() => navigation?.goBack()} />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
        <FontAwesome5
          name="info-circle"
          size={24} color="orange"
          onPress={() => { navigation?.navigate("GroupInfo", group) }}
        />
      </View>
      <View style={styles.container}>
        {
          isLoading &&
          <Loading />
        }

        {messages &&

          <FlatList
            renderItem={renderItem}
            data={messages}
            contentContainerStyle={{ width, justifyContent: 'flex-start', flexDirection: 'column', padding: 20, gap: 20, flexGrow: 1 }}
            onStartReached={() => {
              setIsLoading(true)
              fetchMessages(group?.id as string, limit + 10, setMessages).then(unsub => {

                setLimit(limit + 10)
                setIsLoading(false)
              })
            }}
            scrollEventThrottle={400}
          />
        }


        {/*<ScrollView
          scrollEventThrottle={400}
          onScroll={({ nativeEvent }) => {
            if (isCloseToTop(nativeEvent)) {
              console.log('scrolled')
              fetchMessages(group?.id as string, limit + 10, setMessages)
              console.log('after scrolled')
              setLimit(prev => prev + 10)
              scrollViewRef.current?.scrollTo({ y: 25 })
            }
          }}
          contentContainerStyle={styles.messages}
          ref={scrollViewRef}
        >
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
        */}



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
    height: height * 80 / 100,
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
    padding: 15,
    borderRadius: 5,
  },
  groupName: {
    color: 'orange',
    fontSize: 20,
    fontWeight: '700',
    maxWidth: 200
  }
})
