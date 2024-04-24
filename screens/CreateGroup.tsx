import React, { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Suggestion from "../components/Suggestion";
import Search from "../components/Search";
import { Entypo } from '@expo/vector-icons';
import { searchUsers } from "../api/users";
import useUsers, { UserCtx } from "../hooks/useUsers";
import { UserAction } from "../constants/user";
import useLogin from "../hooks/useLogin";
import { UserType } from "../types/UserTypes";


export default function CreateGroup(): React.JSX.Element {
  const inputRef = useRef<TextInput>(null)
  // const [inputIsFocused, setInputIsFocused] = useState<boolean>(inputRef.current?.isFocused() as boolean)
  const { state: currentUsers, dispatch: dispatchUsers } = useUsers(UserCtx.UsersType)
  const { state: currentAuth, dispatch: dispatchAuth } = useLogin()
  const [textInput, setTextInput] = useState<string>("")

  function search() {
    console.log("Searching")
    searchUsers(textInput).then((userList) => {
      dispatchUsers({ type: UserAction.FETCH, payload: userList.filter((user) => user.id !== currentAuth?.data?.id) })
    })
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
    <ScrollView style={styles.container}>
      <View>
        <TextInput ref={inputRef} value={textInput} onChange={(e: any) => setTextInput(e.nativeEvent.text)} placeholderTextColor={"#999"} style={styles.search} placeholder={"Search for boxers"} />
        <Entypo name="magnifying-glass" size={24} color="orange" style={{ position: 'absolute', top: 12, right: 30 }} onPress={search} />
      </View>
      {
        textInput.length !== 0 ?
          <Search data={currentUsers?.data as UserType[]} />
          :
          <Suggestion />
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  search: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 40,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#333",
    borderRadius: 5,
    color: 'orange',
  }
})
