import React from "react";
import { Dimensions, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";

type InputProps = {
  label: string
  placeholder: string
  value: string
  onTextChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
}

export default function FormInput(props: InputProps): React.JSX.Element {
  const {label, onTextChange} = props

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput onChange={onTextChange} {...props} style={styles.textInput}/>
    </View>
  )
}

const styles = StyleSheet.create({
    textInput: {
        padding: 15,
        fontSize: 20,
        borderWidth: 0.5,
        borderRadius: 10,
        width: Dimensions.get('window').width / 1.5
      },
      container: {
        marginBottom: 10
      },
      label: {
        marginBottom: 5,
        fontSize: 20,
      }
  })
