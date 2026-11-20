
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Navigation
import TabNav from "./TabNav";

// Screens
import Product from "../Screen/Product";
import Checkout from "../Screen/Checkout";
import Addresses from "../Screen/Addresses";
import AddAddress from "../Screen/AddAddress";
import Payment from "../Screen/Payment";
import OrderSuccess from "../Screen/OrderSuccess";
import PaymentSuccess from "../Screen/PaymentSuccess";
import OrderTracking from "../Screen/OrderTracking";
import Orders from "../Screen/Orders";
import Wishlist from "../Screen/Wishlist";

const StackNav = createNativeStackNavigator();

export default function Stack({ navigation }) {
  return (
    <StackNav.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      {/* Home */}
      <StackNav.Screen
        name="HomeTabs"
        component={TabNav}
        options={{
          title: "Foodie World",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.dispatch(DrawerActions.openDrawer())
              }
              style={{ marginLeft: 10 }}
            >
              <Ionicons
                name="menu"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Product */}
      <StackNav.Screen
        name="Product"
        component={Product}
        options={{ title: "Product Details" }}
      />

      {/* Checkout Flow */}
      <StackNav.Screen
        name="Checkout"
        component={Checkout}
        options={{ title: "Checkout" }}
      />

      <StackNav.Screen
        name="Addresses"
        component={Addresses}
        options={{ title: "Delivery Addresses" }}
      />

      <StackNav.Screen
        name="AddAddress"
        component={AddAddress}
        options={{ title: "Address Details" }}
      />

      <StackNav.Screen
        name="Payment"
        component={Payment}
        options={{ title: "Payment Method" }}
      />

      {/* Order Success */}
      <StackNav.Screen
        name="OrderSuccess"
        component={OrderSuccess}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* Payment Success */}
      <StackNav.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* Order Tracking */}
      <StackNav.Screen
        name="OrderTracking"
        component={OrderTracking}
        options={{ title: "Track Order" }}
      />

      {/* Account */}
      <StackNav.Screen
        name="Orders"
        component={Orders}
        options={{ title: "My Orders" }}
      />

      <StackNav.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ title: "Favourites" }}
      />
    </StackNav.Navigator>
  );
}
