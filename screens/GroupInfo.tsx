import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import { NavigationProp } from "../props/Navigation";
import { GroupType } from "../types/GroupTypes";
import BackBtn from "../components/BackBtn";
import ProfileImage from "../components/ProfileImage";
import { AntDesign, Entypo, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import InfoItem from "../components/InfoItem";
import { UserType } from "../types/UserTypes";
import { searchUsers } from "../api/users";
import useLogin from "../hooks/useLogin";
import UserChoices from "../components/UserChoices";

const { width, height } = Dimensions.get('window')

export default function GroupInfo({ navigation, route }: NavigationProp): React.JSX.Element {
  const group: GroupType = route?.params as GroupType
  const { state: currentAuth } = useLogin()
  const [currentGroup, setCurrentGroup] = useState<GroupType>(group)
  const [payload, setPayload] = useState<GroupType>(group)
  const [chosenUsers, setChosenUsers] = useState<UserType[]>([])
  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([])
  const [nameEditing, setNameEditing] = useState<boolean>(false)
  const [searchOpened, setSearchOpened] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>("")
  const [groupUsers, setGroupUsers] = useState<UserType[]>([])

  function search() {
    searchUsers(currentAuth?.data?.id as string, searchInput).then(userList => {
      currentGroup?.users?.forEach(userid => {
        userList = userList.filter(u => u.id !== userid)
        console.log("UserList: ", userList)
      })
      setSearchedUsers(userList)
    })
  }

  function getBoxers() {

  }

  function chooseUser(id: string) {
    setChosenUsers(prev => {
      const user = prev.find(u => u.id === id)
      if (user)
        return prev.filter(u => u.id !== id)

      const chosenUser = searchedUsers.find(u => u.id === id)
      return [...prev, chosenUser] as UserType[]
    })
  }

  function sendPayload() {

  }

  return (
    <View style={styles.container}>
      <BackBtn goTo={() => { navigation?.goBack() }} />
      <View style={styles.prompt}>
        <AntDesign name="checkcircle" size={32} color="orange" />
        <Entypo name="circle-with-cross" size={38} color="red" />
      </View>
      <ProfileImage uri={currentGroup.photoUrl as string} height={100} width={100} />

      {!nameEditing ? <Text style={styles.groupName}>{currentGroup.groupName}</Text>
        :
        <TextInput value={currentGroup.groupName} style={{ color: 'orange', fontSize: 25, backgroundColor: '#333', padding: 10, width: width / 2, borderRadius: 5, textAlign: 'center', fontWeight: '600' }} />
      }
      <View style={styles.icons}>
        <View style={styles.icon}>
          <FontAwesome6 name="magnifying-glass" size={24} color="orange" />
        </View>
        <View style={styles.icon}>
          <AntDesign name="adduser" size={24} color="orange" onPress={() => setSearchOpened(true)} />
        </View>
      </View>

      <Text style={{ color: '#999', fontSize: 25, alignSelf: 'flex-start', marginTop: 10 }}>Customization</Text>
      <View style={styles.custom}>
        <InfoItem color="orange" icon="new-message" title="Change box name" handleEditing={() => setNameEditing(prev => !prev)} />
        <InfoItem color="orange" icon="users" title="See boxers" data={{ quantity: group?.quantity, newUsers: chosenUsers }} />

      </View>
      <View style={{ marginTop: 50 }}>
        <InfoItem icon="" title="Leave box" color="red" />
      </View>

      {
        searchOpened &&

        <View style={styles.userSelect}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' }}>
            <Feather
              name="chevron-down"
              size={32}
              color="orange"
              onPress={() => setSearchOpened(false)}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TextInput
                placeholderTextColor={"#999"}
                placeholder="Search for users here"
                style={styles.addUserInput}
                value={searchInput}
                onChange={e => { setSearchInput(e.nativeEvent.text) }}
              />
              <Entypo
                name="magnifying-glass"
                size={24}
                color="orange"
                onPress={search}
              />
            </View>
          </View>
          <UserChoices users={searchedUsers} chooseUser={chooseUser} chosenUsers={chosenUsers} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 120,
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: height,
  },
  groupName: {
    fontSize: 25,
    color: 'orange',
    fontWeight: '700',
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  icon: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 34 / 2,
    borderColor: '#555',
    borderWidth: 1,
  },
  custom: {
    width,
    gap: 5
  },
  prompt: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 5,
    top: 60,
    right: 25,
    gap: 30,
    alignItems: 'center',
  },
  userSelect: {
    width,
    height: height / 2,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#222',
    borderRadius: 20
  },
  addUserInput: {
    backgroundColor: '#333',
    width: width / 2,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: 'orange'
  }

})
