import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData, Pressable } from "react-native";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";
import BackBtn from "../components/BackBtn";
import { addMessage, fetchMessage, fetchMessages } from "../api/messages";
import { fetchUser, fetchUsersFromGroup } from "../api/users";
import { UserType } from "../types/UserTypes";
import { useIsFocused } from "@react-navigation/native";
import { Timestamp } from "@firebase/firestore";
import useUsers, { UserCtx } from "../hooks/useUsers";
import { GroupType } from "../types/GroupTypes";
import { fetchGroup, getGroupName } from "../api/groups";
import ProfileImage from "../components/ProfileImage";
import { FlatList } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";
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
        {
          isLoading &&
          <Loading />
        }

        {messages &&

          <FlatList
            renderItem={renderItem}
            data={messages}
            contentContainerStyle={{ width, justifyContent: 'flex-start', flexDirection: 'column', padding: 20, gap: 20, paddingTop: 70, flexGrow: 1 }}
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
