import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import React from "react";
import firebaseApi from '../configs/firebaseConfig'
import { StyleSheet } from "react-native";
import useLogin from "../hooks/useLogin";
import { UserAction } from "../constants/user";

export function CustomDrawerContent(props: any): React.JSX.Element {
  const { state, dispatch } = useLogin()

  function signOut() {
    firebaseApi.signOut(firebaseApi.auth).then(() => {
      console.log("Logged out")
      dispatch({ type: UserAction.LOGOUT })
      props.navigation.navigate("Auth")

    }).catch(err => {
      console.error("Error Logging out: ", err)
    })
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem style={styles.signoutBtn} label="Sign out" onPress={signOut} />
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  signoutBtn: {
    marginTop: 30
  }
})
