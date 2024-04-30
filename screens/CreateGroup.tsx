import React, { useEffect, useRef, useState } from "react";
import { Keyboard, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image } from "react-native";
import UserIcons from "../components/UserIcons";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { searchUsers } from "../api/users";
import useLogin from "../hooks/useLogin";
import { UserType } from "../types/UserTypes";
import { KeyboardAvoidingView } from "native-base";
import { NavigationProp } from "../props/Navigation";
import { createGroup } from "../api/groups";
import UserChoices from "../components/UserChoices";


const { width, height } = Dimensions.get("window")
export default function CreateGroup({ navigation, route }: NavigationProp): React.JSX.Element {
  const inputRef = useRef<TextInput>(null)
  const user = route?.params as UserType
  const [users, setUsers] = useState<UserType[]>([])
  const [chosenUsers, setChosenUsers] = useState<UserType[]>([user])
  const { state: currentAuth, dispatch: dispatchAuth } = useLogin()
  const [textInput, setTextInput] = useState<string>("")
  const [messageTextInput, setMessageTextInput] = useState<string>("")
  const [searchOpened, setSearchOpened] = useState<boolean>(false)
  const [groupName, setGroupName] = useState<string>(user?.displayName as string)

  function chooseUser(id: string) {
    setChosenUsers(prev => {
      const user = prev.find(u => u?.id === id)
      if (user)
        return prev.filter(u => u?.id !== id)

      const chosenUser = users.find(u => u?.id === id)
      return [...prev, chosenUser] as UserType[]
    })
  }

  function search() {
    setSearchOpened(true)
    searchUsers(currentAuth?.data?.id + "", textInput).then((userList) => {
      let list = userList.filter((user) => user?.id !== currentAuth?.data?.id)
      setUsers(list)
    })
  }

  async function sendAndCreate() {
    const users = chosenUsers.map(u => u?.id).filter(u => u)
    const group = await createGroup({
      currentUserid: currentAuth.data?.id as string,
      message: messageTextInput,
      groupName,
      otherUsers: users as string[]
    })

    navigation?.navigate("ChatRoom", group)
  }
  function goBack() {
    navigation?.navigate("Home")
  }


  useEffect(() => {
    // const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    //   if (textInput.length === 0) {
    //     console.log("got in here")
    //   }
    //   console.log("Keyboard hidden")
    // });
    //
    // Keyboard.addListener('keyboardDidShow', () => {
    // })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ paddingTop: 5, paddingLeft: 20, paddingBottom: 25, flexDirection: 'row', gap: 20 }}>
          <Ionicons name="arrow-back-outline" size={24} color="orange" onPress={goBack} />
          <Text style={styles.createBoxTitle}>Create your own Box</Text>
        </View>


        <View style={styles.createGroupInputContainer}>
          {groupName?.length ?
            <MaterialCommunityIcons
              name="pencil-remove"
              size={24}
              color="red"
              style={{
                position: 'absolute',
                right: 15,
                zIndex: 1,
                top: 12,
              }}
              onPress={() => setGroupName("")}
            />
            :
            null
          }
          <TextInput placeholderTextColor={"#999"} placeholder="Enter Box Name" style={styles.createGroupTextInput} value={groupName} onChange={e => {
            setGroupName(e.nativeEvent.text)
          }} />
        </View>



        <View style={styles.search}>

          <TextInput
            onSubmitEditing={Keyboard.dismiss}
            style={styles.searchText}
            ref={inputRef} value={textInput}
            onChange={(e: any) => setTextInput(e.nativeEvent.text)}
            placeholderTextColor={"#999"}
            placeholder={"Search for boxers"}
          />

          <Entypo
            name="magnifying-glass"
            size={24}
            color="orange"
            style={{ position: 'absolute', top: 12, right: searchOpened ? 50 : 20 }}
            onPress={search}
          />


          {searchOpened &&
            <FontAwesome
              name="window-close"
              size={24}
              color="red"
              style={{ position: 'absolute', top: 12, right: 10 }}
              onPress={() => setSearchOpened(false)}
            />
          }
        </View>

        {searchOpened &&
          <UserChoices chosenUsers={chosenUsers} users={users} chooseUser={chooseUser} />
        }
      </View>

      <UserIcons data={chosenUsers} />
      <Text style={styles.groupName}>{groupName}</Text>
      <Text style={{ color: '#999', alignSelf: 'center', fontSize: 18 }}>Say something to create this box</Text>
      <Image source={require("../assets/chat-1873543_1280.png")} style={{ width: 200, height: 200, objectFit: 'cover', alignSelf: 'center', marginTop: 30 }} />
      <KeyboardAvoidingView behavior="position" height={searchOpened ? "0" : "24"} style={{ marginTop: 'auto' }}>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputMessage} value={messageTextInput} onChange={(e) => { setMessageTextInput(e.nativeEvent.text) }} />
          <TouchableWithoutFeedback onPress={sendAndCreate}>
            <FontAwesome name="send" size={24} color="orange" />
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    height: height * 95 / 100,
  },
  search: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 40,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    color: 'orange',
    position: 'relative',
    zIndex: 100,
    elevation: 100,
    width: '90%',
  },
  searchText: {
    color: 'orange',
  },
  user: {
    padding: 10,
    marginTop: 3,
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  userText: {
    color: 'orange'
  },
  mutual: {
    color: '#999'
  },
  createGroupTextInput: {
    padding: 10,
    paddingRight: 100,
    backgroundColor: "#333",
    color: 'orange',
    marginBottom: 20,

  },
  createGroupInputContainer: {
    width: '95%',
    alignSelf: 'center',
  },
  groupName: {
    color: 'orange',
    marginTop: 70,
    fontSize: 25,
    fontWeight: '700',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 'auto',
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
  createBoxTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'orange',
    margin: 'auto'
  }
})
