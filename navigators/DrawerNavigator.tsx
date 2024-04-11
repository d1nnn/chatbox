import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import About from "../screens/About";
import { CustomDrawerContent } from "./CustomeDrawerContent";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen component={Home} name="Home" />
      <Drawer.Screen component={About} name="About" />
    </Drawer.Navigator>
  );
}
