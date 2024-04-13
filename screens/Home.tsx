import React from "react"
import { StyleSheet, Text, View, Dimensions } from "react-native"

const { width, height } = Dimensions.get('window')

export default function Home({ navigation }: any): React.JSX.Element {
  const image = { uri: "https://reactjs.org/logo-og.png" };
  return (
    <View >
      <Text>This is Home</Text>
    </View >
  )
}

