import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import FormInput from './FormInput'
import FormContainer from './FormContainer'
import FormSubmitButton from './FormSubmitButton'
import firebaseApi from '../configs/firebaseConfig'
import useLogin from '../hooks/useLogin'

type LoginInfo = {
  username: string,
  password: string,
}

export default function LoginForm(): React.JSX.Element {
  const {state, dispatch} = useLogin()
  const [userInfo, setUserInfo] = useState<LoginInfo>({
    username: "",
    password: "",
    })

  const handleLogin: () => void = () => {
    firebaseApi.signInWithEmailAndPassword(firebaseApi.auth, userInfo.username, userInfo.password)
    .then(res => {
      res.user.getIdToken().then(t => {
        dispatch({type: 'LOGIN', payload :{email: res.user.email, displayName: res.user.displayName, token: t}})
      })
    })
    .catch(err => console.error(err))
  }


  return (
  <FormContainer>
    <View>
      <FormInput label="Username" placeholder="Username" value={userInfo.username}onTextChange={(e) => setUserInfo({...userInfo, username: e.nativeEvent.text})}/>
      <FormInput label="Password" placeholder="Password"value={userInfo.password}onTextChange={(e) => setUserInfo({...userInfo, password: e.nativeEvent.text})}/>
      <FormSubmitButton label="Sign in" onPress={handleLogin}/>
    </View>
  </FormContainer>
  )
}

const styles = StyleSheet.create({
  form: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
})
