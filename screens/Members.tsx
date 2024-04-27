import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserType } from "../types/UserTypes";
import { NavigationProp } from "../props/Navigation";
import { ScrollView } from "react-native-gesture-handler";
import ProfileImage from "../components/ProfileImage";
import useLogin from "../hooks/useLogin";
import { addFriend, fetchUser, fetchUsers } from "../api/users";

export default function Members({ navigation, route }: NavigationProp): React.JSX.Element {
  const groupObj = route?.params as { groupUsers: UserType[], chosenUsers: UserType[] }
  const { state: currentAuth } = useLogin()
  const [currentUser, setCurrentUser] = useState<UserType>()
  const [currentGroupUsers, setCurrentGroupUsers] = useState<UserType[]>(groupObj.groupUsers)
  const [chosenGroupUsers, setChosenGroupUsers] = useState<UserType[]>(groupObj.chosenUsers)
  const [combinedUsers, setCombinedUsers] = useState<UserType[]>([...chosenGroupUsers, ...currentGroupUsers])

  function handleChooseUser(user: UserType) { }

  const User = ({ user, isNotFriend, yetUpdate }: { user: UserType, isNotFriend: boolean, yetUpdate?: boolean }) => {
    const [notFriend, setNotFriend] = useState(isNotFriend)

    return (
      <TouchableOpacity style={[{ width: "100%" }, (yetUpdate && yetUpdate === true) && { opacity: 0.5, pointerEvents: 'none' }]} onPress={() => handleChooseUser(user)} >
        <View style={styles.user} >
          <ProfileImage uri={user.photoUrl + ""} />
          <View>
            <View>
              <Text style={styles.userText}>{user.displayName}</Text>
              <Text style={styles.mutual}>{user.mutualCount + " mutual friend"} </Text>
            </View>
          </View>
          {
            notFriend && !yetUpdate &&
            <TouchableOpacity
              style={styles.addFriendBtn}
              onPress={() => {
                addFriend(currentUser?.id as string, user?.id as string).then(() => setNotFriend(false))
              }}
            >
              <Text>Add friend</Text>
            </TouchableOpacity>
          }
        </View>
      </TouchableOpacity>

    )
  }

  useEffect(() => {
    fetchUser(currentAuth?.data?.id as string).then(user => setCurrentUser(user))
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="arrow-back-outline" size={24} color="orange" onPress={() => navigation?.goBack()} />
        <Text style={styles.title}>Boxers</Text>
      </View>
      <View style={styles.membersContainer}>
        <Text style={{ padding: 10, color: 'orange', fontSize: 20, fontWeight: '600', }}>Member ({currentGroupUsers.length})</Text>
        <ScrollView style={styles.members}>
          {
            currentUser && currentGroupUsers.length !== 0 &&
            currentGroupUsers.map(user => {
              const friend = currentUser.friends.find(id => id === user.id)
              if (!friend) {
                return (
                  <User user={user} isNotFriend={true} />
                )
              } else {
                return (<User user={user} isNotFriend={false} />)
              }
            })

          }
          {
            currentUser && chosenGroupUsers.length !== 0 &&
            chosenGroupUsers.map(user => {
              const friend = currentUser.friends.find(id => id === user.id)
              if (!friend) {
                return (
                  <User user={user} isNotFriend={true} yetUpdate={true} />
                )
              } else {
                return (<User user={user} isNotFriend={false} yetUpdate={true} />)
              }

            })

          }
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    color: 'orange',
    fontSize: 25,
    fontWeight: '700',
  },
  members: {
    backgroundColor: '#222',
    padding: 10
  },
  membersContainer: {
    flex: 1,
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
  addFriendBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    marginLeft: 'auto',
  }
})
