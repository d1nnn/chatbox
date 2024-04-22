import React, { useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Dimensions, ScrollView, TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { NavigationProp } from "../props/Navigation";
const { width, height } = Dimensions.get('window')

export default function AuthForm({ navigation }: NavigationProp): React.JSX.Element {
  const scrollView = useRef<ScrollView>(null)

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>The Box</Text>
          <Text style={styles.slogan}>Connect our hearts together</Text>
        </View>
        <Image source={require("../assets/ChatImage.png")} style={{ objectFit: 'cover', height: 120, width: 120, alignSelf: 'center' }} />


        <View>
          <ScrollView
            style={styles.formView}
            ref={scrollView}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <LoginForm goToSignUp={() => scrollView.current?.scrollTo({ x: width })} />
            <SignupForm goToLogin={() => scrollView.current?.scrollTo({ x: 0 })} />
          </ScrollView>
        </View>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: 40,
  },
  loginBtn: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightWidth: 0
  },
  signupBtn: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selectorBtn: {
    borderWidth: 1,
    padding: 10,
  },
  selectorText: {
    fontSize: 20,
  },
  selector: {
    flexDirection: "row",
    alignSelf: "center",
  },
  formView: {},
  titleContainer: {
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: 'orange',
    fontSize: 50,
    fontWeight: "700",
  },
  slogan: {
    color: 'white',
    fontSize: 20,
  },
});
