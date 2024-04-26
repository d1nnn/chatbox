import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileImage from "./ProfileImage";
import { UserType } from "../types/UserTypes";
import { MaterialIcons } from "@expo/vector-icons";

type UserChoiceType = {
  user: UserType,
  isChosen: boolean,
  handleChooseUser: () => void
}

export default function UserChoice({ user, isChosen, handleChooseUser }: UserChoiceType): React.JSX.Element {
  return (
    <TouchableOpacity style={{ width: "100%" }} onPress={handleChooseUser} >
      <View style={styles.user} >
        <ProfileImage uri={user.photoUrl + ""} />
        <View>
          <Text style={styles.userText}>{user.displayName}</Text>
          <Text style={styles.mutual}>{user.mutualCount + " mutual friend"} </Text>
        </View>
        {
          isChosen &&
          <MaterialIcons name="radio-button-checked" size={24} color="orange" style={{ marginLeft: 'auto' }} />
        }
      </View>
    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
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

})
