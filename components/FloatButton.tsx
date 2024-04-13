import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";

type FloatButtonProp = {
  position: "right" | "bottom"
  translate: "X" | "Y"
}


export default function FloatButton({ position, translate, navigation }: FloatButtonProp & NavigationProp): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const translateVal = useSharedValue(0)
  const rotateVal = useSharedValue("0deg")
  const scaleVal = useSharedValue(0)

  const animationStyle = useAnimatedStyle(() => ({
    transform: [
      translate === "X" ?
        { [`translateX`]: withSpring(translateVal.value, { duration: 600 }) }
        :
        { [`translateY`]: withSpring(translateVal.value, { duration: 600 }) }
    ]
  }))
  const rotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(rotateVal.value, { duration: 200 }),
      }]
  }))
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withDelay(800, withTiming(scaleVal.value, { duration: 500, easing: Easing.bounce }))
      }
    ]
  }))

  useEffect(() => {
    scaleVal.value = 1
  }, [])

  function toggleMenu() {
    translateVal.value = isOpen ? -60 : 0
    rotateVal.value = isOpen ? "45deg" : "0deg"


    setIsOpen(!isOpen);
  }


  return (

    <View style={[styles.floatBtnContainer, { [position]: position === "right" ? 10 : 30, flexDirection: position === "right" ? 'row' : 'column' }]}>
      <TouchableWithoutFeedback onPress={() => { navigation?.navigate("About"); }}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            { [position]: 0 },
            animationStyle,
            scaleStyle
          ]}
        >
          <FontAwesome name="home" size={24} color="orange" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <Animated.View style={[styles.button, styles.menu, { [position]: 0 }, rotationStyle, scaleStyle]}>
          <AntDesign name="plus" size={24} color="#FFF" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  menu: {
    shadowRadius: 10,
    backgroundColor: 'orange',
    shadowColor: 'yellow',
    elevation: 6,
  },
  floatBtnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondary: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    borderWidth: 1,
    backgroundColor: '#333',
    shadowColor: 'orange',
    elevation: 1,
  },
})
