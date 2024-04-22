import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Dimensions, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";

type InputProps = {
  label: string
  placeholder: string
  value: string
  icon: any
  isSecure: boolean
  secureIcon?: any
  handleSecure?: () => void
  onTextChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
}

export default function FormInput(props: InputProps): React.JSX.Element {
  const { label, onTextChange } = props

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      <View>
        <MaterialCommunityIcons name={props.icon} size={24} color="orange" style={{ position: 'absolute', zIndex: 2, top: '50%', left: 15, transform: [{ translateY: -12 }] }} />
        <TextInput secureTextEntry={props.isSecure} onChange={onTextChange} {...props} placeholderTextColor="#999" style={styles.textInput} />
        {props.secureIcon && <MaterialCommunityIcons name={props.secureIcon} size={24} color="orange" style={{ position: 'absolute', zIndex: 3, top: '50%', right: 15, transform: [{ translateY: -12 }] }} onPress={props.handleSecure} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    paddingHorizontal: 50,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 7,
    color: 'white',
    // width: Dimensions.get('window').width / 1.5,
    width: '100%',
    backgroundColor: '#222',
    shadowColor: 'yellow',
    elevation: 5,
  },
  container: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 20,
    color: 'orange'
  }
})
