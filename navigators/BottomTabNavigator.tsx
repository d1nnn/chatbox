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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import useUsers, { UserCtx } from "../hooks/useUsers"
import { UserType } from "../types/UserTypes"
import useGroups from "../hooks/useGroups"
import useHasLatestMessage from "../hooks/useHasLatestMessage"

const Tab = createBottomTabNavigator()


export default function BottomTabNavigator({ }: any) {
  const [messages, setMessages] = useState<MessageType | null>();
  const { state: currentGroups } = useGroups()
  const { hasLatestMessage, handleLatestMessage } = useHasLatestMessage()


  return (
    hasLatestMessage ?

      <LatestMessage />
      :
      <Tab.Navigator screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
        tabBarStyle: {
          height: 60,
          paddingHorizontal: 5,
          paddingTop: 0,
          position: 'absolute',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "#999",
      }}

        initialRouteName="ChatScreen"
      >
        <Tab.Screen children={props => <ChatScreen  {...props} />} name="Boxes" options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alpha-b-box-outline" size={24} color={color} />
          ),

        }} />
        <Tab.Screen component={Friends} name="Friends" options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emoji-people" size={24} color={color} />
          )
        }} />

      </Tab.Navigator >
  );
}
