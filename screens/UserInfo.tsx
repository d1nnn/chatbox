
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { NavigationProp } from "../props/Navigation";
import BackBtn from "../components/BackBtn";
import ProfileImage from "../components/ProfileImage";
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { UserType } from "../types/UserTypes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addFriend, unfriend } from "../api/users";
import useLogin from "../hooks/useLogin";
import { fetchGroup, fetchGroupFromUsers } from "../api/groups";
import { GroupType } from "../types/GroupTypes";

const { width, height } = Dimensions.get('window')

export default function UserInfo({ navigation, route }: NavigationProp): React.JSX.Element {
  const user: UserType = route?.params as UserType
  const { state: currentAuth } = useLogin()
  const [currentUserChosen, setCurrentUserChosen] = useState(user)
  const [unfriendIsOpened, setUnfriendIsOpened] = useState(false)

  function talkTo() {
    const group = fetchGroupFromUsers(currentAuth?.data?.id as string, currentUserChosen.id as string)
    group.then(g => {
      if (g) {
        navigation?.navigate("ChatRoom", g)
      } else {
        navigation?.navigate("CreateGroup", currentUserChosen)
      }
    }
    )
  }

  useEffect(() => {
    if (user?.id === currentAuth?.data?.id)
      navigation?.navigate("Profile")
  }, [])


  function makeFriend(id: string) {
    addFriend(currentAuth?.data?.id as string, id).then(user => setCurrentUserChosen(user))
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}>
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', alignSelf: 'flex-start', }}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="orange" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: '700', color: 'orange' }}>User Info</Text>
      </View>
      <ProfileImage uri={currentUserChosen.photoUrl as string} height={100} width={100} />
      <Text style={styles.userName}>{currentUserChosen.displayName}</Text>
      <View style={{ padding: 10, borderRadius: 5, flexDirection: 'row', gap: 20, justifyContent: 'center', alignItems: 'center', }}>
        {currentUserChosen.isFriend ?
          <View >
            <TouchableOpacity style={{ flexDirection: 'row', padding: 10, backgroundColor: 'orange', borderRadius: 5 }} onPress={() => setUnfriendIsOpened(prev => !prev)}>
              <Text style={{ fontSize: 18 }}>Following</Text>

              <FontAwesome name="check" size={24} color="black" />
            </TouchableOpacity>

            {unfriendIsOpened &&
              <View style={{ position: 'absolute', top: '100%', left: 0, marginTop: 5, zIndex: 10 }}>
                <TouchableOpacity onPress={() => {
                  unfriend(currentAuth?.data?.id as string, currentUserChosen.id as string).then(() => navigation?.goBack())
                }}>
                  <Text style={{ padding: 10, backgroundColor: 'red', color: '#fff', borderRadius: 5 }}>Unfriend</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          :
          (!(currentAuth?.data?.id === currentUserChosen.id) && <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 10,
              backgroundColor: 'orange',
              borderRadius: 5,
              alignItems: 'center',
              gap: 5
            }}
            onPress={() => makeFriend(currentUserChosen.id as string)}
          >

            <Entypo name="plus" size={20} color="black" />
            <Text style={{ fontSize: 18 }}>Follow</Text>
          </TouchableOpacity>
          )
        }
        <TouchableOpacity onPress={talkTo}>
          <Text style={{ padding: 10, paddingHorizontal: 20, backgroundColor: '#222', color: '#999', fontSize: 18, borderRadius: 5, borderColor: '#999', borderWidth: 0.2 }}>Message</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.custom}>
        <Text style={{ color: '#999', alignSelf: 'center', fontSize: 25, fontWeight: '600', }}>Bio</Text>
        <Text style={{ color: 'orange' }}>Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: height,
  },
  userName: {
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
    width: width * 80 / 100,
    gap: 5,
    borderWidth: 1,
    borderColor: 'orange',
    padding: 20,
    borderRadius: 10,
  }
})
