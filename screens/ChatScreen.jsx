import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db, usersRef } from "../configs/firebaseConfig";
import { onSnapshot, query, where, collection, getDocs, getDoc, doc } from "@firebase/firestore";
import useLogin from "../hooks/useLogin";
import profilepic from "../assets/profilepic.png"
import SignOutBtn from "../components/SignOutBtn"
import { ConvertDateToString } from "../utils/time";
import { fetchUsers } from "../api/users";
import { fetchGroups } from "../api/groups";
import { useFocusEffect, useIsFocused } from '@react-navigation/native'

const ChatScreen = ({ navigation }) => {
  const isFocused = useIsFocused()

  const { state: currentUser } = useLogin()
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);


  useEffect(() => {

    if (isFocused) {

      fetchGroups({ exclude: false, userid: currentUser.data.id }, setGroups)

    }

    // return () => unsub()
  }, [isFocused, currentUser]);

  const DEFAULT_IMAGE = require("../assets/profilepic.png")

  const renderItem = ({ item }, navigation) => {

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
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { console.log('click'); navigation.navigate('Profile'); }}>

          <Image source={profilepic} style={styles.profilePic} />
          <Text>{currentUser?.data?.displayName}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chat Screen</Text>
      </View>
      <SignOutBtn />
      <View style={{ flex: 10 }}>
        {
          groups.length ?
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderItem(item, navigation)}
            />
            :
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Your history is empty. Start a group chat?</Text>
              <TouchableOpacity>
                <Text style={styles.btnText}>Create Group</Text>
              </TouchableOpacity>
            </View>
        }
      </View>
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
    flex: 1,
  },
  profilePic: {
    objectFit: 'cover',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  empty: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'orange'
  },
  btnText: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5
  }
});

export default ChatScreen;
