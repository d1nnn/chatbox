import { createDrawerNavigator } from "@react-navigation/drawer"
import Home from "../screens/Home"
import About from "../screens/About"
import { CustomDrawerContent } from "./CustomeDrawerContent"
import LatestMessage from "../screens/LatestMessage"
import ChatScreen from "../screens/ChatScreen"
import { useState } from "react"
import { MessageType } from "../types/MessageTypes"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatRoom from "../screens/ChatRoom"

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()


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
        <Tab.Screen component={ChatRoom} name="ChatRoom" />
      </Tab.Navigator>
  );
}
