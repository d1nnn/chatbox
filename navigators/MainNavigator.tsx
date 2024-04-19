import { createStackNavigator } from "@react-navigation/stack";
import useLogin from "../hooks/useLogin";
import BottomTabNavigator from "./BottomTabNavigator";
import Login from "../screens/Login";
import Loading from "../screens/Loading";
import Welcome from "../screens/Welcome";
<<<<<<< HEAD
import ChatRoom from "../screens/ChatRoom";
=======
import Profile from "../screens/Profile";
import LatestMessage from "../screens/LatestMessage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatScreen from "../screens/ChatScreen";
import { useState } from "react";
import { MessageType } from "../types/MessageTypes";
>>>>>>> 47b7f33617fb8a8c91a266373d2ca3d23abd9e52


export type RootParamList = {
  Home: undefined
  About: undefined
  Auth: undefined
  Welcome: undefined
  LatestMessage: undefined
  ChatScreen: undefined
  ChatRoom: undefined
  Profile: undefined;
}
const Stack = createStackNavigator<RootParamList>()


const StackNavigator = (): React.JSX.Element => {
  const { state } = useLogin()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {
        state.data ?
        <>
            <Stack.Screen component={BottomTabNavigator} name="Home"></Stack.Screen>
            <Stack.Screen component={ChatRoom} name="ChatRoom" />
          </>
          : <>
            <Stack.Screen component={Welcome} name="Welcome"></Stack.Screen>
            <Stack.Screen component={Login} name="Auth"></Stack.Screen>
            <Stack.Screen component={Profile} name="Profile"></Stack.Screen>
          </>
      }
    </Stack.Navigator>
  );
};

export default function MainNavigator(): React.JSX.Element {
  const { state } = useLogin()
  if (state.isLoading)
    return <Loading />
  else
    return (
      <StackNavigator />
    )
}
