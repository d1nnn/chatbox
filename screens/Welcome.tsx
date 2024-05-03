import React from "react";
import { Text, StyleSheet, Image, ImageBackground } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { NavigationProp } from "../props/Navigation";
import * as Animatable from "react-native-animatable";

export default function Welcome({
  navigation,
}: NavigationProp): React.JSX.Element {
  function navigateToLogin() {
    navigation?.navigate("Auth");
  }

  return (
    <ImageBackground
      source={require("../assets/imagess.jpg")}
      style={styles.container}
    >
      <Animatable.Text
        style={styles.wellcomeStyle}
        animation="fadeInDownBig"
        duration={2000}
      >
        WELCOME TO CHAT BOX
      </Animatable.Text>
      <Animatable.Image
        source={require("../assets/group-chat.png")}
        style={styles.splashImage}
        animation="zoomIn"
        duration={2000}
      />

      <TouchableWithoutFeedback onPress={navigateToLogin}>
        <Animatable.Text
          style={styles.textStyle}
          animation="fadeInUpBig"
          duration={2000}
        >
          Start Chatting
        </Animatable.Text>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    padding: 15,
    backgroundColor: "orange",
    color: "black",
    borderRadius: 20,
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  wellcomeStyle: {
    paddingBottom: 70,
    fontWeight: "bold",
    fontSize: 30,
    color: "orange",
  },
  splashImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
});
