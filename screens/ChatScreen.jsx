import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db, usersRef } from "../configs/firebaseConfig";
import { onSnapshot, query, where, collection, getDocs } from "@firebase/firestore";
import useLogin from "../hooks/useLogin";
import profilepic from "../assets/profilepic.png"

const ChatScreen = () => {
  const { state: currentUser } = useLogin()
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetchUsers()


    const userData = [
      {
        id: "1",
        name: "Thuy Water",
        email: "Thuynuoc@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        id: "2",
        name: "Mr Dat",
        email: "singlebede@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        id: "3",
        name: "Namloveminh",
        email: "namandminh@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    ];

  }, []);

  const DEFAULT_IMAGE = require("../assets/profilepic.png")

  const renderItem = ({ item }) => (

    <ListItem
      key={item.id}
      bottomDivider
      onPress={() => {
        // Xử lý khi người dùng chọn một người để chat
        console.log("Start chat with user:", item.id);
      }}
    >
      <Image defaultSource={profilepic} source={item.photoUrl === "" ? DEFAULT_IMAGE : { uri: item.photoUrl }} style={styles.profilePic} />
      <ListItem.Content>
        <ListItem.Title>{item.displayName}</ListItem.Title>
        <ListItem.Subtitle>example.com</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Home</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
