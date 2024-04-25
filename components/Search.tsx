import React, { Dispatch, useRef, useState } from "react";
import { Image, ListRenderItem, StyleSheet, Text, View, Dimensions } from "react-native";
import { UserType } from "../types/UserTypes";
import { ListItem } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";

type SearchType = {
  data?: UserType[],
}

const { width, height } = Dimensions.get('window')
const DEFAULT_IMAGE = require("../assets/profilepic.png")

export default function Search({ data }: SearchType): React.JSX.Element {
  const [imageContainerWidth, setImageContainerWidth] = useState<number>(0)


  // const renderItem: ListRenderItem<UserType> = ({ item }) => {
  //   return (
  //     <>
  //       <ListItem
  //         key={item?.id}
  //         onPress={() => {
  //           // Xử lý khi người dùng chọn một người để chat
  //           console.log("Start chat with group:", item?.id);
  //         }}
  //         containerStyle={{ backgroundColor: '#222', borderBottomWidth: 1, borderColor: 'orange' }}
  //       >
  //         <Image source={item?.photoUrl + "" === "" ? DEFAULT_IMAGE : { uri: item?.photoUrl }} style={styles.profilePic} />
  //         <ListItem.Content>
  //           <ListItem.Title style={{ color: 'orange', fontWeight: "700" }}>{item?.displayName}</ListItem.Title>
  //           <ListItem.Subtitle style={{ color: 'white' }}>1 mutual friend</ListItem.Subtitle>
  //         </ListItem.Content>
  //         <ListItem.Content>
  //           <ListItem.Title style={{ color: 'white', marginLeft: 'auto' }}>Click me</ListItem.Title>
  //         </ListItem.Content>
  //
  //       </ListItem>
  //     </>
  //   )
  // }
  console.log(imageContainerWidth)

  return (
    data ?
      <View style={styles.searchContainer}>
        <View
          onLayout={(e: any) => {
            console.log("layout", e.nativeEvent.layout)
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
            <Image source={user.photoUrl === "" ? DEFAULT_IMAGE : { uri: user.photoUrl + "" }} key={i} style={[styles.profilePic, { left: i * 25 }]} />
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


