import React from "react";
import { Text, View, StyleSheet } from "react-native";


export default function Friends(): React.JSX.Element {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
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
