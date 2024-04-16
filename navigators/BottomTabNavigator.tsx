import { createDrawerNavigator } from "@react-navigation/drawer"
import Home from "../screens/Home"
import Profile from "../screens/Profile"
import { CustomDrawerContent } from "./CustomeDrawerContent"
import LatestMessage from "../screens/LatestMessage"
import ChatScreen from "../screens/ChatScreen"
import { useState } from "react"
import { MessageType } from "../types/MessageTypes"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatRoom from "../screens/ChatRoom"
import Friends from "../screens/Friends"
import { createStackNavigator } from "@react-navigation/stack"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


export default function BottomTabNavigator() {
  const [messages, setMessages] = useState<MessageType | null>();
  const [hasLatestMessage, setHasLatestMessage] = useState<boolean>(true)
  return (
    !messages && hasLatestMessage ?
      <LatestMessage handleLatestMessage={() => {
        console.log("has latest message: ", hasLatestMessage)
        setHasLatestMessage(false)
      }} />
      :
      <Tab.Navigator screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: "" }} initialRouteName="ChatScreen">
        <Tab.Screen component={ChatScreen} name="ChatScreen" />
<<<<<<< HEAD
        <Tab.Screen component={Friends} name="Friends" />
=======
        <Tab.Screen component={ChatRoom} name="ChatRoom" />

>>>>>>> 4d227e1 (thuỷ: không vào được ứng dụng, đứng luôn ở ngoài màn hình đen)
      </Tab.Navigator>
  );
}
