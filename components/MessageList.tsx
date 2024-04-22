import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";


type MessageListType = {
  data: MessageType[]
}

const { width, height } = Dimensions.get('window')

export default function MessageList({ data }: MessageListType): React.JSX.Element {
  const { state: currentUser } = useLogin()
  const flatListRef = useRef<FlatList>(null)

  const Item = ({ data }: { data: MessageType }) => (
    <View
      key={data.id}
      style={[styles.messageContainer,
      (data.userid === currentUser?.data?.id) && styles.messageContainerRight]}
    >
      {currentUser?.data?.id != data.userid && <Image source={{ uri: data.user?.photoUrl + "" }} style={{ height: 48, width: 48, borderRadius: 48 / 2 }} />}
      <Text style={[styles.messageText, data.userid === currentUser?.data?.id && { backgroundColor: 'orange' }]}>{data.content}</Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={({ item }) => <Item data={item} />}
      keyExtractor={(item: MessageType) => item.id + ""}
      getItemLayout={(data, index) => (
        { length: 40, offset: 40 * index, index }
      )}
      onContentSizeChange={() => {
        if (flatListRef && flatListRef.current?.scrollToIndex && data && data.length) {
          flatListRef.current.scrollToIndex({ index: data.length - 1 });
        }
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    height: height * 95 / 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width,
    gap: 20,
  },
  inputMessage: {
    padding: 10,
    backgroundColor: '#333',
    width: width / 1.5,
    borderRadius: 10,
    color: 'white'
  },
  messages: {
    width,
    minHeight: height * 85 / 100,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  messageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  messageContainerRight: {
    alignSelf: 'flex-end',
  },
  messageText: {
    padding: 15,
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 20,
  },
})
