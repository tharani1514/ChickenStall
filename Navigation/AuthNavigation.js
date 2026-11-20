import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../Context/AuthContext";
import Login from "../Screen/Login";
import Register from "../Screen/Register";
import ForgotPassword from "../Screen/ForgotPassword";
import DrawerNav from "./DrawerNav";

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="FoodieApp" component={DrawerNav} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigation;
