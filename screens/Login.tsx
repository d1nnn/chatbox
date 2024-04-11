import React from "react";
import AuthForm from "../components/AuthForm";
import { StackScreenProps } from "@react-navigation/stack";
import { RootParamList } from "../navigators/MainNavigator";
import FormSubmitButton from "../components/FormSubmitButton";

type ScreenProps = StackScreenProps<RootParamList>;

export default function Login({
  navigation,
  route,
}: ScreenProps): React.JSX.Element {
  console.log(navigation);
  const { navigate } = navigation;
  console.log(navigate);
  return (
    <>
      <AuthForm navigation={navigation} route={route} />
      <FormSubmitButton
        label="Chat screen"
        onPress={() => {
          navigate("ChatScreen");
        }}
      />
    </>
  );
}

