import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, NativeSyntheticEvent } from 'react-native'
import FloatButton from '../components/FloatButton'
import { NavigationProp } from '../props/Navigation'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import useLogin from '../hooks/useLogin'
import MessageSwipe from '../components/MessageSwipe'
import { GroupType } from '../types/GroupTypes'
import { DispatchOptions, fetchGroups, fetchUnreadGroups, updateReadGroup } from '../api/groups'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import useGroups from '../hooks/useGroups'
import { GroupAction } from '../constants/group'
import Loading from './Loading'
import { UserType } from '../types/UserTypes'
import useUsers, { UserCtx } from '../hooks/useUsers'

type LatestMessageProp = {
  handleLatestMessage: () => void
}

const { width, height } = Dimensions.get('window')
export default function LatestMessage({ handleLatestMessage, navigation }: LatestMessageProp & NavigationProp): React.JSX.Element {
  const { state: currentUser } = useLogin()
  const { state: user, dispatch: dispatchUser } = useUsers(UserCtx.UserType)
  const { state: currentGroups, dispatch: dispatchGroups } = useGroups()
  const isFocused = useIsFocused()

  function handleLatestWithUnreadGroup(userid: string, groupid: string, dispatchOptions: DispatchOptions) {
    updateReadGroup(userid, groupid, dispatchOptions)
    handleLatestMessage()
  }

  function removeMessage(id: string) {
    if (!id)
      return
    const filtered = currentGroups.data?.filter(data => data.id !== id)
    dispatchGroups({ type: GroupAction.FETCH, payload: filtered })
  }

  useEffect(() => {
    if (isFocused) {
      if (currentUser && currentUser.data) {
        fetchUnreadGroups(currentUser.data.id as string, { dispatchUser, dispatchGroups }).then(() => {
          if (!currentGroups?.data?.length) {
            navigation?.navigate("Home")
            handleLatestMessage()
          }
        })
      }
    }
  }, [isFocused])

  console.log("LatestMessage length: ", currentGroups?.data?.length)
  console.log("LatestMessage: ", currentGroups?.data)

  return (
    <GestureHandlerRootView style={{ width, height }}>
      <View style={styles.container}>
        {
          currentGroups?.isLoading ?
            <Loading />
            :
            currentGroups?.data?.length ? currentGroups?.data.slice(0, 2).map((group, i) => (
              <MessageSwipe handleLatestMessage={() => {
                handleLatestWithUnreadGroup(currentUser?.data?.id as string, group.id + "", { dispatchUser, dispatchGroups })
                handleLatestMessage()
              }} length={group?.latestMessage?.length ?? 0} rotate={i % 2 == 0 ? "-10deg" : "10deg"} data={group} onRemove={removeMessage} key={i} />
            )) :
              <MessageSwipe handleLatestMessage={handleLatestMessage} length={currentGroups?.data?.length ?? 0} rotate="0deg" data={currentGroups?.data && currentGroups?.data[0]} onRemove={removeMessage} />

        }
        <FloatButton position={(currentGroups?.data?.length ?? 0) >= 2 ? "right" : "bottom"} translate={(currentGroups?.data?.length ?? 0) >= 2 ? "X" : "Y"} handleLatestMessage={() => handleLatestMessage()} />
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
