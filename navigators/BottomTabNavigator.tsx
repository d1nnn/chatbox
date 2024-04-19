import { createDrawerNavigator } from "@react-navigation/drawer"
import Home from "../screens/Home"
import Profile from "../screens/Profile"
import { CustomDrawerContent } from "./CustomeDrawerContent"
import LatestMessage from "../screens/LatestMessage"
import ChatScreen from "../screens/ChatScreen"
import { useState } from "react"
import { MessageType } from "../types/MessageTypes"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Friends from "../screens/Friends"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationProp } from "../props/Navigation"
import { GroupType } from "../types/GroupTypes"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


export default function BottomTabNavigator({ navigation }: NavigationProp) {
  const [messages, setMessages] = useState<MessageType | null>();
  const [hasLatestMessage, setHasLatestMessage] = useState<boolean>(true)

  function goToMessage(item: any) {
    navigation?.navigate("ChatRoom", item)
  }

  return (
    !messages && hasLatestMessage ?
      <LatestMessage handleLatestMessage={() => {
        console.log("has latest message: ", hasLatestMessage)
        setHasLatestMessage(false)
      }} />
      :
      <Tab.Navigator screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: "" }} initialRouteName="ChatScreen">
        <Tab.Screen component={ChatScreen} name="ChatScreen" />
        <Tab.Screen component={Friends} name="Friends" />

      </Tab.Navigator>
  );
}
