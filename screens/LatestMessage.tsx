import React, { useEffect, useState } from 'react'
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
import { fetchUnreadMessages } from '../api/messages'
import { GroupType } from '../types/GroupTypes'
import { fetchGroups } from '../api/groups'
import { useIsFocused } from '@react-navigation/native'

type LatestMessageProp = {
  handleLatestMessage: () => void
}

const { width, height } = Dimensions.get('window')
export default function LatestMessage({ handleLatestMessage }: LatestMessageProp & NavigationProp): React.JSX.Element {
  const { state: currentUser } = useLogin()
  const [groups, setGroups] = useState<GroupType[]>([])
  const isFocused = useIsFocused()

  function removeMessage(id: string) {
    if (!id)
      return
    setGroups(prev => prev.filter(data => data.id !== id))
  }

  useEffect(() => {
    if (isFocused)
      fetchGroups({ exclude: false, userid: currentUser?.data?.id }, setGroups, { isRead: false })
  }, [isFocused])


  return (
    <GestureHandlerRootView style={{ width, height }}>
      <View style={styles.container}>
        {
          groups.length ? groups.map((group, i) => (
            <MessageSwipe length={group.latestMessage?.length ?? 0} rotate={i % 2 == 0 ? "-10deg" : "10deg"} data={group} onRemove={removeMessage} key={i} />
          )) :
            <MessageSwipe length={groups.length} rotate="0deg" data={groups[0]} onRemove={removeMessage} />

        }
        <FloatButton position={groups.length >= 2 ? "right" : "bottom"} translate={groups.length >= 2 ? "X" : "Y"} handleLatestMessage={() => handleLatestMessage()} />
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
