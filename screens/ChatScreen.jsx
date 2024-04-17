import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db, usersRef } from "../configs/firebaseConfig";
import { onSnapshot, query, where, collection, getDocs, getDoc, doc } from "@firebase/firestore";
import useLogin from "../hooks/useLogin";
import profilepic from "../assets/profilepic.png"
import SignOutBtn from "../components/SignOutBtn"
import { ConvertDateToString } from "../utils/time";

const ChatScreen = ({ navigation }) => {

  const { state: currentUser } = useLogin()
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  async function fetchUsers() {
    const q = query(collection(db, "users"))


    const unsub = onSnapshot(q, querySnapshot => {
      const userList = []

      querySnapshot.forEach(doc => {
        let data = doc.data()


        if (doc.id !== currentUser.data.id) {
          let url = `${data.photoUrl}`
          userList.push({ ...data, id: doc.id })
        }
      })
      setUsers(userList)
    })



  }

  async function fetchGroups() {
    console.log("starting to fetch groups")

    const currentUserRef = doc(db, "users", currentUser.data?.id)

    try {
      var userResult = (await getDoc(currentUserRef)).data()
      const currentUserGroupsQuery = query(collection(db, "groups"), where("id", "in", userResult.groupids))
      // const currentUserGroupsQuery = query(collection(db, "groups"))

      onSnapshot(currentUserGroupsQuery, (groupSnapshot) => {
        let groupList = []
        groupSnapshot.forEach(groupdoc => {
          var groupResult = groupdoc.data()
          const firstGroupMessageRef = doc(db, "messages", groupResult.messages[0])
          onSnapshot(firstGroupMessageRef, messageSnapshot => {
            const firstMessageResult = messageSnapshot.data()
            groupResult.latestMessage = firstMessageResult.content

            let messageDate = new Date(firstMessageResult.createdAt.toDate())

            groupResult.time = ConvertDateToString(messageDate).substr(0, 5)
            groupList.push(groupResult)
          })

        })
        setGroups(groupList)
      })


    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    // fetchUsers()

    fetchGroups()

    // return () => unsub()
  }, []);

  const DEFAULT_IMAGE = require("../assets/profilepic.png")

  const renderItem = ({ item }, navigation) => {
    console.log("group in renderitem: ", item)

    return (

      <ListItem
        key={item.id}
        bottomDivider
        onPress={() => {
          // Xử lý khi người dùng chọn một người để chat
          console.log("Start chat with group:", item.id);
          navigation.navigate("ChatRoom", item)
        }}
      >
        <Image defaultSource={profilepic} source={item.photoUrl === "" ? DEFAULT_IMAGE : { uri: item.photoUrl }} style={styles.profilePic} />
        <ListItem.Content>
          <ListItem.Title>{item.groupName}</ListItem.Title>
          <ListItem.Subtitle>{item.latestMessage}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title style={{ marginLeft: 80 }}>{item.time}</ListItem.Title>
        </ListItem.Content>

      </ListItem>
    )
  }

  return (
    <View style={styles.container}>
      <View  >
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { console.log('click'); navigation.navigate('Profile'); }}>

          <Image source={profilepic} style={styles.profilePic} />
          <Text>{currentUser.data.displayName}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Chat Home</Text>
      <SignOutBtn />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={(item) => renderItem(item, navigation)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingTop: 32,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: 'orange',
    marginBottom: 16,
  },
  profilePic: {
    objectFit: 'cover',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  }
});

export default ChatScreen;
