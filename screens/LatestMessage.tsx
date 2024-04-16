import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, NativeSyntheticEvent } from 'react-native'
import NewMessage from '../components/NewMessage'
import FloatButton from '../components/FloatButton'
import { NavigationProp } from '../props/Navigation'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import useLogin from '../hooks/useLogin'
import Login from './Login'
import Welcome from './Welcome'
import MessageSwipe from '../components/MessageSwipe'
import { EventHandler } from 'react-native-reanimated'

type LatestMessageProp = {
  handleLatestMessage: () => void
}

const { width, height } = Dimensions.get('window')
export default function LatestMessage({ handleLatestMessage }: LatestMessageProp): React.JSX.Element {
  const { state } = useLogin()
  const [messageLength, setMessageLength] = useState<number>(2)
  const [messages, setMessages] = useState(
    [
      {
        id: 1,
        photoUrl: "https://res.cloudinary.com/dhzsuo26a/image/upload/v1710853580/qcqcakqtsiuxkcynnl06.webp",
        displayName: "Dat",
        message: "This shouldn't be me. Where have you been?"
      },
      {
        id: 2,
        photoUrl: "https://res.cloudinary.com/dhzsuo26a/image/upload/v1710853580/qcqcakqtsiuxkcynnl06.webp",
        displayName: "Not Dat",
        message: "This shouldn't be me. Where have you been?"
      },
      {
        id: 3,
        photoUrl: "https://res.cloudinary.com/dhzsuo26a/image/upload/v1710853580/qcqcakqtsiuxkcynnl06.webp",
        displayName: "Dingding",
        message: "This shouldn't be me. Where have you been?"
      },
    ])

  function removeMessage(id: number) {
    if (!id)
      return
    setMessages(prev => prev.filter(data => data.id !== id))
  }


  return (
    <GestureHandlerRootView style={{ width, height }}>
      <View style={styles.container}>
        {
          messages.length ? messages.slice(0, 2).map((data, i) => (
            <MessageSwipe length={messages.length} rotate={i % 2 == 0 ? "-10deg" : "10deg"} data={data} onRemove={removeMessage} key={i} />
          )) :
            <MessageSwipe length={messages.length} rotate="0deg" data={messages[0]} onRemove={removeMessage} />

        }
        <FloatButton position={messages.length >= 2 ? "right" : "bottom"} translate={messages.length >= 2 ? "X" : "Y"} handleLatestMessage={() => handleLatestMessage()} />
      </View >
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: height / 4,
    height: 100,
    backgroundColor: '#111',
  },
  blurball: {
    width,
    height: height / 2,
    position: 'absolute',
    right: -width / 2,
    backgroundColor: 'yellow',
    opacity: 0.5,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  button: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
  },
  menu: {
    shadowRadius: 10,
    backgroundColor: 'orange',
    shadowColor: 'yellow',
    elevation: 6,
  },
})
