
import React, { useState } from 'react'
import { View } from 'react-native'
import FormInput from './FormInput'
import FormContainer from './FormContainer'
import FormSubmitButton from './FormSubmitButton'
import firebaseApi, { db, usersRef } from '../configs/firebaseConfig';
import useLogin from '../hooks/useLogin'
import { UserAction } from '../constants/user'
import { NavigationProp } from '../props/Navigation'
import { collection, doc, getDoc, getDocs, setDoc } from '@firebase/firestore'

type RegisterInfo = {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm({ navigation }: NavigationProp): React.JSX.Element {
  const { state: currentUser, dispatch } = useLogin()
  const [userInfo, setUserInfo] = useState<RegisterInfo>({
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    firebaseApi.createUserWithEmailAndPassword(firebaseApi.auth, userInfo.username, userInfo.password).then((res) => {

      firebaseApi.updateProfile(res.user, { displayName: userInfo.displayName }).then(async () => {
        dispatch({ type: "UPDATE", payload: { ...currentUser.data, id: res.user.uid, displayName: res.user.displayName } })
        setDoc(doc(db, "users", res.user.uid), {
          id: res.user.uid,
          displayName: res.user.displayName,
          photoUrl: "https://res.cloudinary.com/dhzsuo26a/image/upload/v1713103952/profilepic_hhfvl5.png",
          friends: [],
          groupids: []
        })


        console.log("Updated successfull")

      }).catch(err => {
        console.error("Error updating profile: ", err)
      })


      res.user.getIdToken().then(token => {
        dispatch({ type: UserAction.LOGIN, payload: { email: res.user.email, displayName: res.user.displayName, token } })
        navigation?.navigate("Home");
      })
    }).catch(err => console.error("Error creating firebase account: ", err))
  }


  return (
    <FormContainer>
      <View>
        <FormInput label="Email" placeholder="Email" value={userInfo.username} onTextChange={(e) => setUserInfo({ ...userInfo, username: e.nativeEvent.text })} />
        <FormInput label="Display name" placeholder="Display Name" value={userInfo.displayName} onTextChange={(e) => setUserInfo({ ...userInfo, displayName: e.nativeEvent.text })} />
        <FormInput label="Password" placeholder="Password" value={userInfo.password} onTextChange={(e) => setUserInfo({ ...userInfo, password: e.nativeEvent.text })} />
        <FormInput label="Confirm Password" placeholder="Retype password" value={userInfo.confirmPassword} onTextChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.nativeEvent.text })} />
        <FormSubmitButton label="Sign up" onPress={handleSignup} />
      </View>
    </FormContainer>
  )
}
