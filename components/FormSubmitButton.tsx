import React from "react";
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

type FormSubmitButtonType = {
  label: string,
  onPress: () => void
}

export default function FormSubmitButton({ label, onPress }: FormSubmitButtonType): React.JSX.Element {

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: 10,
    color: "#222",
    backgroundColor: 'orange',
    width: "100%",
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 5,
    marginTop: 20,
  }
})
