import React from "react";
import AuthForm from "../components/AuthForm";
import { NavigationProp } from "../props/Navigation";

export default function Login({ navigation, route }: NavigationProp): React.JSX.Element {
  return (
    <>
      <AuthForm navigation={navigation} route={route} />
    </>
  );
}

