import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import FormInput from './FormInput'
import FormContainer from './FormContainer'
import FormSubmitButton from './FormSubmitButton'
import firebaseApi from '../configs/firebaseConfig'
import useLogin from '../hooks/useLogin'
import { NavigationProp } from '../props/Navigation'
import { useIsFocused } from '@react-navigation/native'
type LoginInfo = {
  username: string;
  password: string;
};

type LoginFormType = {
  goToSignUp: () => void
}



export default function LoginForm({ goToSignUp }: LoginFormType): React.JSX.Element {
  const [userInfo, setUserInfo] = useState<LoginInfo>({
    username: "",
    password: "",
  })
  const [isSecure, setIsSecure] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleLogin: () => void = () => {
    firebaseApi.signInWithEmailAndPassword(firebaseApi.auth, userInfo.username, userInfo.password).catch(err => setErrorMessage(err.message))
  }
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused)
      setErrorMessage("")

  }, [isFocused])

  return (
    <FormContainer>
      <View style={styles.container}>
        <FormInput label="Email" isSecure={false} placeholder="Email" icon={"email"} value={userInfo.username} onTextChange={(e) => setUserInfo({ ...userInfo, username: e.nativeEvent.text })} />
        <FormInput label="Password" secureIcon={isSecure ? "eye" : "eye-off"} handleSecure={() => setIsSecure(prev => !prev)} isSecure={isSecure} placeholder="Password" icon={"key-variant"} value={userInfo.password} onTextChange={(e) => setUserInfo({ ...userInfo, password: e.nativeEvent.text })} />
        <FormSubmitButton label="Sign in" onPress={handleLogin} />
      </View>
      <View style={styles.toSignupContainer}>
        <Text style={styles.toSignupText}>New to this app?</Text>
        <Text style={styles.toSignupBtn} onPress={goToSignUp}>Sign up</Text>
      </View>
      {errorMessage.length ?
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
  form: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    width: '90%'
  },
  toSignupBtn: {
    color: 'orange',
    fontSize: 18,
    fontWeight: '700',
  },
  toSignupText: {
    color: '#fff'
  },
  toSignupContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 20,
    gap: 10,
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginTop: 20,
  }
});
