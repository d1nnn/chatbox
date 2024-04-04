import React from "react"
import { Text, View } from "react-native"

export default function Home({navigation}: any): React.JSX.Element {
  function something() {
    navigation()
  }
  return ( 
    <View><Text>This is home page</Text></View>
  )
}
