import React from "react";
import AuthForm from "../components/AuthForm";
import { StackScreenProps } from "@react-navigation/stack";
import { RootParamList } from "../navigators/MainNavigator";
type ScreenProps = StackScreenProps<RootParamList>

export default function Login({navigation, route}: ScreenProps): React.JSX.Element {
  return (
    <>
      <AuthForm navigation={navigation} route={route}/>
    </>
  )
}
