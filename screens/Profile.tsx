
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput } from "react-native";
import { NavigationProp } from "../props/Navigation";
import ProfileImage from "../components/ProfileImage";
import { UserType } from "../types/UserTypes";
import { addFriend, fetchUser, updateProfile } from "../api/users";
import useLogin from "../hooks/useLogin";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import InfoItem from "../components/InfoItem";
import { chooseImage } from "../utils/image";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "@firebase/storage";
import firebaseApi, { storage } from "../configs/firebaseConfig";
import { User, updateProfile as updateAuth } from "firebase/auth";
import SignOutBtn from "../components/SignOutBtn";

const { width, height } = Dimensions.get('window')

export default function Profile({ navigation, route }: NavigationProp): React.JSX.Element {
  const user: UserType = route?.params as UserType
  const { state: currentAuth } = useLogin()
  const [currentUserChosen, setCurrentUserChosen] = useState<UserType>({} as UserType)
  const [nameEditing, setNameEditing] = useState(false)
  const [profileIsUpdating, setProfileIsUpdating] = useState(false)
  const [payload, setPayload] = useState<UserType>({} as UserType)
  const [image, setImage] = useState<{ uri?: string, fileName: string }>({ uri: undefined, fileName: "" })

  useEffect(() => {
    fetchUser(currentAuth?.data?.id as string).then(user => {
      setPayload(user)
      setCurrentUserChosen(user)
      setImage(prev => ({ ...prev, uri: user.photoUrl as string }))
    })
  }, [])

  function getImageUrl() {
    fetch(image.uri as string).then(res => {
      const blob = res.blob()
      blob.then(b => {

        const storageRef = ref(storage, `images/${image.fileName}`)
        uploadBytesResumable(storageRef, b).then(snapshot => {
          getDownloadURL(snapshot.ref).then(url => setPayload(prev => {
            const newPayload = { ...prev, photoUrl: url }
            updateProfile(currentAuth?.data?.id as string, newPayload).then(usr => {
              setPayload(usr)
              setCurrentUserChosen(usr)
              const user = firebaseApi.auth.currentUser as User
              updateAuth(user, { photoURL: url, displayName: usr.displayName })
            })
            return ({ ...prev, photoUrl: url })
          }
          ))
        })
      })
    })

  }

  function makeFriend(id: string) {
    addFriend(currentAuth?.data?.id as string, id).then(user => setCurrentUserChosen(user))
  }

  return (
    <View style={styles.container}>
      <View style={styles.nav}>

        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="orange" />
        </TouchableOpacity>
        <Text style={{ color: 'orange', fontSize: 30, fontWeight: '700', textAlign: 'left' }}>
          Profile
        </Text>
        {
          profileIsUpdating &&
          <View style={styles.prompt}>
            <TouchableOpacity
              onPress={() => {
                getImageUrl()

                setNameEditing(false)
                setProfileIsUpdating(false)
              }}
            >
              <AntDesign name="checkcircle" size={32} color="orange" />
            </TouchableOpacity>



            <TouchableOpacity onPress={() => {
              setNameEditing(false)
              setProfileIsUpdating(false)
              setPayload(currentUserChosen)
              setImage(prev => ({ ...prev, uri: currentUserChosen?.photoUrl as string }))
            }} >
              <Entypo name="circle-with-cross" size={38} color="red" />
            </TouchableOpacity>
          </View>
        }
      </View>
      <ProfileImage uri={image.uri as string} height={100} width={100} />
      {!nameEditing ? <Text style={styles.userName}>{currentUserChosen?.displayName}</Text>
        :
        <TextInput
          value={payload?.displayName as string}
          style={
            {
              color: 'orange',
              fontSize: 25,
              backgroundColor: '#333',
              padding: 10,
              width: width / 2,
              borderRadius: 5,
              textAlign: 'center',
              fontWeight: '600'
            }
          }
          onChange={(e) => {
            e.persist()
            setPayload(prev => ({ ...prev, displayName: e.nativeEvent.text }) as UserType)
          }
          }

        />
      }
      <View style={{ padding: 10, borderRadius: 5, flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', }}>
        <Text style={styles.email}>{currentAuth?.data?.email}</Text>

      </View>
      <View style={styles.statistics}>
        <View style={{ justifyContent: 'center', alignItems: 'center', borderColor: '#999', borderRightWidth: 1, padding: 10 }}>
          <Text style={[styles.statisticsText, { color: '#fff' }]}>{currentUserChosen?.friends?.length}</Text>
          <Text style={styles.statisticsText}>{"Friends"}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          <Text style={[styles.statisticsText, { color: '#fff' }]}>{currentUserChosen?.groupids?.length}</Text>
          <Text style={styles.statisticsText}>{"Groups"}</Text>
        </View>
      </View>

      <View style={styles.custom}>
        <Text style={{ color: '#888', fontSize: 22, alignSelf: 'flex-start', marginTop: 10 }}>Customization</Text>
        <View style={styles.custom}>
          <InfoItem color="orange" icon="new-message" title="Change display name" handleClick={() => {
            setNameEditing(prev => !prev)
            setProfileIsUpdating(true)
          }} />
          <InfoItem color="orange" icon="image-inverted" title="Change profile picture" handleClick={() => {
            chooseImage().then(img => setImage(img))
            setProfileIsUpdating(true)
          }} />

        </View>
        <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'center' }}>
          <SignOutBtn />
        </View>

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
    width,
    gap: 5,
    flex: 1

  },
  email: {
    color: '#999',
  },
  statistics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statisticsText: {
    color: 'orange'
  },
  nav: {
    flexDirection: 'row',
    width,
    padding: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20
  },
  signOutBtn: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    color: '#fff',
    width: width / 3,
    alignSelf: 'center',
    fontSize: 20,
    textAlign: 'center'
  },

  prompt: {
    flexDirection: 'row',
    zIndex: 5,
    gap: 30,
    alignItems: 'center',
    marginLeft: 'auto'
  },
})
