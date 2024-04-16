import React, { useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Dimensions, ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { NavigationProp } from "../props/Navigation";
// import { RootParamList } from "../navigators/MainNavigator";
// import FormSubmitButton from "./FormSubmitButton";
// import {
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
//   View,
//   Text,
//   StyleSheet,
// } from "react-native";

// type ScreenProps = StackScreenProps<RootParamList>;


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

        <View style={styles.selector}>
          <TouchableOpacity
            style={{ ...styles.selectorBtn, ...styles.loginBtn }}
            onPress={() => scrollView.current?.scrollTo({ x: 0 })}
          >
            <Text style={styles.selectorText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.selectorBtn, ...styles.signupBtn }}
            onPress={() => scrollView.current?.scrollTo({ x: width })}
          >
            <Text style={styles.selectorText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            style={styles.formView}
            ref={scrollView}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <LoginForm navigation={navigation} />
            <SignupForm />
          </ScrollView>
        </View>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: height / 10,
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
    fontSize: 50,
    fontWeight: "700",
  },
  slogan: {
    fontSize: 20,
  },
});
