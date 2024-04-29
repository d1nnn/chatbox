import React from "react";
import { ListItem } from "react-native-elements";
import ProfileImage from "./ProfileImage";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../types/UserTypes";
import { addFriend } from "../api/users";
import useLogin from "../hooks/useLogin";

const { width, height } = Dimensions.get('window')

type FriendListType = {
  data: UserType[]
  handleUsers?: (users: UserType[]) => void
}

export default function UserList({ data, handleUsers }: FriendListType): React.JSX.Element {
  const { state: currentAuth } = useLogin()
  const navigation = useNavigation()

  function addThisFriend(user: UserType) {
    addFriend(currentAuth?.data?.id as string, user.id as string).then(u => {
      console.log("FOLLOWED: ", u)
      console.log()
      if (handleUsers) {
        if (data.find(usr => u.id === usr.id)) {
          const newList = data.filter(us => us.id !== u.id)

          handleUsers([...newList, u])
        } else {
          handleUsers([...data, u])
        }
      }
    })

  }

  const renderItem: any = ({ item }: any, navigation: any) => {
    return (
      <>

        <ListItem
          key={item?.id}
          onPress={(e) => {
            e.preventDefault()
            e.stopPropagation()
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
            <ListItem.Subtitle style={{ color: 'white', marginLeft: 'auto' }}>
              {
                item?.isFriend ?
                  null
                  :
                  <TouchableOpacity onPress={() => {

                    addThisFriend(item as UserType)
                  }}>
                    <Text style={{ padding: 10, backgroundColor: 'orange', borderRadius: 5 }}>Follow</Text>
                  </TouchableOpacity>
              }
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </>
    )
  }

  return (
    <View style={{ height: height / 1.5 }}>
      <FlatList
        renderItem={(item) => renderItem(item, navigation)}
        data={data}
        contentContainerStyle={{
          flexGrow: 1,
        }}

      />
    </View>
  )
}
