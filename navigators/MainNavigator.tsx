import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import About from "../screens/About";
import AuthForm from "../components/AuthForm";
import useLogin from "../hooks/useLogin";
import DrawerNavigator from "./DrawerNavigator";
import Login from "../screens/Login";
import Loading from "../screens/Loading";
import ChatScreen from "../screens/ChatScreen";

export type RootParamList = {
  Home: undefined;
  About: undefined;
  Auth: undefined;
  ChatScreen: undefined;
};
const Stack = createStackNavigator<RootParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Login} name="Auth"></Stack.Screen>
      <Stack.Screen component={ChatScreen} name="ChatScreen"></Stack.Screen>
      <Stack.Screen component={Home} name="Home"></Stack.Screen>
      <Stack.Screen component={About} name="About"></Stack.Screen>
    </Stack.Navigator>
  );
};

export default function MainNavigator() {
  const { state, dispatch } = useLogin();

  return state.data ? (
    <DrawerNavigator />
  ) : !state.isLoading ? (
    <StackNavigator />
  ) : (
    <Loading />
  );
  // <StackNavigator />
}
