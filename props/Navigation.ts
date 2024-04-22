import { StackNavigationProp } from "@react-navigation/stack";
import { RootParamList } from "../navigators/MainNavigator";
import { RouteProp } from "@react-navigation/native";



type NavigationProp = {
  navigation?: StackNavigationProp<
    RootParamList,
    keyof RootParamList,
    undefined
  >;
  route?: RouteProp<RootParamList, keyof RootParamList>;
};

export { NavigationProp };
