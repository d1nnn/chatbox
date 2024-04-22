import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import firebaseApi from '../configs/firebaseConfig'
import { AuthAction } from "../constants/user";
import useLogin from "../hooks/useLogin";
import useGroups from "../hooks/useGroups";
import { GroupAction } from "../constants/group";

export default function SignOutBtn() {
  const { dispatch: dispatchLogin } = useLogin()
  const { dispatch: dispatchGroups } = useGroups()
  function signOut() {
    firebaseApi.signOut(firebaseApi.auth).then(() => {
      console.log("Logged out")
      // dispatchLogin({ type: AuthAction.LOGOUT })
      dispatchGroups({ type: GroupAction.DELETE })

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
    color: 'white',
    padding: 10,
    backgroundColor: 'red',
    alignSelf: 'flex-start',
    borderRadius: 5,
  }
})
