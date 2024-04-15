import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import firebaseApi from '../configs/firebaseConfig'
import { UserAction } from "../constants/user";
import useLogin from "../hooks/useLogin";

export default function SignOutBtn() {
  const { dispatch } = useLogin()
  function signOut() {
    firebaseApi.signOut(firebaseApi.auth).then(() => {
      console.log("Logged out")
      dispatch({ type: UserAction.LOGOUT })

    }).catch(err => {
      console.error("Error Logging out: ", err)
    })
  }
  return (
    <View>
      <TouchableWithoutFeedback style={styles.signOut} onPress={signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  signOut: {
    padding: 10,
    backgroundColor: '#333'
  },
  signOutText: {
    color: 'orange'
  }
})
