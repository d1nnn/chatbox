import React from "react"
import { KeyboardAvoidingView, StyleSheet, Dimensions } from "react-native"

type FormContainerProps = {
  children: React.ReactNode
}

const {width} = Dimensions.get('window')

export default function FormContainer({children}: FormContainerProps): React.JSX.Element {
  return (
    <KeyboardAvoidingView style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    padding: 30
  },
})
