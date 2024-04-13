import { createDrawerNavigator } from "@react-navigation/drawer"
import Home from "../screens/Home"
import About from "../screens/About"
import { CustomDrawerContent } from "./CustomeDrawerContent"
import LatestMessage from "../screens/LatestMessage"
const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true, headerTransparent: true, headerTitle: "" }} initialRouteName="Recent" drawerContent={CustomDrawerContent}>
      <Drawer.Screen component={LatestMessage} name="Recent" />
      <Drawer.Screen component={About} name="About" />
    </Drawer.Navigator>
  )
}
