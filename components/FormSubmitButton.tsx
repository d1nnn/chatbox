import {useState} from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonProps = {
  label: string,
  onPress: () => void
}



export default function FormSubmitButton({label, onPress}: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}><Text style={styles.text}>{label}</Text></TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#0275d8',
    marginTop: 15,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: "600",
    fontSize: 20
  }
})
