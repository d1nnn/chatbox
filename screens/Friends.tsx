import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ListRenderItem, ScrollView, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import ProfileImage from "../components/ProfileImage";
import { UserType } from "../types/UserTypes";
import { fetchFriends } from "../api/users";
import useLogin from "../hooks/useLogin";
import { useIsFocused } from "@react-navigation/native";


export default function Friends(): React.JSX.Element {
  const { state: currentAuth } = useLogin()
  const [friends, setFriends] = useState<UserType[]>([])
  const isFocused = useIsFocused()

  useEffect(() => {

    if (isFocused)
      fetchFriends(currentAuth?.data?.id as string).then(userList => setFriends(userList))
  }, [isFocused])


  const renderItem: any = ({ item }: any, navigation: any) => {
    return (
      <>

        <ListItem
          key={item?.id}
          onPress={() => {
            // Xử lý khi người dùng chọn một người để chat
          }}
          containerStyle={{ backgroundColor: '#222', borderBottomWidth: 1, borderColor: 'orange' }}
        >
          <ProfileImage uri={item?.photoUrl + ''} />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'orange', fontWeight: "700" }}>{item?.displayName}</ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>{item?.mutualCount}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Title style={{ color: 'white', marginLeft: 'auto' }}>{item?.time}</ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white', marginLeft: 'auto' }}></ListItem.Subtitle>
          </ListItem.Content>

        </ListItem>
      </>
    )
  }


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity>
          <Entypo
            name="magnifying-glass"
            size={24}
            color="orange"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        renderItem={renderItem}
        data={friends}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
