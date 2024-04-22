import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import useLogin from "../hooks/useLogin";
import useUsers, { UserCtx } from "../hooks/useUsers";
import profilepic from "../assets/profilepic.png"
import SignOutBtn from "../components/SignOutBtn"
import { fetchGroups, updateReadGroup } from "../api/groups";
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import Loading from '../screens/Loading'
import useGroups from "../hooks/useGroups";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChatScreen = ({ navigation }) => {
  const isFocused = useIsFocused()

  const { state: currentUser } = useLogin()
  const { state: user, dispatch: dispatchUser } = useUsers(UserCtx.UserType)
  const { state: currentGroups, dispatch: dispatchGroups } = useGroups()
  console.log(currentGroups?.data)


  useEffect(() => {

    if (isFocused) {
      fetchGroups({ userid: currentUser.data.id }, { dispatchGroups, dispatchUser })
    }


  }, [isFocused]);

  const DEFAULT_IMAGE = require("../assets/profilepic.png")

  const renderItem = ({ item }, navigation) => {
    console.log("isread:", item?.isRead)

    return (
      <>

        <ListItem
          key={item?.id}
          onPress={() => {
            // Xử lý khi người dùng chọn một người để chat
            console.log("Start chat with group:", item?.id);
            updateReadGroup(currentUser?.data?.id, item?.id, { dispatchUser, dispatchGroups })
            navigation.navigate("ChatRoom", item)
          }}
          containerStyle={{ backgroundColor: '#222', borderBottomWidth: 1, borderColor: 'orange' }}
        >
          <Image defaultSource={profilepic} source={item?.photoUrl + "" === "" ? DEFAULT_IMAGE : { uri: item?.photoUrl }} style={styles.profilePic} />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'orange', fontWeight: "700" }}>{item?.groupName}</ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>{item?.latestMessage}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={{ color: 'white', marginLeft: 'auto' }}>{item?.time}</ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white', marginLeft: 'auto' }}>{(item?.isRead === undefined) ? "" : <MaterialCommunityIcons name="message-badge" size={24} color="orange" />}</ListItem.Subtitle>
          </ListItem.Content>

        </ListItem>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity onPress={() => { console.log('click'); navigation.navigate('Profile'); }}>
          <Image source={profilepic} style={styles.profilePic} />
        </TouchableOpacity>
        <Text style={styles.title}>Boxes</Text>
      </View>
      <SignOutBtn />
      <View style={{ flex: 10 }}>
        {
          currentGroups?.isLoading ?
            <Loading />
            :
            currentGroups?.data?.length == 0 ?
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Your history is empty. Start a group chat?</Text>
                <TouchableOpacity>
                  <Text style={styles.btnText}>Create Group</Text>
                </TouchableOpacity>
              </View>
              :
              <FlatList
                data={currentGroups?.data}
                keyExtractor={(item) => item?.id}
                renderItem={(item) => renderItem(item, navigation)}
              />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 32,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: 'orange',
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
  },
});

export default ChatScreen;
