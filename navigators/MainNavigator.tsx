import { createStackNavigator } from "@react-navigation/stack";
import useLogin from "../hooks/useLogin";
import BottomTabNavigator from "./BottomTabNavigator";
import Login from "../screens/Login";
import Loading from "../screens/Loading";
import Welcome from "../screens/Welcome";
import ChatRoom from "../screens/ChatRoom";
import GroupsProvider from "../context/GroupsContext";
import LatestMessageProvider from "../context/LatestMessageContext";
import { GroupType } from "../types/GroupTypes";
import CreateGroup from "../screens/CreateGroup";
import GroupInfo from "../screens/GroupInfo";


export type RootParamList = {
  Home: undefined
  About: undefined
  Auth: undefined
  Welcome: undefined
  LatestMessage: undefined
  ChatScreen: undefined
  ChatRoom: GroupType
  Profile: undefined;
  CreateGroup: undefined
  GroupInfo: GroupType
}
const Stack = createStackNavigator<RootParamList>()


const StackNavigator = (): React.JSX.Element => {
  const { state } = useLogin()
  return (
    <GroupsProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          state?.data ?
            <>
              <Stack.Screen children={
                (props) =>
                  <LatestMessageProvider>
                    <BottomTabNavigator {...props} />
                  </LatestMessageProvider>
              } name="Home"></Stack.Screen>
              <Stack.Screen component={ChatRoom} name="ChatRoom" />
              <Stack.Screen component={CreateGroup} name="CreateGroup" />
              <Stack.Screen component={GroupInfo} name="GroupInfo" />
            </>
            : <>
              <Stack.Screen component={Welcome} name="Welcome"></Stack.Screen>
              <Stack.Screen component={Login} name="Auth"></Stack.Screen>
            </>
        }
      </Stack.Navigator>
    </GroupsProvider>
  );
};

export default function MainNavigator(): React.JSX.Element {
  const { state } = useLogin()
  if (state?.isLoading)
    return <Loading />
  else
    return (
      <StackNavigator />
    )
}
