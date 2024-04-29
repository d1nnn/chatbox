import React, { Dispatch, useRef, useState } from "react";
import { Image, ListRenderItem, StyleSheet, Text, View, Dimensions } from "react-native";
import { UserType } from "../types/UserTypes";

type SearchType = {
  data?: UserType[],
}

const { width, height } = Dimensions.get('window')
const DEFAULT_IMAGE = require("../assets/profilepic.png")

export default function UserIcons({ data }: SearchType): React.JSX.Element {
  const [imageContainerWidth, setImageContainerWidth] = useState<number>(0)


  return (
    data ?
      <View style={styles.searchContainer}>
        <View
          onLayout={(e: any) => {
            setImageContainerWidth(e.nativeEvent.layout.width)
          }}
          style={
            [
              styles.imageContainer,
              { transform: [{ translateX: -data.length * 15 }] }
            ]
          }
        >
          {data.map((user, i) => (
            <Image source={user?.photoUrl === "" ? DEFAULT_IMAGE : { uri: user?.photoUrl + "" }} key={i} style={[styles.profilePic, { left: i * 25 }]} />
          )
          )}
        </View>



      </View>
      :
      <View style={styles.container}><Text>This is Search</Text></View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange'
  },
  searchContainer: {
  },
  searchTitle: {
    color: 'orange',
    fontSize: 20,
    fontWeight: '700',
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    position: 'absolute',
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  }
})


