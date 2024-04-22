
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import FormInput from './FormInput'
import FormContainer from './FormContainer'
import FormSubmitButton from './FormSubmitButton'
import firebaseApi, { db, usersRef } from '../configs/firebaseConfig';
import useLogin from '../hooks/useLogin'
import { AuthAction } from '../constants/user'
import { NavigationProp } from '../props/Navigation'
import { collection, doc, getDoc, getDocs, setDoc } from '@firebase/firestore'
import { useIsFocused } from '@react-navigation/native'

type RegisterInfo = {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
};

type SignupFormType = {
  goToLogin: () => void
}

export default function SignupForm({ navigation, goToLogin }: NavigationProp & SignupFormType): React.JSX.Element {
  const { state: currentUser, dispatch } = useLogin()
  const [userInfo, setUserInfo] = useState<RegisterInfo>({
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const scrollViewRef = useRef<ScrollView>(null)
  const [passwordIsSecure, setPasswordIsSecure] = useState<boolean>(true)
  const [confirmPasswordIsSecure, setConfirmPasswordIsSecure] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused)
      setErrorMessage("")

  }, [isFocused])

  const handleSignup = async () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      setErrorMessage("Please reconfirm your password")
      return
    }
    firebaseApi.createUserWithEmailAndPassword(firebaseApi.auth, userInfo.username, userInfo.password).then((res) => {
      let payload = { ...currentUser.data, id: res.user.uid, displayName: res.user.displayName }

      firebaseApi.updateProfile(res.user, { displayName: userInfo.displayName }).then(async () => {
        setDoc(doc(db, "users", res.user.uid), {
          id: res.user.uid,
          displayName: res.user.displayName,
          photoUrl: "https://res.cloudinary.com/dhzsuo26a/image/upload/v1713103952/profilepic_hhfvl5.png",
          friends: [],
          groupids: []
        })


        console.log("Updated successfull")

      }).catch(err => {
        setErrorMessage(err.message)
      })


      res.user.getIdToken().then(token => {
        payload.token = token
        dispatch({ type: AuthAction.LOGIN, payload })
        navigation?.navigate("Home");
      })
    }).catch(err => setErrorMessage(err.messasge))
  }


  return (
    <FormContainer>
      <ScrollView ref={scrollViewRef} style={{ width: '100%', height: 150 }}>
        <FormInput label="Email" isSecure={false} icon="email" placeholder="Email" value={userInfo.username} onTextChange={(e) => setUserInfo({ ...userInfo, username: e.nativeEvent.text })} />
        <FormInput label="Display name" isSecure={false} icon="rename-box" placeholder="Display Name" value={userInfo.displayName} onTextChange={(e) => setUserInfo({ ...userInfo, displayName: e.nativeEvent.text })} />
        <FormInput label="Password" isSecure={passwordIsSecure} secureIcon={passwordIsSecure ? 'eye' : 'eye-off'} icon="key-variant" handleSecure={() => setPasswordIsSecure(prev => !prev)} placeholder="Password" value={userInfo.password} onTextChange={(e) => setUserInfo({ ...userInfo, password: e.nativeEvent.text })} />
        <FormInput label="Confirm Password" isSecure={confirmPasswordIsSecure} secureIcon={confirmPasswordIsSecure ? 'eye' : 'eye-off'} handleSecure={() => setConfirmPasswordIsSecure(prev => !prev)} icon="form-textbox-password" placeholder="Retype password" value={userInfo.confirmPassword} onTextChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.nativeEvent.text })} />
        <FormSubmitButton label="Sign up" onPress={handleSignup} />
      </ScrollView>
      <View style={styles.toLoginContainer}>
        <Text style={styles.toLoginText}>Already have account?</Text>
        <Text style={styles.toLoginBtn} onPress={goToLogin}>Sign in</Text></View>
      {errorMessage?.length ?
        <View>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
        :
        null
      }
    </FormContainer>
  )
}

const styles = StyleSheet.create({
  toLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 20,
    gap: 10,
  },
  toLoginBtn: {
    color: 'orange',
    fontSize: 18,
    fontWeight: '700',
  },
  toLoginText: {
    color: '#fff'
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginTop: 20,
  }
})
