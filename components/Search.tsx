import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserType } from "../types/UserTypes";

type SearchType = {
  data?: UserType[]
}


export default function Search({ data }: SearchType): React.JSX.Element {

  return (
    data ?
      <View>
        {data.map(user => (<Text style={{ color: 'orange' }}>{user.displayName}</Text>))}
      </View>
      :
      <View style={styles.container}><Text>This is Search</Text></View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange'
  }
})
