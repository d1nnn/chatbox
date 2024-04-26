
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { NavigationProp } from "../props/Navigation";
import { GroupType } from "../types/GroupTypes";
import BackBtn from "../components/BackBtn";
import ProfileImage from "../components/ProfileImage";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import InfoItem from "../components/InfoItem";

const { width, height } = Dimensions.get('window')

export default function UserInfo({ navigation, route }: NavigationProp): React.JSX.Element {
  const group: GroupType = route?.params as GroupType


  return (
    <View style={styles.container}>
      <BackBtn goTo={() => { navigation?.goBack() }} />
      <ProfileImage uri={group.photoUrl as string} height={100} width={100} />
      <Text style={styles.groupName}>{group.groupName}</Text>
      <View style={styles.icons}>
        <View style={styles.icon}>
          <FontAwesome6 name="magnifying-glass" size={24} color="orange" />
        </View>
        <View style={styles.icon}>
          <AntDesign name="adduser" size={24} color="orange" />
        </View>
      </View>

      <Text style={{ color: '#999', fontSize: 20, alignSelf: 'flex-start', marginTop: 10 }}>Customization</Text>
      <View style={styles.custom}>
        <InfoItem color="orange" icon="new-message" title="Change box name" />
        <InfoItem color="orange" icon="users" title="See boxers" data={group.quantity} />

      </View>
      <View style={{ marginTop: 50 }}>
        <InfoItem icon="circle-with-cross" title="Leave box" color="red" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 120,
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: height,
  },
  groupName: {
    fontSize: 25,
    color: 'orange',
    fontWeight: '700',
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  icon: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 34 / 2,
    borderColor: '#555',
    borderWidth: 1,
  },
  custom: {
    width,
    gap: 5
  }
})
