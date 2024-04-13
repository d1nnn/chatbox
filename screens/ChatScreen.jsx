import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const ChatScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
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

    setUsers(userData);
  }, []);

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        // Xử lý khi người dùng chọn một người để chat
        console.log("Start chat with user:", item.id);
      }}
    >
      <Avatar source={{ uri: item.avatar }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
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
});

export default ChatScreen;
