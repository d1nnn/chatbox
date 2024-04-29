import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ListRenderItem, ScrollView, FlatList, Image } from "react-native";
import { ListItem } from "react-native-elements";
import ProfileImage from "../components/ProfileImage";
import { UserType } from "../types/UserTypes";
import { fetchFriends, fetchUser, searchUsers } from "../api/users";
import useLogin from "../hooks/useLogin";
import { useIsFocused } from "@react-navigation/native";
import { NavigationProp } from "../props/Navigation";
import UserList from "../components/UserList";
import Search from "../components/Search";


export default function Friends({ navigation }: NavigationProp): React.JSX.Element {
  const { state: currentAuth } = useLogin()
  const [currentUser, setCurrentUser] = useState<UserType>()
  const [friends, setFriends] = useState<UserType[]>([])
  const [isSearchOpened, setIsSearchOpened] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {

    if (isFocused) {
      fetchFriends(currentAuth?.data?.id as string).then(userList => setFriends(userList))
      fetchUser(currentAuth?.data?.id as string).then(user => setCurrentUser(user))
    }
  }, [isFocused])


  const renderItem: any = ({ item }: any, navigation: any) => {
    return (
      <>

        <ListItem
          key={item?.id}
          onPress={() => {
            // Xử lý khi người dùng chọn một người để chat
            navigation?.navigate("UserInfo", item)
          }}
          containerStyle={{ backgroundColor: '#222', borderBottomWidth: 1, borderColor: 'orange' }}
        >
          <ProfileImage uri={item?.photoUrl + ''} />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'orange', fontWeight: "700" }}>{item?.displayName}</ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>{item?.mutualCount && item?.mutualCount > 0 ? `${item?.mutualCount} mutual friend(s)` : null}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Subtitle style={{ color: 'white', marginLeft: 'auto' }}></ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </>
    )
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        setIsSearchOpened(false)
        navigation?.goBack()
      }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="orange" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Friends ({friends.length})</Text>
        <TouchableOpacity onPress={() => {
          setIsSearchOpened(prev => !prev)
        }}>
          {
            isSearchOpened ?
              <FontAwesome5 name="user-friends" size={24} color="orange" />
              :
              <Entypo
                name="magnifying-glass"
                size={24}
                color="orange"
              />
          }
        </TouchableOpacity>
      </View>
      {
        isSearchOpened ?
          <Search handleFriends={(friends) => { setFriends(friends) }} />
          :
          friends.length > 0 ?
            <UserList data={friends} />
            :
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Image source={require("../assets/Lets_connect.png")} style={{ width: 300, height: 300, }} />
              <Text style={{ fontSize: 30, color: 'orange', }}>Connect to each other</Text>
            </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: 'orange',
  },
  profilePic: {
    objectFit: 'cover',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  titleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
