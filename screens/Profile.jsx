import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image} from "react-native"

export default function Profile({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{console.log('click');  navigation.navigate('Home'); }}> 
        <Text>Go Back</Text></TouchableOpacity>
      <Image source={require('../assets/profilepic.png')} style={styles.profilepic}/>
      <TouchableOpacity onPress={()=>{console.log('click edit profile');   }}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
    alignItems: 'center',
  },
  profilepic:{
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  }
})
