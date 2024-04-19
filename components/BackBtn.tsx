import React from "react";
import { Text, TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from "../props/Navigation";

const { width, height } = Dimensions.get('window')

export default function BackBtn({ navigation }: NavigationProp): React.JSX.Element {

  function goBack() {
    navigation?.goBack()
  }

  return (
    <View style={styles.backBtnContainer}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <Ionicons name="arrow-back-outline" size={24} color="orange" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  backBtnContainer: {
    position: 'absolute',
    top: 50,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width,
    zIndex: 10,
  },
  backBtn: {
    alignSelf: 'flex-start',
  }
})
