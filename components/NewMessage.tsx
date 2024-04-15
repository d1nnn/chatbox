import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";

type NewMessageProp = {
  length: number,
  rotate: string
  scale: number
  data: {
    photoUrl: string,
    displayName: string,
    message: string
  }
}

const { width, height } = Dimensions.get('window')


export default function NewMessage({ length, rotate, scale, data }: NewMessageProp): React.JSX.Element {
  const [isRendered, setIsRendered] = useState<boolean>(false)

  const rotateVal = useSharedValue("0deg")
  const scaleVal = useSharedValue(0)

  useEffect(() => {
    setIsRendered(!isRendered)
    rotateVal.value = rotate
    scaleVal.value = length === 1 ? 1.4 : scale

  }, [length])

  const animationStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: withTiming(rotateVal.value, { duration: 700 }) },
      { scale: withTiming(scaleVal.value, { duration: 700 }) },
    ]
  }))



  return (
    data ?
      <Animated.View style={[styles.container, animationStyle]}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: data.photoUrl }} style={styles.photo} />
        </View>
        <Text style={styles.displayName}>@{data.displayName}</Text>
        <Text style={styles.message}>{data.message.length < 60 ? data.message : data.message.slice(0, 60) + "..."}</Text>
        <TouchableOpacity style={styles.messageBtn}>
          <Ionicons name="chatbox-outline" size={40} color="orange" style={styles.messageIcon} />
        </TouchableOpacity>
      </Animated.View>
      :
      <Animated.View style={[styles.container, animationStyle]}>
        <Text style={styles.noMessage}>No new message</Text>
      </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 1.8,
    backgroundColor: '#222',
    shadowColor: 'orange',
    elevation: 4
  },
  photo: {
    borderRadius: 70 / 2,
    height: 70,
    width: 70,
  },
  photoContainer: {
    position: 'absolute',
    top: -70 / 2,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  displayName: {
    marginTop: 30,
    color: 'white',
  },
  message: {
    color: 'white',
    width: '100%',
  },
  messageBtn: {
    padding: 10,
    borderRadius: 60 / 2,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'yellow',
    shadowOpacity: 1,
    elevation: 7,
    // background color must be set
    backgroundColor: "#333" // invisible color}
  },
  messageIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  noMessage: {
    color: 'white',
    fontSize: 20,
  }
})
