import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserType } from "../types/UserTypes";

type InfoItem = {
  title: string
  icon: any,
  color: string
  data?: { quantity?: number, newUsers?: UserType[] },
  handleClick?: () => void
}

export default function InfoItem({ title, icon, data, color, handleClick }: InfoItem): React.JSX.Element {

  return (
    <TouchableOpacity style={styles.item} onPress={handleClick}>
      <Entypo name={icon} size={24} color={color} />
      <Text
        style={[styles.itemTitle, { color }]}
      >
        {title} {data ? `(${data.quantity})` : null} {(data?.newUsers?.length ?? 0) != 0 ? ` + ${data?.newUsers?.length}` : null}
      </Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 20
  },
  itemTitle: {
    color: 'orange',
    fontSize: 18,
    fontWeight: '600',
  }
})
