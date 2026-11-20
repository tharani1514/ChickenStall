
import { createDrawerNavigator } from "@react-navigation/drawer";

import Setting from "../Screen/Setting";
import StackNav from "./StackNav";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "blue",
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={StackNav}
      />

      <Drawer.Screen
        name="Setting"
        component={Setting}
      />
    </Drawer.Navigator>
  );
}
