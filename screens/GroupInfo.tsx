import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationProp } from "../props/Navigation";
import { GroupType } from "../types/GroupTypes";
import BackBtn from "../components/BackBtn";
import ProfileImage from "../components/ProfileImage";

export default function GroupInfo({ navigation, route }: NavigationProp): React.JSX.Element {
  const group: GroupType = route?.params as GroupType


  return (
    <View style={styles.container}>
      <BackBtn goTo={() => { navigation?.goBack() }} />
      <ProfileImage uri={group.photoUrl as string} height={150} width={150} />
      <View>
        <Text style={styles.groupName}>Group name: {group.groupName}</Text>
        <Text style={styles.groupName}>Members: {group.quantity}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 25,
    color: 'orange',
    fontWeight: '700',
  }
})
