import React, { useEffect, useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { UserType } from "../types/UserTypes";
import UserList from "./UserList";
import { fetchFriends, fetchUsers, searchUsers } from "../api/users";
import useLogin from "../hooks/useLogin";
import Loading from "../screens/Loading";

type SearchType = {
  handleFriends: (users: UserType[]) => void
}

const { width, height } = Dimensions.get('window')
export default function Search({ handleFriends }: SearchType): React.JSX.Element {

  const { state: currentAuth } = useLogin()
  const [searchInput, setSearchInput] = useState("")
  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  console.log("SEARCHED: ", handleFriends)
  console.log()

  function search() {
    searchUsers(currentAuth?.data?.id as string, searchInput).then(userList => setSearchedUsers(userList))
  }

  useEffect(() => {
    fetchUsers(currentAuth?.data?.id as string).then(userList => {
      const newList = userList.filter(u => u.mutualCount > 0)
      setSuggestedUsers(newList)
      setIsLoading(false)
    })
  }, [])

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <TextInput
          style={{ padding: 10, paddingHorizontal: 20, backgroundColor: '#333', color: 'orange', flex: 1, borderRadius: 5 }}
          placeholderTextColor={"#999"}
          placeholder="Search for user"
          value={searchInput}
          onChange={(e) => setSearchInput(e.nativeEvent.text)}
        />

        <TouchableOpacity onPress={search}>
          <Text
            style={{ padding: 10, borderRadius: 5, backgroundColor: 'orange' }}
          >
            Search
          </Text>
        </TouchableOpacity>

      </View>
      <View>


        {
          searchedUsers.length > 0 ?
            <View>
              <Text style={{ fontSize: 20, fontWeight: '600', color: 'orange', padding: 10 }}>Search Result</Text>
              <UserList data={searchedUsers} handleUsers={(users) => {
                setSearchedUsers(users)
                fetchFriends(currentAuth?.data?.id as string).then(friends => handleFriends(friends))
              }
              } />
            </View>
            :
            suggestedUsers.length > 0 ?
              <View>
                <Text style={{ fontSize: 20, fontWeight: '600', color: 'orange', padding: 10 }}>Suggestion</Text>
                <UserList data={suggestedUsers} handleUsers={(users) => {
                  setSuggestedUsers(users)
                  fetchFriends(currentAuth?.data?.id as string).then(friends => handleFriends(friends))
                }} />
              </View>
              :
              isLoading ?
                <Loading />
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ padding: 10, borderRadius: 5, color: 'orange', fontSize: 30, fontWeight: '600' }}>Search for users</Text>
                </View>
        }
      </View>

    </View>
  )
}
