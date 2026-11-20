import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../Screen/Home";
import Cart from "../Screen/Cart";
import Profile from "../Screen/Profile";
import Setting from "../Screen/Setting";
import { useShop } from "../Context/ShopContext";

const Tab = createBottomTabNavigator();

const TabNav = () => {
  const { cartCount } = useShop();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "grey",

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Setting") {
            iconName = "settings-outline";
          } else if (route.name === "Cart") {
            iconName = "cart-outline";
          } else {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Setting" component={Setting} />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNav;
