import React from "react";
import { UserType } from "../types/UserTypes";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import UserChoice from "./UserChoice";

type UserChoices = {
  users: UserType[]
  chooseUser: (id: string) => void
  chosenUsers: UserType[]
}

const { width, height } = Dimensions.get('window')

export default function UserChoices({ users, chosenUsers, chooseUser }: UserChoices): React.JSX.Element {
  return (
    <ScrollView
      style={styles.resultDropbox}
    >
      {
        users.length ? users.map((user, i) => {
          let isChosen = false
          const userInList = chosenUsers.find(u => u?.id === user?.id)
          if (userInList)
            isChosen = true

          return (
            <UserChoice
              user={user}
              isChosen={isChosen}
              handleChooseUser={() => chooseUser(user?.id as string)}
              key={user?.id}
            />
          )
        }
        )
          :
          <View style={{ alignSelf: 'center', marginTop: 80 }}>
            <Text style={{ color: 'orange', fontSize: 25, fontWeight: '700' }}>Result not found</Text>
          </View>
      }
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  resultDropbox: {
    backgroundColor: '#333',
    width,
    height: 200,
    alignSelf: 'center',
  },

})
