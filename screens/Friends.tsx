import { useState } from "react";
import React from "react";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

export default function Friends(): React.JSX.Element {
  const [searchText, setSearchText] = useState("");
  // Hàm xử lý sự kiện khi nút Xóa All được nhấn
  const handleClearSearch = () => {
    setSearchText("");
  };

  // Dữ liệu danh sách bạn bè và nhóm
  const friendsData = [
    {
      id: 1,
      name: "Friend 1",
      message: "Hello!",
      avatar: require("../assets/images (1).jpg"),
    },
    {
      id: 2,
      name: "Friend 2",
      message: "How are you?",
      avatar: require("../assets/images (1).jpg"),
    },
    {
      id: 3,
      name: "Friend 3",
      message: "Let's meet up!",
      avatar: require("../assets/images (1).jpg"),
    },
    // Thêm các bạn bè khác vào đây
  ];

  const groupsData = [
    {
      id: 1,
      name: "Group 1",
      activity: "Last activity: 1 hour ago",
      avatar: require("../assets/f325581f9612cdc77538f205e66a3d3f.jpg"),
    },
    {
      id: 2,
      name: "Group 2",
      activity: "Last activity: 3 hours ago",
      avatar: require("../assets/f325581f9612cdc77538f205e66a3d3f.jpg"),
    },
    {
      id: 3,
      name: "Group 3",
      activity: "Last activity: 30 minutes ago",
      avatar: require("../assets/f325581f9612cdc77538f205e66a3d3f.jpg"),
    },
    // Thêm các nhóm khác vào đây
  ];

  return (
    <View style={styles.container}>
      {/* Khung tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* Nút Xóa All */}
        <TouchableOpacity onPress={handleClearSearch}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách bạn bè */}
      <View>
        <Text style={styles.sectionTitle}>Friends</Text>
        <FlatList
          data={friendsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.avatar} style={styles.profilePic} />
              <View>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.friendMessage}>{item.message}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Danh sách nhóm */}
      <View>
        <Text style={styles.sectionTitle}>Groups</Text>
        <FlatList
          data={groupsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.avatar} style={styles.profilePic} />
              <View>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupActivity}>{item.activity}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
    marginTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  searchInput: {
    width: "70%",
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  clearButton: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 8,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  friendMessage: {
    fontSize: 14,
    color: "#666",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupActivity: {
    fontSize: 14,
    color: "#666",
  },
});
