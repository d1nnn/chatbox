import { FontAwesome5 } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Dimensions, Text, StyleSheet, NativeSyntheticEvent } from "react-native";
import NewMessage from "./NewMessage";
import { GroupType } from "../types/GroupTypes";

interface IMessageSwipe {
  onRemove: (id: string) => void
  data: GroupType,
  length: number
  rotate: string
};
const WIDTH_CARD = Dimensions.get('window').width * 0.85;
const ITEM_HEIGHT = 70;
const WIDTH_SCREEN = Dimensions.get('window').width;

const SHADOW = {
  shadowColor: "black",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.5,
  shadowRadius: 5,
}

const MessageSwipe: React.FC<IMessageSwipe> = ({ onRemove, data, length, rotate }) => {
  const swipeTranslateX = useSharedValue(0);
  const pressed = useSharedValue(false);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(20);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      const isShouldDismiss = swipeTranslateX.value < -WIDTH_SCREEN * 0.3
      if (isShouldDismiss) {
        itemHeight.value = withTiming(0)
        marginVertical.value = withTiming(0)
        swipeTranslateX.value = withTiming(-WIDTH_SCREEN, undefined, (isDone) => {
          if (isDone) {
            runOnJS(onRemove)(data?.id + "")

            swipeTranslateX.value = WIDTH_SCREEN
            swipeTranslateX.value = withTiming(0, { duration: 500 })
          }
        })
      } else {
        swipeTranslateX.value = withSpring(0);
      }
      pressed.value = false
    });
  const transformStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: swipeTranslateX.value },
      { scale: withTiming(pressed.value ? 1.15 : 1) },
    ],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: swipeTranslateX.value < -WIDTH_SCREEN * 0.7 ? 0 : 1
  }));

  const itemHeightStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View>
        <Animated.View style={[transformStyle]}>
          <NewMessage data={data} scale={1.2} length={length} rotate={rotate} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
};

export default MessageSwipe

const styles = StyleSheet.create({
  container: {
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333'
  },
  headerText: {
    color: '#FF6B35',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30
  },
  containerHeaderText: {
    ...SHADOW,
    width: WIDTH_SCREEN,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8E6CF',
    borderBottomColor: '#FF6B35',
    borderBottomWidth: 1,
    paddingVertical: 30
  },
  fieldContainer: {
    backgroundColor: '#FF165D',
    justifyContent: 'center',
    width: WIDTH_CARD,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    borderRadius: 20,
    ...SHADOW
  },
  iconContainer: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    right: '10%',
    justifyContent: 'center'
  },
  viewContainer: {
    alignItems: 'center',
    width: WIDTH_SCREEN,
  }
});
