import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import firebaseApi from '../configs/firebaseConfig'
import useGroups from "../hooks/useGroups";
import { GroupAction } from "../constants/group";
import useHasLatestMessage from "../hooks/useHasLatestMessage";

const { width, height } = Dimensions.get('window')

export default function SignOutBtn() {
  const { dispatch: dispatchGroups } = useGroups()
  const { handleLatestMessage } = useHasLatestMessage()
  function signOut() {
    firebaseApi.signOut(firebaseApi.auth).then(() => {
      console.log("Logged out")
      handleLatestMessage(false)
      dispatchGroups({ type: GroupAction.DELETE })

    }).catch(err => {
      console.error("Error Logging out: ", err)
    })
  }
  return (
    <TouchableWithoutFeedback style={styles.signOut} onPress={signOut}>
      <Text style={styles.signOutText}>Sign out</Text>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  signOut: {
    padding: 10,
    alignSelf: 'center',
  },
  signOutText: {
    color: 'white',
    padding: 10,
    backgroundColor: 'red',
    alignSelf: 'flex-start',
    borderRadius: 5,
    width: width / 3,
    textAlign: 'center',
    fontSize: 20,
  }
})
