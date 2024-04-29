
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { NavigationProp } from "../props/Navigation";
import BackBtn from "../components/BackBtn";
import ProfileImage from "../components/ProfileImage";
import { AntDesign, Entypo, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { UserType } from "../types/UserTypes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addFriend, unfriend } from "../api/users";
import useLogin from "../hooks/useLogin";

const { width, height } = Dimensions.get('window')

export default function UserInfo({ navigation, route }: NavigationProp): React.JSX.Element {
  const user: UserType = route?.params as UserType
  const { state: currentAuth } = useLogin()
  const [currentUserChosen, setCurrentUserChosen] = useState(user)
  const [unfriendIsOpened, setUnfriendIsOpened] = useState(false)

  useEffect(() => {
    if (user.id === currentAuth?.data?.id)
      navigation?.navigate("Profile")
  }, [])


  function makeFriend(id: string) {
    addFriend(currentAuth?.data?.id as string, id).then(user => setCurrentUserChosen(user))
  }

  return (
    <View style={styles.container}>
      <BackBtn goTo={() => { navigation?.goBack() }} />
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
              <View style={{ position: 'absolute', top: '100%', left: 0, marginTop: 5 }}>
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
        <TouchableOpacity onPress={() => navigation?.navigate("CreateGroup", currentUserChosen)}>
          <Text style={{ padding: 10, paddingHorizontal: 20, backgroundColor: '#222', color: '#999', fontSize: 18, borderRadius: 5, borderColor: '#999', borderWidth: 0.2 }}>Message</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.custom}>

      </View>
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
    width,
    gap: 5
  }
})
