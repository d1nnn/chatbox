import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { NavigationProp } from "../props/Navigation";

interface RouteParams {
  route: {
    params: {
      userData: {
        avatar: ImageSourcePropType;
        name: string;
        message: string;
      };
    };
  };
}
interface Friend {
  id: number;
  name: any;
  message: any;
  avatar: any;
}
export default function MiniProfile({
  route,
}: NavigationProp): React.JSX.Element {
  console.log(route?.params);
  const userData: any = route?.params?.friend;
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={userData?.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.message}>{userData?.message}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thêm bạn bè</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>...</Text>
        </TouchableOpacity>
      </View>
    </View>
    // <View style={styles.container}>
    //   <Text>a</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
